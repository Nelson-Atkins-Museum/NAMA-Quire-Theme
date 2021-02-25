//@ts-check

/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */
// Stylesheets
import 'intersection-observer';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import '../css/application.scss';
import 'leaflet/dist/leaflet.css';
import quicklink from "quicklink";

// JS Libraries (add them to package.json with `npm install [library]`)
import $ from 'jquery';
import 'velocity-animate';
import './soundcloud-api';

// Modules (feel free to define your own and import here)
import {
  smoothScroll,
  enableScroll,
  disableScroll,
  preloadImages,
  stopVideo
} from './helper';
import Search from './search';
import Navigation from './navigation';
import Popup from './popup';
import DeepZoom from './deepzoom';
import Map from './map';
// Nelson-Atkins modules
import timelineModalSetup from "./timeline";
import resizerSetup from "./resizer";
import captionSetup from "./caption";
// import figureMenuSetup from "./figuremenu";
import dualViewSetup from "./dualview";

/**
 * Global state for the application—necessary for certain
 * UI functions.
 */
let state = {
  deepZooms: [],
  dualView: false,
  toggleIndex: 0,
  articleScroll: 0
}

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additional binding.
 */
window.toggleMenu = () => {
  let nav = document.querySelector('.quire-navbar');
  let primary = document.querySelector('.quire__primary');
  // nav.style.top = `${window.scrollY + nav.getBoundingClientRect().top}px`
  let menu = document.getElementById('site-menu');
  document.getElementsByClassName
  let menuAriaStatus = menu.getAttribute('aria-expanded');
  menu.classList.toggle('is-expanded');
  if (menuAriaStatus === 'true') {
    // nav.style.top = ``
    // enableScroll(primary);
    // $('.side-by-side > .quire-entry__image-wrap > .quire-entry__image').removeClass('menu_open')
    menu.setAttribute('aria-expanded', 'false');
  } else {
    // disableScroll(primary);
    // $('.side-by-side > .quire-entry__image-wrap > .quire-entry__image').addClass('menu_open')
    menu.setAttribute('aria-expanded', 'true');
  }
};

/**
 * activeMenuPage
 * @description This function is called on pageSetup to go through the navigation
 * (#nav in partials/menu.html) and find all the anchor tags.  Then find the user's
 * current URL directory. Then it goes through the array of anchor tags and if the
 * current URL directory matches the nav anchor, it's the active link.
 */
function activeMenuPage() {
  let nav = document.getElementById('nav');
  let anchor = nav.getElementsByTagName('a');
  let current = window.location.protocol + '//' + window.location.host + window.location.pathname;
  for (var i = 0; i < anchor.length; i++) {
    if (anchor[i].href == current) {
      anchor[i].className = 'active';
    }
  }
}

/**
 * toggleSearch
 * @description Show/hide the search UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additinoal binding.
 */
window.toggleSearch = () => {
  let searchControls = document.getElementById('js-search');
  let searchInput = document.getElementById('js-search-input');
  let searchAriaStatus = searchControls.getAttribute('aria-expanded');
  searchControls.classList.toggle('is-active');
  if (searchAriaStatus === 'true') {
    searchControls.setAttribute('aria-expanded', 'false');
  } else {
    searchInput.focus();
    searchControls.setAttribute('aria-expanded', 'true');
  }
};

/**
 * sliderSetup
 * @description Set up the simple image slider used on catalogue entry pages for
 * objects with multiple figure images. See also slideImage function below.
 */
function sliderSetup() {
  const sliders = document.querySelectorAll(".quire-entry__image__group-container");
  sliders.forEach((slider) => {
    // First/Last Image setup
    const sliderImages = slider.querySelectorAll("figure");
    const firstImage = sliderImages.item(0);
    const lastImage = sliderImages.item(sliderImages.length - 1);
    firstImage.classList.add("current-image");
    firstImage.classList.add("first-image");
    firstImage.style.display =" flex";
    lastImage.classList.add("last-image");

    sliderImages.forEach((sliderImage, idx) => {
      if (idx > 0) {
        sliderImage.classList.add("visually-hidden");
      }
      if (sliderImages.length > 1) {
        const counterDiv = document.createElement("div");
        counterDiv.classList.add("quire-counter-container");
        const counterSpan = document.createElement("span");
        counterSpan.classList.add("counter");
        counterSpan.appendChild(
          document.createTextNode(`${idx + 1} of ${sliderImages.length}`)
        );
        counterDiv.appendChild(counterSpan);
        sliderImage.querySelector('.quire-image-counter-download-container')
        .appendChild(counterDiv);
      }
    });
    
    
  })
  let images = [...document.querySelectorAll('.quire-deepzoom-entry')]
    .filter(v => {
      return v.getAttribute('src') !== null ? v : ''
    })
    .map(v => {
      return v.getAttribute('src')
    })
  preloadImages(images, () => {
    mapSetup('.quire-map-entry');
    deepZoomSetup('.quire-deepzoom-entry');
  });
}

/**
 * slideImage
 * @description Slide to previous or next catalogue object image in a loop.
 * Supports any number of figures per object, and any number of objects
 * per page.
 */
window.slideImage = (direction) => {
  let slider = $('.quire-entry__image__group-container');
  let firstImage = slider.children('.first-image');
  let lastImage = slider.children('.last-image');
  let currentImage = slider.children('.current-image');
  let nextImage = currentImage.next('figure');
  let prevImage = currentImage.prev('figure');
  stopVideo(document.querySelector('.current-image'));
  currentImage.hide();
  currentImage.removeClass('current-image');
  if (direction == 'next') {
    if (currentImage.hasClass('last-image')) {
      firstImage.addClass('current-image');
      firstImage.css('display', 'flex');
      firstImage.removeClass('visually-hidden');
    } else {
      nextImage.addClass('current-image');
      nextImage.css('display', 'flex');
      nextImage.removeClass('visually-hidden');
    }
  } else if (direction == 'prev') {
    if (currentImage.hasClass('first-image')) {
      lastImage.addClass('current-image');
      lastImage.css('display', 'flex');
      lastImage.removeClass('visually-hidden');
    } else {
      prevImage.addClass('current-image');
      prevImage.css('display', 'flex');
      prevImage.removeClass('visually-hidden');
    }
  }
};

/**
 * search
 * @description makes a search query using Lunr
 */
window.search = () => {
  let searchInput = document.getElementById('js-search-input');
  let searchQuery = searchInput.value;
  let searchInstance = window.QUIRE_SEARCH;
  let resultsContainer = document.getElementById('js-search-results-list');
  let resultsTemplate = document.getElementById('js-search-results-template');
  if (searchQuery.length >= 3) {
    let searchResults = searchInstance.search(searchQuery);
    displayResults(searchResults, searchQuery);
  }

  function clearResults() {
    resultsContainer.innerText = '';
  }

  function getExcerpt(text, query) {
    // Skip past the tombstone using the DOI text as a search key
    const doiIdx = text.search(/doi:.+\n/);
    const searchStart = doiIdx >= 0 ? doiIdx + 21 : 0;
    // Use only the rest of the content as our search
    const searchText = text.substring(searchStart);
    // Query Regexp that helps block off phrases
    const queryRegExp = new RegExp(query, "gi");
    // Use global, case-insensitive regex for bolding our results
    const phraseRegExp = /\n|;\s\w|\.\s\W/g;
    // Find first occurrence of query
    const queryIdx = searchText.search(queryRegExp);
    const excerptKey = queryIdx >= 0 ? queryIdx : 0;
    // Split the searchText before/after result key
    const excerptTop = searchText.substring(0, excerptKey);
    const excerptBottom = searchText.substring(excerptKey);
    // Seek the nearest phrase break BEFORE the result key
    const startIdx = Array.from(excerptTop.matchAll(phraseRegExp)).reverse()[0];
    const excerptStart = startIdx == undefined ? 0 : startIdx.index + 1;
    // Seek the nearest phrase break AFTER the result key
    const endIdx = excerptBottom.search(phraseRegExp);
    // Safety catch in case there is no phrase break?
    const excerptEnd = endIdx >= 0 ? endIdx : excerptKey + 300;
    const excerpt = excerptTop.substring(excerptStart) + excerptBottom.substring(0, excerptEnd);
    return excerpt.replace(queryRegExp, "<b>$&</b>");
  }

  function displayResults(results, query) {
    clearResults();
    results.forEach(result => {
      let clone = document.importNode(resultsTemplate.content, true);
      let item = clone.querySelector('.js-search-results-item');
      let title = clone.querySelector('.js-search-results-item-title');
      let type = clone.querySelector('.js-search-results-item-type');
      let length = clone.querySelector('.js-search-results-item-length');
      let excerpt = clone.querySelector('.js-search-results-excerpt');
      item.href = result.url;
      title.textContent = result.title;
      if(result.type.indexOf("-") > 0) {
        type.textContent = result.type.substr(0, result.type.indexOf("-"));
      } else {
        type.textContent = result.type ? result.type : "coming soon";
      }
      length.textContent = result.length ? result.length : "0";
      excerpt.innerHTML = getExcerpt(result.content, query);
      resultsContainer.appendChild(clone);
    });
  }
};

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup() {
  let container = document.getElementById('container');
  container.classList.remove('no-js');
  var classNames = [];
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) classNames.push('device-ios');
  if (navigator.userAgent.match(/android/i)) classNames.push('device-android');

  var body = document.getElementsByTagName('body')[0];

  if (classNames.length) classNames.push('on-device');
  if (body.classList) body.classList.add.apply(body.classList, classNames);
  loadSearchData();
  scrollToHash();
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData() {
  // Grab search data
  let dataURL = $('#js-search').data('search-index');
  $.get(dataURL, {
    cache: true
  }).done(data => {
    data = typeof data === 'string' ? JSON.parse(data) : data
    window.QUIRE_SEARCH = new Search(data);
  });
}


/**
 * navigation
 * @description Turn on ability to use arrow keys
 * to get next adn previous pages
 */
let navigation;

function navigationSetup() {
  if (!navigation) {
    navigation = new Navigation();
  }
}

/*
function navigationTeardown() {
  if (navigation) {
    navigation.teardown();
  }
  navigation = undefined;
}
*/

/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */
function scrollToHash() {
  let $scroller = $('#main');
  let $navbar = $('.quire-navbar');
  let targetHash = window.location.hash;

  if (targetHash) {
    let targetHashEl = document.getElementById(targetHash.slice(1));
    let $targetHashEl = $(targetHashEl);

    if ($targetHashEl.length) {
      let newPosition = $targetHashEl.offset().top;
      if ($navbar.length) {
        newPosition -= $navbar.height();
      }
      $scroller.scrollTop(newPosition);
    }
  } else {
    $scroller.scrollTop(0);
  }
}

/**
 * @description
 * Set up modal for media
 */
function popupSetup(figureModal) {
  if (figureModal) {
    Popup('.q-figure__wrapper');
  } else {
    mapSetup('.quire-map');
    deepZoomSetup('.quire-deepzoom');
  }
}

/**
 * @description
 * Render Map if Popup @false
 */
function mapSetup(ele) {
  return [...document.querySelectorAll(ele)].forEach(v => {
    let id = v.getAttribute('id');
    new Map(id);
  });
}

/**
 * @description
 * Render deepzoom or iiif if Popup @false
 */
function deepZoomSetup(ele, ) {
  state.deepZooms = [];
  return [...document.querySelectorAll(ele)].forEach(v => {
    let id = v.getAttribute('id');
    const deepZoom = new DeepZoom(id);
    state.deepZooms.push(deepZoom);
  });
}

/**
 * @description
 * Adding GoogleChromeLabs quicklinks https://github.com/GoogleChromeLabs/quicklink
 * For faster subsequent page-loads by prefetching in-viewport links during idle time
 */
function quickLinksSetup() {
  let links = [...document.getElementsByTagName('a')];
  links = links.filter(a => {
    return a.hostname === window.location.hostname;
  });
  quicklink({
    urls: links,
    timeout: 4000,
    ignores: [
      /tel:/g,
      /mailto:/g,
      /#(.+)/,
      uri => uri.includes('tel:'),
      uri => uri.includes('mailto:'),
      uri => uri.includes('#')
    ]
  })
}

/**
 * @description
 * Set the date for the cite this partial
 * https://github.com/gettypubs/quire/issues/153
 * Quire books include a "Cite this Page" feature with page-level citations formatted in both Chicago and MLA style.
 * For MLA, the citations need to include a date the page was accessed by the reader.
 *
 */
function setDate() {
  let $date = $('.cite-current-date')
  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  let today = new Date();
  let formattedDate = today.toLocaleDateString("en-US", options).indexOf('May') !== -1 ? today.toLocaleDateString("en-US", options) : [today.toLocaleDateString("en-US", options).slice(0, 3), '. ', today.toLocaleDateString("en-US", options).slice(4)].join('')
  $date.empty();
  $date.text(formattedDate);
}

/**
 * pageSetup
 * @description This function is called after each smoothState reload.
 * Initialize any jquery plugins or set up page UI elements here.
 */
function pageSetup() {
  setDate();
  quickLinksSetup();
  activeMenuPage();
  sliderSetup();
  navigationSetup();
  popupSetup(figureModal);
  smoothScroll();
  resizerSetup(state);
  captionSetup();
  // figureMenuSetup(state);
  dualViewSetup(state);
  timelineModalSetup();
}

/**
 * pageTeardown
 * @description This function is called before each smoothState reload.
 * Remove any event listeners here.
 */
/*
function pageTeardown() {
  navigationTeardown();
}
*/

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup();

// Run when document is ready
window.onload = () => {
  pageSetup();
}
