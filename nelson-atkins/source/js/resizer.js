/** 
 * @description
 * Setup the resizer slider between image/text divs
 * Interacts with window scroll event to maintain position
*/

function resizerSetup(state) {

    const resizer = document.querySelector(".na-resizer");
    if(!resizer) return null;
    let currentX, newX = 0;
    const maxImagePct = 0.75;
    const minImagePct = 0.25
  
    const adjustPosition = (newX) => {
      const imageWrapper = document
        .querySelectorAll(".quire-entry__image-wrap")
        .item(state.toggleIndex);
      const imageContainer = imageWrapper.querySelector(".quire-entry__image");
      const contentContainer = document.querySelector(".quire-entry__content");

      resizer.style.left = `${resizer.offsetLeft - newX}px`;
      imageWrapper.style.width = `${resizer.offsetLeft + 25}px`;
      imageContainer.style.width = `${resizer.offsetLeft + 25}px`;
      // contentContainer.style.left = `${resizer.offsetLeft + 25}px`;
      contentContainer.style.width =  `${document.body.clientWidth - (resizer.offsetLeft + 25)}px`;
      state.deepZooms.forEach( dz => {
        dz.map.getContainer().style.width = `${resizer.offsetLeft + 25}px`;
        dz.map.invalidateSize();
        dz.map.fitWorld();
      });
    }
    
    const drag = (e) => {
      e.preventDefault();
      newX = currentX - e.clientX;
      currentX = e.clientX;
      adjustPosition(newX);
      // Enforce min/max widths
      if(
        resizer.offsetLeft > document.body.clientWidth * maxImagePct || 
        resizer.offsetLeft < document.body.clientWidth * minImagePct
      ) {
        adjustPosition(newX * -1);
      }
    }
  
    const dragStart = (e) => {
      e.preventDefault();
      currentX = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = drag;
    }
  
    const dragEnd = (e) => {
      e.preventDefault();
      document.onmouseup = null;
      document.onmousemove = null;
    }
  
    resizer.onmousedown = dragStart;
    resizer.onmouseup = dragEnd;
    resizer.style.left = `calc(56vw - 41px)`;
  }

  export default resizerSetup;