function Winscreen() {
    this.node = document.querySelector(".winscreen");
    this.preNode = document.querySelector(".pre-winscreen");

    this.actualizeLabels = (value) => {
        this.node.querySelector(".label").innerHTML = value + "$";
        this.preNode.querySelector(".label").innerHTML = value + "$";
    };

    this.show = (value) => {
        this.actualizeLabels(value);
      this.preNode.classList.add("shown");
      window.setTimeout(() => {
          this.preNode.classList.remove("shown");
          this.node.classList.add("shown");
      }, 2000);
    };
}


function Panel() {
    // top panel with achievements control
    this.node = document.querySelector(".header-panel");
    this.pointsValueNode = document.querySelector(".points-counter");
    this.arrowNode = document.querySelector(".profit-arrow");
    this.pointsValueNode.innerText = 0;
    this._value = 0;
    this.changeValue = function (delta) {
        this._value += delta;
        this.pointsValueNode.innerText = this._value;
        if (delta > 0) { this.arrowNode.classList.remove("bad"); }
        else { this.arrowNode.classList.add("bad"); }
    };
    this.getValue = () => {
        return this._value;
    }
}

function Egg(num) {
    this.node = document.querySelector(".egg-"+num);

    this.generateCoinImageLink = function(name) {
        var link = name + "_l.png";
        var randomValue = Math.random();
        if (randomValue > 0.7) { link = "red_"+link; }
        return "coins/" + link;
    };

    this.hide = () => {
        this.node.style["transition"] = "";
        this.node.style["-webkit-transition"] = "";
        this.node.classList.remove("shown", "moved");
    };

    this.run = (coin, interval) => {
        this.node.style["content"] = "url("+this.generateCoinImageLink(coin.value)+")";
        this.node.classList.add("shown", "moved");
        this.node.style["transition"] = "margin " + interval + "ms raise-in";
        this.node.style["-webkit-transition"] = "margin " + interval + "ms linear";
        window.setTimeout(this.hide, interval);
    }
}

function Wolf() {
    this.node = document.querySelector(".player");
    this.gate = 1;

    this.changeView = function(right, bottom) {
        if (right) {
            this.gate[0] = 1;
            this.node.classList.add("right");
        } else {
            this.gate[0] = 0;
            this.node.classList.remove("right");
        }
        if (bottom) {
            this.gate[1] = 1;
            this.node.classList.add("bottom");
        } else {
            this.gate[1] = 0;
            this.node.classList.remove("bottom");
        }
    };

    this.move = function(gate) {
        this.gate = gate;
        this.changeView(...{1: [0,0], 2: [0,1], 3: [1,1], 4: [1,0]}[gate]);
    }

}

function Game() {
    this.coinsProfit = {
        "etf_china": {"plus": 100, "minus": -50},
        "etf_america": {"plus": 100, "minus": -40},
        "bitcoin": {"plus": 2000, "minus": -30},
        "dollar": {"plus": 60, "minus": -200},
        "eu": {"plus": 80, "minus": -40},
        "gbr": {"plus": 555, "minus": -20},
        "rub": {"plus": 666, "minus": -50},
        "yen": {"plus": 222, "minus": -30},
        "etf_gold": {"plus": 777, "minus": -35},
        "etf_IT": {"plus": 888, "minus": -11},
        "etf_usa": {"plus": 73, "minus": -88},
        "etf_japan": {"plus": 200, "minus": -98}
    };
    this.coinsDataList = Object.keys(this.coinsProfit);
    this.coins = [
        { "gate": 1, "value": "rub" },
        { "gate": 2, "value": this.coinsDataList[Math.floor(Math.random()*this.coinsDataList.length)] },
        { "gate": 4, "value": "bitcoin" },
        { "gate": 3, "value": this.coinsDataList[Math.floor(Math.random()*this.coinsDataList.length)] },
        { "gate": 1, "value": "etf_IT" },
        { "gate": 4, "value": this.coinsDataList[Math.floor(Math.random()*this.coinsDataList.length)] },
        { "gate": 2, "value": "bitcoin" },
        { "gate": 3, "value": this.coinsDataList[Math.floor(Math.random()*this.coinsDataList.length)] },
    ];

    this.currentStep = this.nextFallCoinNumber = 0;
    this.nextFallCoin = this.coins[0];
    this.goal = 15000;
    this.on = true;
    this.panel = new Panel();
    this.winscreen = new Winscreen();
    this.wolf = new Wolf();
    this.defaultInterval = this.interval = 2500;
    this.defaultDistanceInterval = this.distanceInterval = 1550;
    this.eggs = [new Egg(1), new Egg(2), new Egg(3), new Egg(4)];

    this.checkAfterStep = () => {
        if (this.nextFallCoin.gate === this.wolf.gate) {
            this.panel.changeValue(this.coinsProfit[this.nextFallCoin.value].plus);
        } else if (this.on) {
            this.panel.changeValue(this.coinsProfit[this.nextFallCoin.value].minus);
        }
        if (this.panel.getValue() >= this.goal) {
            this.end(true);
        }
        this.nextFallCoinNumber++;
        this.nextFallCoin = this.coins[this.nextFallCoinNumber%this.coins.length];
    };

    this.setNextStep = () => {
        if (!(this.interval < this.defaultInterval/1.7)) {this.interval = Math.floor(this.interval*0.95);}
        if (!(this.distanceInterval < this.defaultDistanceInterval/1.3)) {this.distanceInterval = Math.floor(this.distanceInterval*0.97);}
        this.currentStep++;
        if (this.currentStep >= this.coins.length) { this.currentStep -= this.coins.length; }
    };

    this.makeStep = () => {
        if (!this.on) { return; }
        var coin = this.coins[this.currentStep];
        this.eggs[coin.gate-1].run(coin, this.interval);
        window.setTimeout(this.checkAfterStep, this.interval);
        window.setTimeout(this.makeStep, this.distanceInterval);
        this.setNextStep();
    };

    this.run = () => {
        this.on = true;
        this.makeStep();
    };

    this.end = (showWinscreen) => {
        this.on = false;
        this.winscreen.show(this.panel.getValue());
    }
}

var game;
function setUp() {
    (function addButtonsActions() {
        document.querySelector(".button-lt").addEventListener("click", function (ev) {
            game.wolf.move(1);
            ev.stopPropagation();
        });
        document.querySelector(".button-lb").addEventListener("click", function (ev) {
            game.wolf.move(2);
            ev.stopPropagation();
        });
        document.querySelector(".button-rb").addEventListener("click", function (ev) {
            game.wolf.move(3);
            ev.stopPropagation();
        });
        document.querySelector(".button-rt").addEventListener("click", function (ev) {
            game.wolf.move(4);
            ev.stopPropagation();
        });
    })();

    var preloadImages = [];
    function preload() {
        for (var i = 0; i < arguments.length; i++) {
            preloadImages[i] = new Image();
            preloadImages[i].src = preload.arguments[i];
        }
    }

    game = new Game();
    preload("bottom-player.png");
    for (var c of game.coins) {
        preload("coins/"+c.value+"_l.png");
        preload("coins/red_"+c.value+"_l.png");
    }
    window.setTimeout(game.run, 300);
}
document.addEventListener("DOMContentLoaded", setUp);


