const cycleImages = (images, n) => {
    for(let i=0; i < images.length; i++) {
        const image = images[i];
        if (image.classList.contains("active")) { 
            image.classList.remove("active");
            let newIdx = i + n;
            if (newIdx >= images.length) {
                newIdx = 0;
            }
            if (newIdx < 0) {
                newIdx = images.length - 1;
            }
            images[newIdx].classList.add("active");
            return;
        }
    }
}


const timelineModalSetup = () => {
    // Trigger expansions
    document.querySelectorAll(".nama-timeline__expand").forEach(e => {
        e.addEventListener("click", (e) => {
            const modal = e.target.parentElement.parentElement.querySelector(".nama-timeline__modal")
            modal.classList.toggle("is-active");
            modal.parentElement.classList.toggle("modal-active");
        });
    });
    // Handle next/prev
    document.querySelectorAll(".nama-timeline__modal").forEach((modal) => {
        const images = Array.from(modal.querySelectorAll(".nama-timeline__modal-img"));
        if (images.length > 0) {
            // Activate first image
            const firstImgSrc = modal.parentElement.querySelector("img").getAttribute("src");
            const firstImg = images.filter(image => image.querySelector("img").getAttribute("src") === firstImgSrc)[0];
            console.log(firstImg);
            if (firstImg) {
                firstImg.classList.add("active");
            } else {
                images[0].classList.add("active");
            }
        } else {
            // Remove expansion button if no images
            modal.parentElement.querySelector(".nama-timeline__expand").classList.add("hidden");
            console.error("No images for modal!");
        }
        if (images.length > 1) {
            // Add prev/next buttons for image sets > 1
            modal.querySelector(".next").addEventListener("click", () => {
                cycleImages(images, 1);
            });
            modal.querySelector(".prev").addEventListener("click", () => {
                cycleImages(images, -1);
            });
        } else {
            // Remove prev/next buttons for single images
            modal.querySelector(".next").classList.add("hidden");
            modal.querySelector(".prev").classList.add("hidden");
        }
    });

    // Trigger closures
    document.querySelectorAll(".nama-timeline__modal-close").forEach(e => {
        e.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.parentElement.parentElement.classList.toggle("is-active");
            e.target.parentElement.parentElement.parentElement.parentElement.parentElement.classList.toggle("modal-active");
        });
    });

}

export default timelineModalSetup;