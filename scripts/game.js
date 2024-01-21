var lastTime = Date.now();
var myFighter;
var enemyFighters = [];
function tick(){
    let curTime = Date.now();
    let delta=(curTime - lastTime)/10
    lastTime = curTime;

    ctx.clearRect(0,0,canvas.width,canvas.height)
    resetDrawQueues();
    ctx.drawImage(images.background, 0, 0)
    for(let i = 0; i < enemyFighters.length; i++){
        enemyFighters[i].updateAndDraw(delta);
        enemyFighters[i].readInputs();
    }
    runAI(delta)
    seperateFighters();
    myFighter.readInputs();
    myFighter.updateAndDraw(delta);
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < drawQueues["queue"+i].length; j++){
            let image = drawQueues["queue"+i][j];
            ctx.drawImage(image[0],image[1],image[2],image[3],image[4],image[5],image[6],image[7],image[8])
        }
    }
    window.requestAnimationFrame(tick)
}

var drawQueues = {}
function resetDrawQueues(){
    drawQueues = {
        queue0: [],
        queue1: [],
        queue2: [],
        queue3: [],
    }
}
function addImageToQueue(image){
    drawQueues["queue"+image[9]].push(image);
}

function seperateFighters(){
    for(let i = 0; i < enemyFighters.length; i++){
        var fighter = enemyFighters[i];
        if(fighter.currentAnimFrame().noCollide || myFighter.currentAnimFrame().noCollide) continue;
        if(Math.abs(fighter.x - myFighter.x) < (fighter.fighterDef.hitboxWidth/2 + myFighter.fighterDef.hitboxWidth/2)){
            if(fighter.x < myFighter.x){
                fighter.x -= 1;
                myFighter.x += 1;
            }
            else {
                fighter.x += 1;
                myFighter.x -= 1;
            }
        }
    }
}

var hasTurned = false;
var AIactionTimer = 0;
var AIstate = "defense";
var hasBlocked = 1;
var attackBored = 200;
var hasAttacked = 0;
var randomDirTimer = 15;
var flourishTimer = 200;
function runAI(delta){
    flourishTimer -= delta;
    AIactionTimer -= delta;
    randomDirTimer -= delta;
    attackBored -= delta/2;
    var distance = Math.abs(enemyFighter.x - myFighter.x)
    if(myFighter.currentState != "attack_top"){
        enemyController.setModifier("pull",false)
    }

    if(AIactionTimer < 0){
        if(enemyFighter.x < myFighter.x && enemyFighter.direction == "left"){
            enemyController.addAction("turn")
            AIactionTimer = 7;
        }
        if(enemyFighter.x > myFighter.x && enemyFighter.direction == "right"){
            enemyController.addAction("turn")
            AIactionTimer = 7;
        }
        if(myFighter.currentState == "dead"){
            if(Math.random() < 0.3){
                enemyController.addAction("flourish")
            }
            enemyController.setModifier("pull",false)
            enemyController.setModifier("block",false)
            enemyController.setModifier("right",false)
            enemyController.setModifier("left",false)
            AIactionTimer = 70;
            return;
        }
        if(distance > 30 && distance < 50){
            AIstate = "footsies"
            enemyController.setModifier("pull",false)
            enemyController.setModifier("block",false)
        }
        if(AIstate == "footsies"){
            if(randomDirTimer < 0){
                randomDirTimer = Math.random()*30 + 10;
                if(Math.random() < 0.5){
                    aiSetDir("forward")
                }
                else{
                    if(Math.random() < 0.8){
                        aiSetDir("backward")
                    }
                    else {
                        aiSetDir("none")
                    }
                }
                if(distance > 25){
                    if(Math.random() < 0.7){
                        aiSetDir("forward")
                    }
                    else if(flourishTimer < 0){
                        flourishTimer = 300;
                        enemyController.addAction("flourish")
                    }
                }
            }
            if(distance < 20){
                AIstate = "defense"
            }
            if(distance > 22 && Math.random() < 0.2){
                aiSetDir("forward")
                AIactionTimer = 20;
                if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
            }
            else if(distance > 30 && Math.random() < 0.2 && flourishTimer < 0){
                enemyController.addAction("flourish")
                flourishTimer = 300;
                AIactionTimer = 100;
            }
            enemyController.setModifier("pull",false)
            enemyController.setModifier("block",false)
            if(myFighter.currentState == "attack_top" && myFighter.animFrame >= 1 && distance < 20 && meFacing()){
                if(Math.random() < 0.6){
                    enemyController.setModifier("up",true)
                    enemyController.setModifier("down",false)
                    enemyController.addAction("block")
                    enemyController.setModifier("block",true)
                    AIactionTimer = 50;
                    AIstate == "defense"
                }
                else {
                    enemyController.addAction("matrix")
                    enemyController.setModifier("pull",true)
                    AIactionTimer = 20;
                    AIstate == "defense"
                }
            }
            else if(myFighter.currentState == "attack_mid" && myFighter.animFrame >= 1  && distance < 35 && meFacing()){
                enemyController.setModifier("up",false)
                enemyController.setModifier("down",false)
                enemyController.addAction("block")
                enemyController.setModifier("block",true)
                AIactionTimer = 50;
                AIstate == "defense"
            }
            else if(myFighter.currentState == "attack_bot" && myFighter.animFrame >= 1  && distance < 30 && meFacing()){
                enemyController.setModifier("up",false)
                enemyController.setModifier("down",true)
                enemyController.addAction("block")
                enemyController.setModifier("block",true)
                AIactionTimer = 50;
                AIstate == "defense"
            }
        }
        if(AIstate == "defense"){
            if(!meFacing()){
                AIstate = "superattack"
                return;
            }
            if(randomDirTimer < 0){
                randomDirTimer = Math.random()*30 + 10;
                if(Math.random() < 0.5){
                    aiSetDir("forward")
                }
                else{
                    if(Math.random() < 0.8){
                        aiSetDir("backward")
                    }
                    else {
                        aiSetDir("none")
                    }
                }
                if(distance > 25){aiSetDir("forward")}
            }
            if(Math.random() < 0.05 && !underThreat() && distance < 14){
                aiSetDir("backward")
                AIactionTimer = 60;
                if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
            }
            if(underThreat()){
                if(Math.random() < 0.05 && distance > 15 && underThreat() && distance < 50){
                    aiSetDir("backward")
                    AIactionTimer = 40;
                    if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
                }
                else if(Math.random() < 0.05 && distance > 5 && underThreat() && distance < 25){
                    aiSetDir("forward")
                    AIactionTimer = 30;
                    console.log("dodge")
                    if(enemyController.nextActions.length == 0)enemyController.addAction("roll")
                }
                else {
                    if(myFighter.currentState == "attack_top" && myFighter.animFrame >= 1 && distance < 20 && meFacing()){
                        if(Math.random() < 0.6){
                            enemyController.setModifier("up",true)
                            enemyController.setModifier("down",false)
                            enemyController.addAction("block")
                            enemyController.setModifier("block",true)
                            AIactionTimer = 50;
                            hasBlocked--
                        }
                        else {
                            enemyController.addAction("matrix")
                            enemyController.setModifier("pull",true)
                            AIactionTimer = 20;
                        }
                    }
                    else if(myFighter.currentState == "attack_mid" && myFighter.animFrame >= 1  && distance < 35 && meFacing()){
                        enemyController.setModifier("up",false)
                        enemyController.setModifier("down",false)
                        enemyController.addAction("block")
                        enemyController.setModifier("block",true)
                        AIactionTimer = 50;
                        hasBlocked--
                    }
                    else if(myFighter.currentState == "attack_bot" && myFighter.animFrame >= 1  && distance < 30 && meFacing()){
                        enemyController.setModifier("up",false)
                        enemyController.setModifier("down",true)
                        enemyController.addAction("block")
                        enemyController.setModifier("block",true)
                        AIactionTimer = 50;
                        hasBlocked--
                    }
                    else {
                        enemyController.setModifier("block",false)
                        if(hasBlocked <= 0){
                            AIstate = "attack";
                            hasBlocked = 1+Math.floor(Math.random()*3);
                            hasAttacked = 1+Math.floor(Math.random()*4);
                        }
                    }
                }
            }
            else {
                enemyController.setModifier("block",false)
            }

            if(attackBored < 0){
                AIstate = "attack";
                hasBlocked = 1+Math.floor(Math.random()*3);
                hasAttacked = 1+Math.floor(Math.random()*3);
            }
        }
        else if(AIstate == "baddefense"){
            enemyController.setModifier("pull",false)
            if(randomDirTimer < 0){
                randomDirTimer = Math.random()*30 + 10;
                if(Math.random() < 0.5){
                    aiSetDir("forward")
                }
                else{
                    if(Math.random() < 0.8){
                        aiSetDir("backward")
                    }
                    else if(Math.random() < 0.1 && flourishTimer < 0){
                        enemyController.addAction("flourish")
                        flourishTimer = 300;
                    }
                    else {
                        aiSetDir("none")
                    }
                }
            }
            if(distance < 25){
                var randomizer2 = Math.random()
                if(randomizer2 < 0.2){
                    enemyController.setModifier("up",true)
                    enemyController.setModifier("down",false)
                    enemyController.addAction("block")
                    enemyController.setModifier("block",true)
                    AIactionTimer = 60;
                    hasBlocked--
                }
                else if(randomizer2 < 0.8){
                    enemyController.setModifier("up",false)
                    enemyController.setModifier("down",false)
                    enemyController.addAction("block")
                    enemyController.setModifier("block",true)
                    AIactionTimer = 60;
                    hasBlocked--
                }
                else{
                    enemyController.setModifier("up",false)
                    enemyController.setModifier("down",true)
                    enemyController.addAction("block")
                    enemyController.setModifier("block",true)
                    AIactionTimer = 60;
                    hasBlocked--
                }
                if(hasBlocked <= 0){
                    AIstate = "defense";
                    hasBlocked = 1+Math.floor(Math.random()*3);
                    hasAttacked = 1+Math.floor(Math.random()*3);
                }
            }
            if(attackBored < 0){
                AIstate = "attack";
                hasBlocked = 1+Math.floor(Math.random()*3);
                hasAttacked = 1+Math.floor(Math.random()*3);
            }
        }
        else if (AIstate == "attack"){
            if(Math.random() < 0.1 && distance > 30 && flourishTimer < 0){
                enemyController.addAction("flourish")
                flourishTimer = 300;
            }
            if(!meFacing()){
                AIstate = "superattack"
                return;
            }
            enemyController.setModifier("block",false)
            if(distance > 50 && Math.random() < 0.1){
                aiSetDir("forward")
                AIactionTimer = 50;
                if(enemyController.nextActions.length == 0)enemyController.addAction("roll")
            }
            if(distance > 30 && Math.random() < 0.15 && distance > 60){
                aiSetDir("forward")
                AIactionTimer = 10;
                if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
            }
            if(underThreat()){
                AIstate = "defense";
                hasBlocked = 1+Math.floor(Math.random()*3);
                hasAttacked = 1+Math.floor(Math.random()*3);
                attackBored = 30;
                AIactionTimer = 0;
            }
            if(Math.random() < 0.5){
                AIstate = "superattack"
                hasBlocked = 1+Math.floor(Math.random()*3);
                hasAttacked = 1+Math.floor(Math.random()*3);
            }
            else if(Math.abs(enemyFighter.x - myFighter.x) < 23){
                aiAttack();
                AIactionTimer = 40;
                hasAttacked--
                if(hasAttacked <= 0){
                    if(Math.random() < 0.6){
                        AIstate = "defense";
                        hasBlocked = 1+Math.floor(Math.random()*3);
                        hasAttacked = 1+Math.floor(Math.random()*4);
                        attackBored = 100 + Math.random() * 200;
                    }
                    else {
                        AIstate = "baddefense";
                        hasBlocked = 1;
                        hasAttacked = 1+Math.floor(Math.random()*3);
                        attackBored = 300;
                    }
                }
            }
            else if(Math.abs(enemyFighter.x - myFighter.x) < 50 && Math.random() < 0.1 && !meAttacking()){
                aiSetDir("forward")
                if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
                AIactionTimer = 30;
            }
            else if(Math.abs(enemyFighter.x - myFighter.x) < 30){
                aiSetDir("forward")
                AIactionTimer = 10;
            }
        }
        else if(AIstate == "superattack"){
            enemyController.setModifier("block",false)
            if(Math.abs(enemyFighter.x - myFighter.x) < 25){
                aiAttack();
                AIactionTimer = 40;
                hasAttacked--
                if(hasAttacked <= 0){
                    if(Math.random() < 0.6){
                        AIstate = "attack";
                        hasBlocked = 1+Math.floor(Math.random()*3);
                        hasAttacked = 1+Math.floor(Math.random()*4);
                        attackBored = 100 + Math.random() * 200;
                    }
                    else {
                        AIstate = "baddefense";
                        hasBlocked = 1;
                        hasAttacked = 1+Math.floor(Math.random()*3);
                        attackBored = 300;
                    }
                }
            }
            else if(!meAttacking()){
                if(distance > 50){
                    aiSetDir("forward")
                    if(enemyController.nextActions.length == 0)enemyController.addAction("roll")
                    AIactionTimer = 30;
                }
                else {
                    aiSetDir("forward")
                    if(enemyController.nextActions.length == 0)enemyController.addAction("jump")
                    AIactionTimer = 30;
                }
            }
        }
    }
    
}

function underThreat(){
    var distance = Math.abs(enemyFighter.x - myFighter.x)
    if(myFighter.currentState == "attack_top" && myFighter.animFrame >= 0 && distance < 25 && meFacing()){
        return true;
    }
    else if(myFighter.currentState == "attack_mid" && myFighter.animFrame >= 0  && distance < 38 && meFacing()){
        return true;
    }
    else if(myFighter.currentState == "attack_bot" && myFighter.animFrame >= 0  && distance < 35 && meFacing()){
        return true;
    }
}

function meAttacking(){
    return (myFighter.currentState == "attack_bot" || myFighter.currentState == "attack_mid" || myFighter.currentState == "attack_top")
}

function meFacing(){
    if(myFighter.direction == "right" && enemyFighter.x > myFighter.x){
        return true
    }
    if(myFighter.direction == "left" && enemyFighter.x < myFighter.x){
        return true
    }
    return false;
}

function aiSetDir(dir){
    if((enemyFighter.x > myFighter.x && dir=="backward") || (enemyFighter.x < myFighter.x && dir=="forward")){
        enemyController.setModifier("left",false)
        enemyController.setModifier("right",true)
    }
    else {
        enemyController.setModifier("right",false)
        enemyController.setModifier("left",true)
    }
    if(dir=="none"){
        enemyController.setModifier("right",false)
        enemyController.setModifier("left",false)
    }
}

function aiAttack(){
    if(enemyFighter.x < myFighter.x && enemyFighter.direction == "left"){
        enemyController.addAction("turn")
        AIactionTimer = 7;
    }
    if(enemyFighter.x > myFighter.x && enemyFighter.direction == "right"){
        enemyController.addAction("turn")
        AIactionTimer = 7;
    }
    if(myFighter.state == "roll") return;
    var random = Math.random();
    if(random < 0.3){
        enemyController.setModifier("up",true)
        enemyController.setModifier("down",false)
    }
    else if(random < 0.6){
        enemyController.setModifier("up",false)
        enemyController.setModifier("down",true)
    }
    else {
        enemyController.setModifier("up",false)
        enemyController.setModifier("down",false)
    }
    if(enemyFighter.currentState == "idle" || enemyFighter.currentState == "walk_f" || enemyFighter.currentState == "walk_b")enemyController.addAction("attack")
}