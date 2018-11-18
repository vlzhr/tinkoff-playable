function addButtonsActions() {
    document.querySelector(".button-lt").addEventListener("click", function (ev) {
        moveWolf(0, 0);
        ev.stopPropagation();
    });
    document.querySelector(".button-lb").addEventListener("click", function (ev) {
        moveWolf(0, 1);
        ev.stopPropagation();
    });
    document.querySelector(".button-rb").addEventListener("click", function (ev) {
        moveWolf(1, 1);
        ev.stopPropagation();
    });
    document.querySelector(".button-rt").addEventListener("click", function (ev) {
        moveWolf(1, 0);
        ev.stopPropagation();
    });
}

addButtonsActions();
