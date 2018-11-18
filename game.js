var gameData = [
    { "egg": 1, "value": 200 },
    { "egg": 2, "value": 200 },
    { "egg": 3, "value": -300 },
    { "egg": 2, "value": 200 }
];
var gameCounter = 0;
var pointsCounter = 0;
var gameon = true;

function gameStep() {
    if (!gameon) {return;}

    var step = gameData[gameCounter];
    moveEgg(step.egg);
    if (step.value > 0) {
        eggsNodes[step.egg].classList.remove("bad");
    } else {
        eggsNodes[step.egg].classList.add("bad");
    }

    window.setTimeout(function() {
        if (correctPlayerLocation(step)) {
            console.log("ok");
            pointsCounter += step.value;
            pointsCounterNode.innerText = pointsCounter;
            prizeNode.innerText = step.value + "$";
            flyPrize(step.value > 0);
        } else {
            console.log("loch");
        }
        gameCounter++;
        if (gameCounter >= gameData.length) {
            gameCounter = 0;
        }
        gameStep();
    }, eggMoveDuration*1000);
}

function correctPlayerLocation(step) {
    if (wolfLocation[0] == eggsData[step.egg].isRight && wolfLocation[1] == eggsData[step.egg].isBottom) {
        return true;
    } else {
        return false;
    }
}

