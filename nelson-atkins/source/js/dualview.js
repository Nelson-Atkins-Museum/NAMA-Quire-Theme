import { stopVideo } from "./helper";

function resetZoom(state) {
    state.deepZooms.forEach( dz => {
        dz.map.getContainer().style.width = "";
        dz.map.invalidateSize();
        dz.map.fitWorld();
    });
}

/**
 * arrowButtonSetup
 * @description Slide to previous or next catalogue object image in a loop.
 * Supports any number of figures per object, and any number of objects
 * per page. This is a rewrite of slideImage() for dualview
 */
function arrowButtonSetup(state) {
    document.querySelectorAll(".na-image-control__slider")
    .forEach((c) => {
        c.addEventListener("click", (e) => {
            const btn = e.target;
            const slider = btn.parentElement;
            const firstImage = slider.querySelector(".first-image");
            const lastImage = slider.querySelector(".last-image");
            const currentImage = slider.querySelector(".current-image");
            const nextImage = currentImage.nextElementSibling || firstImage;
            // Prev requires some finesse here because the buttons are inline with figures
            const prevImage = currentImage.previousElementSibling.tagName === "FIGURE" ? currentImage.previousElementSibling : lastImage;
            stopVideo(currentImage);
            currentImage.classList.add("visually-hidden");
            currentImage.classList.remove("current-image");
            if (btn.classList.contains("na-image-control__next")) {
                nextImage.classList.add("current-image");
                nextImage.classList.remove("visually-hidden");
            } else if (btn.classList.contains("na-image-control__prev")) {
                prevImage.classList.add("current-image");
                prevImage.classList.remove("visually-hidden");
            }
            // resetZoom(state);
        })
    })
}

function qFigureSetup(state) {
    document.querySelectorAll(".q-figure__wrapper").forEach((q) => {
        const qIndicator = document.querySelector(".quire-entry__image-wrap");
        if(qIndicator) {
            const connectButton = document.createElement("span");
            connectButton.classList.add("fig", "nama-dualview-select");
            const connectIcon = document.createElement("i");
            connectIcon.classList.add("material-icons");
            connectIcon.appendChild(
                document.createTextNode("reply")
            );
            connectButton.appendChild(connectIcon);
            connectButton.addEventListener("click", (e) => {
                const imgId = e.target.parentElement.parentElement.querySelector("img").id;
                const activeViewer = document.querySelector(".dualview:not(.dualview-hidden");
                activeViewer.querySelectorAll("figure").forEach((f) => {
                    if(f.dataset.figure === imgId) {
                        f.classList.remove("visually-hidden");
                        f.classList.add("current-image");
                    } else {
                        f.classList.remove("current-image");
                        f.classList.add("visually-hidden");
                    }
                })
            });
            q.appendChild(connectButton);
        }
    });
}

function dualViewSetup(state) {
    arrowButtonSetup(state);
    qFigureSetup(state);
    document.querySelectorAll(".na-dualview-toggle")
    .forEach((t,idx,ts) => {
        t.addEventListener("click", (e) => {
            const btn = e.target;
            // Ridiculous I know, but this is how we get up to the image wrapper
            const imageFrame = btn.parentElement.parentElement.parentElement.parentElement.parentElement;
            // Frame to be removed
            const removeIndex = imageFrame.dataset.dualview == "0" ? 1 : 0; 
            // Frame to keep
            const toggleIndex = imageFrame.dataset.dualview == "0" ? 0 : 1;
            const removeFrame = document.querySelectorAll(".quire-entry__image-wrap")
            .item(removeIndex);
            const toggleFrame = document.querySelectorAll(".quire-entry__image-wrap")
            .item(toggleIndex);    
            
            const resizer = document.querySelector(".na-resizer");
            const content = document.querySelector(".quire-entry__content");
            const article = document.querySelector("article");
            state.toggleIndex = toggleIndex;
            if(state.dualView) {
                // Change state
                state.dualView = false;

                // Fix toggle classes
                content.classList.remove("dualview-toggled");
                removeFrame.classList.remove("dualview-toggled");
                toggleFrame.classList.remove("dualview-toggled");
                
                // Set up classes
                removeFrame.classList.add("hidden");
                ts.forEach( (t) => {
                    t.classList.remove("toggled");
                });
                
                // Clear any width setting from resizer;
                removeFrame.style.width = "";             
                toggleFrame.querySelector(".quire-entry__image").style.width = "";
                removeFrame.querySelector(".quire-entry__image").style.width = "";

                // Reset zoom levels
                resetZoom(state);
                
                // Bring back resizer
                resizer.classList.add("toggled");
                resizer.style.left = `${toggleFrame.clientWidth - 25}px`;

                // Adjust article scroll
                article.scroll({
                    top: state.articleScroll,
                    left: 0,
                    behavior: "auto"
                });

            } else {
                // Change state
                state.dualView = true;

                // Set up classes
                document.querySelector(".na-resizer").classList.remove("toggled");
                document.querySelectorAll(".quire-entry__image-wrap")
                .forEach( (w) => {
                    w.classList.remove("hidden");
                    w.classList.add("dualview-toggled");
                    w.style.width = "";
                    w.querySelector(".quire-entry__image").style.width = "";
                });
                ts.forEach( (t) => {
                    t.classList.add("toggled");
                });
                content.classList.add("dualview-toggled");

                // Clear any content mods from resizer
                content.style.width = "";
                content.style.left = "";
                // Reset zoom levels
                resetZoom(state);
                // Adjust article zoom
                state.articleScroll = article.scrollTop;
                article.scroll({
                    top: 150,
                    left: 0,
                    behavior: "auto"
                });
            }
        });
    });
}

export default dualViewSetup;