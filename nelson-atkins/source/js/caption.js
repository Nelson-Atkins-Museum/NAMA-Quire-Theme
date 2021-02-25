function captionSetup() {
    const captionToggles = document.querySelectorAll(".na-image-caption-toggle");
    captionToggles.forEach( (c) => {
      c.addEventListener("click", (e) => {
        const captions = e.target.parentElement.parentElement
          .querySelectorAll(".quire-image-info");
        const localToggles = e.target.parentElement
          .querySelectorAll(".na-image-caption-toggle");
          console.log(localToggles);
        captions.forEach ( (caption) => {
          if(caption.classList.contains("hidden")) {
            caption.classList.remove("hidden");
            localToggles.forEach( (t) => { t.classList.add("toggled") });
          } else {
            caption.classList.add("hidden");
            localToggles.forEach( (t) => { t.classList.remove("toggled") });
          }
        });
      });
    });
  }

  export default captionSetup;