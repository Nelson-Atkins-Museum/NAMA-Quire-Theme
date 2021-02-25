function figureMenuSetup(state) {
    document.querySelectorAll(".na-image-menu__icon")
    .forEach( (i) => {
        i.addEventListener("click", (e) => {
            const menu = i.parentElement.querySelector(".na-image-menu__menu");
            if (menu.classList.contains("toggled")) {
                menu.classList.remove("toggled");
            } else {
                menu.classList.add("toggled")
            }
        });
    });

    document.querySelectorAll(".na-image-menu__menu-option")
    .forEach( (o) => {
        o.addEventListener("click", (e) => {
            o.parentElement.classList.remove("toggled");
            const currentFigure = o.parentElement.parentElement.parentElement.parentElement;
            const figures = currentFigure.parentElement.querySelectorAll("figure");
            const newFigure = figures[e.target.dataset.idx]
            currentFigure.classList.remove("current-image");
            currentFigure.classList.add("visually-hidden");
            newFigure.classList.add("current-image");
            newFigure.classList.remove("visually-hidden");
        })
    })
}

export default figureMenuSetup;