var playerNode, eggsNodes, gatesNodes, playgroundNode, pointsCounterNode, prizeNode;
var playgroundRect;
var eggsData = [];
var wolfLocation = [0, 0]; // [isRight, isBottom]
var eggWidth = 20, eggHeight = 25, gateWidth = 100;
var eggMoveDuration = 4;

document.addEventListener("DOMContentLoaded", function() {
    playerNode = document.querySelector(".player");
    eggsNodes = document.querySelectorAll(".egg");
    gatesNodes = document.querySelectorAll(".gate");
    playgroundNode = document.querySelector(".playground");
    pointsCounterNode = document.querySelector(".points-counter");
    prizeNode = document.querySelector(".prize");
    playgroundRect = playgroundNode.getBoundingClientRect();

    for (var n in [0,1,2,3]) {
        n = Number(n);
        var startPosition = getEggStartPosition(n);
        setEggPosition(n, startPosition[0], startPosition[1]);
        eggsData.push({"x": startPosition[0], "y": startPosition[1], "isRight": Math.floor(n/2), "isBottom": (n===1 || n===2) });
    }

    gameStep();
});

function getEggStartPosition(n) {
    var gateRect = gatesNodes[n].getBoundingClientRect();
    var topValue = gateRect.top - playgroundRect.top - eggHeight - 5;
    if (n > 1) {
        var leftValue = gateRect.left - playgroundRect.left + gateRect.width - eggWidth;
    } else {
        var leftValue = gateRect.left - playgroundRect.left;
    }
    return [leftValue, topValue];
}

function setEggPosition(n, leftValue, topValue) {
    eggsNodes[n].style.cssText = "left: " + leftValue + "px; top: " + topValue + "px;";
}

function moveWolf(right, bottom) {
    if (right) {
        wolfLocation[0] = 1;
        playerNode.classList.add("right");
    } else {
        wolfLocation[0] = 0;
        playerNode.classList.remove("right");
    }
    if (bottom) {
        wolfLocation[1] = 1;
        playerNode.classList.add("bottom");
    } else {
        wolfLocation[1] = 0;
        playerNode.classList.remove("bottom");
    }
}

function showEgg(num) {
    eggsNodes[num].classList.add("shown");
}

function moveEgg(num) {
    var eggNode = eggsNodes[num];
    eggNode.classList.add("shown");
    eggNode.classList.add("moved");
    window.setTimeout(function() {
        eggNode.classList.remove("shown");
        eggNode.classList.remove("moved");
    }, eggMoveDuration*1000)
}

function flyPrize(delta) {
    if (delta) {
        prizeNode.classList.remove("bad");
    } else {
        prizeNode.classList.add("bad");
    }

    prizeNode.classList.add("moved");
    window.setTimeout(function() {
        prizeNode.classList.remove("moved");
    }, 1000)
}

