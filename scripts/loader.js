function loadImages(names, callback) {
    var n,name,
        count  = names.length,
        onload = function() { if (--count == 0) callback(); };

    for(n = 0 ; n < names.length ; n++) {
        name = names[n];
        images[name] = document.createElement('img');
        images[name].addEventListener('load', onload);
        images[name].src = "./images/" + name + ".png";
    }
}

var IMAGES = ['background', 'blueFighter', 'greenFighter'];
var images = {};
var canvas;
var ctx;
var enemyFighter;
var enemyController;
var gameStartTime = Date.now()
function startGame() {
    gameStartTime = Date.now()
    console.log(images)
    lastTick = Date.now()
    myController = new Controller();
    enemyController = new Controller();
    myFighter = new Fighter("mc",myController,true);
    enemyFighter = new Fighter("mc",enemyController);
    enemyFighters.push(enemyFighter);
    tick();
}
function restart(){
    myFighter.reset()
    enemyFighter.reset()
    gameStartTime = Date.now()
}

var myController;
window.onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    loadImages(IMAGES, startGame);
}

var keysPressed = {};
var currentBindings = "american"
var bindings = {
    american: {
        "LEFT": "ARROWLEFT",
        "RIGHT": "ARROWRIGHT",
        "UP": "ARROWUP",
        "DOWN": "ARROWDOWN",
        "FLOURISH": "Y",
        "ROLL": " ",
        "PULL": "W",
        "BLOCK": "SHIFT",
        "ATTACK": "A",
        "TURN": "S",
        "JUMP": "D",
    },
    french: {
        "LEFT": "ARROWLEFT",
        "RIGHT": "ARROWRIGHT",
        "UP": "ARROWUP",
        "DOWN": "ARROWDOWN",
        "FLOURISH": "Y",
        "ROLL": " ",
        "PULL": "Z",
        "BLOCK": "SHIFT",
        "ATTACK": "Q",
        "TURN": "S",
        "JUMP": "D",
    }
}
function american(){
    currentBindings = "american"
}
function french(){
    currentBindings = "french"
}

bindings[currentBindings]["ATTACK"]
document.onkeydown = function(e){
    let key = e.key.toUpperCase();
    if(keysPressed[key] == true) return;
    keysPressed[key] = true;
    if(key == bindings[currentBindings]["ATTACK"]){
        myController.addAction("attack")
    }
    if(key == bindings[currentBindings]["TURN"]){
        myController.addAction("turn")
    }
    if(key == bindings[currentBindings]["JUMP"]){
        myController.addAction("jump")
    }
    if(key == bindings[currentBindings]["ROLL"]){
        myController.addAction("roll")
    }
    if(key == bindings[currentBindings]["FLOURISH"]){
        myController.addAction("flourish")
    }
    if(key == bindings[currentBindings]["BLOCK"]){
        myController.addAction("block")
        myController.setModifier("block",true)
    }
    if(key == bindings[currentBindings]["PULL"]){
        myController.addAction("matrix")
        myController.setModifier("pull",true)
    }
    if(key == bindings[currentBindings]["RIGHT"]){
        myController.setModifier("right",true)
    }
    if(key == bindings[currentBindings]["LEFT"]){
        myController.setModifier("left",true)
    }
    if(key == bindings[currentBindings]["UP"]){
        myController.setModifier("up",true)
    }
    if(key == bindings[currentBindings]["DOWN"]){
        myController.setModifier("down",true)
    }
}
document.onkeyup = function(e){
    let key = e.key.toUpperCase();
    keysPressed[key] = false;
    if(key == bindings[currentBindings]["BLOCK"]){
        myController.setModifier("block",false)
    }
    if(key == bindings[currentBindings]["PULL"]){
        myController.setModifier("pull",false)
    }
    if(key == bindings[currentBindings]["RIGHT"]){
        myController.setModifier("right",false)
    }
    if(key == bindings[currentBindings]["LEFT"]){
        myController.setModifier("left",false)
    }
    if(key == bindings[currentBindings]["UP"]){
        myController.setModifier("up",false)
    }
    if(key == bindings[currentBindings]["DOWN"]){
        myController.setModifier("down",false)
    }
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }