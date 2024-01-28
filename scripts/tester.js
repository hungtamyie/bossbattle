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
var fighter;
function startGame() {
    console.log(images)
    lastTick = Date.now()
    myController = new Controller();
    fighter = new Fighter("mc",myController);
    fighter.x = 38;
    fighter.y = 35;
    fighter.currentState = "idle";
    fighter.animFrame = 0;
    drawFighter()
}
var myController;
window.onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    loadImages(IMAGES, startGame);
}

var hitboxes = [];
var dragStart = [];
function drawFighter(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    let currentAnimation = fighter.fighterDef.states[fighter.currentState]
    let directionMod = fighter.direction=="right"?1:-1
    let frameWidth = fighter.fighterDef.width;
    let frameHeight = fighter.fighterDef.height;
    let gridStartX = currentAnimation.gridPos[0]
    let gridStartY = currentAnimation.gridPos[1]
    let directionOffsetY = fighter.direction=="right"?0:frameHeight;
    ctx.drawImage(
        images[fighter.fighterDef.imageName],
        gridStartX*frameWidth +  fighter.animFrame*frameWidth,
        gridStartY*frameHeight + directionOffsetY,
        frameWidth,
        frameHeight,
        fighter.x - frameWidth/2 - fighter.fighterDef.xOffset*directionMod,
        fighter.y - frameHeight,
        frameWidth,
        frameHeight
    )

    for(let i = 0; i < hitboxes.length; i++){
        ctx.fillStyle = "rgba(0,255,0,0.3)";
        ctx.fillRect(fighter.x-hitboxes[i][0],fighter.y-hitboxes[i][1],hitboxes[i][2],hitboxes[i][3]);
    }
}

function turnFighter(){
    fighter.direction=fighter.direction=="right"?"left":"right"
}

document.addEventListener("mousedown",function(event){
    const rect = canvas.getBoundingClientRect()
    const x = Math.round((event.clientX - rect.left)/10)
    const y = Math.round((event.clientY - rect.top)/10)
    dragStart = [x,y]
    drawFighter()
    console.log("x: " + x + " y: " + y)
})

document.addEventListener("mouseup",function(event){
    const rect = canvas.getBoundingClientRect()
    const x = Math.round((event.clientX - rect.left)/10)
    const y = Math.round((event.clientY - rect.top)/10)
    hitboxes.push([fighter.x-dragStart[0],fighter.y-dragStart[1],Math.abs(dragStart[0]-x), Math.abs(dragStart[1]-y)])
    drawFighter()
    console.log("x: " + x + " y: " + y)
})

function undo(){
    hitboxes.pop()
    drawFighter()
}