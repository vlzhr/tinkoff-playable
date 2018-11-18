//  adds ability to move wolf using swipes on the screen
//  isn't used in the final game version


document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("mousedown", mousedownHandler);
    document.body.addEventListener("mouseup", mouseupHandler);
});

var lastTouch;
function mousedownHandler(event) {
    lastTouch = [event.clientX, event.clientY];
}

function mouseupHandler (event) {
    var positionX = (event.clientX + lastTouch[0]) / 2;
    var deltaY = event.clientY - lastTouch[1];

    moveWolf(positionX > document.body.getBoundingClientRect().width / 2, deltaY > 0);
}


document.body.addEventListener("touchmove", fieldTouchHandler);

function fieldTouchHandler(event) {
    var x,y;

    x = event.clientX;
    y = event.clientY;

    if (!(x && y)) {
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY;
    } else if (!beingMoved) {
        return;
    }

    if (lastTouch) {
        var positionX = (x + lastTouch[0]) / 2;
        var deltaY = y - lastTouch[1];
        moveWolf(positionX > document.body.getBoundingClientRect().width / 2, deltaY > 0);
    }

    lastTouch = [x,y];

}

