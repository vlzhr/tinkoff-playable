function Panel() {
    // top panel with achievements control
    this.node = document.querySelector(".header-panel");
    this.pointsValueNode = document.querySelector(".points-counter");
    this.pointsValueNode.innerText = 0;
    this._value = 0;
    this.changeValue = function (delta) {
        this._value += delta;
        this.pointsValueNode.innerText = this._value;
    };
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
        this.node.classList.remove("shown", "moved");
    };

    this.run = (coin, interval) => {
        this.node.style["content"] = "url("+this.generateCoinImageLink(coin.value)+")";
        this.node.classList.add("shown", "moved");
        this.node.style["transition"] = "margin " + interval + "ms linear";
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
        "bitcoin": {"plus": 100, "minus": -30},
        "dollar": {"plus": 100, "minus": -200}
    };
    this.coins = [
        { "gate": 1, "value": "etf_china" },
        { "gate": 3, "value": "etf_america" },
        { "gate": 2, "value": "bitcoin" },
        { "gate": 1, "value": "dollar" }];

    this.currentStep = 0;
    this.on = true;
    this.panel = new Panel();
    this.wolf = new Wolf();
    this.defaultInterval = this.interval = 4000;
    this.eggs = [new Egg(1), new Egg(2), new Egg(3), new Egg(4)];

    this.checkAfterStep = () => {
        this.setNextStep();
        if (this.currentCoin.gate === this.wolf.gate) {
            this.panel.changeValue(this.coinsProfit[this.currentCoin.value].plus);
        } else {
            this.panel.changeValue(this.coinsProfit[this.currentCoin.value].minus);
        }
    };

    this.setNextStep = () => {
        if (!(this.interval < this.defaultInterval/1.7)) {this.interval *= 0.95;}
        this.currentStep++;
        if (this.currentStep >= this.coins.length) { this.currentStep -= this.coins.length; }
    };

    this.makeStep = () => {
        if (!this.on) { return; }
        var coin = this.currentCoin = this.coins[this.currentStep];
        this.eggs[coin.gate-1].run(coin, this.interval);
        window.setTimeout(this.checkAfterStep, this.interval);
        window.setTimeout(this.makeStep, this.interval+50);
    };

    this.run = () => {
        this.on = true;
        this.makeStep();
    };
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
    // window.setTimeout(game.run, 300);
}
document.addEventListener("DOMContentLoaded", setUp);


