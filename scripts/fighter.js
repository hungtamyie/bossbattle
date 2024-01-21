class Fighter {
    constructor(type, controller, isMe){
        this.fighterDef = fighterDefs[type];
        this.currentState = "idle";
        this.animCounter = 0;
        this.animFrame = 0;
        this.animCanCancel = true;
        this.direction = "right";
        this.stopped = false;
        this.x = 200;
        this.y = 87;
        this.controller = controller;
        this.isMe = isMe;
        this.stance = 100;
        this.stanceBroken = 0;
        if(isMe){this.x = 45}
        this.hp = 25;
        this.energy = 20;
        this.energyRegen = 0.05;
        if(!isMe) this.energyRegen = 0.1;
        if(!isMe) this.hp = 100;
    }
    reset(){
        this.currentState = "idle";
        this.animCounter = 0;
        this.animFrame = 0;
        this.animCanCancel = true;
        this.direction = "right";
        this.stopped = false;
        this.x = 200;
        this.y = 87;
        this.stance = 100;
        this.stanceBroken = 0;
        if(this.isMe){this.x = 45}
        this.hp = 25;
        this.energy = 20;
        this.energyRegen = 0.05;
        if(!this.isMe) this.energyRegen = 0.1;
        if(!this.isMe) this.hp = 100;
    }

    readInputs(){
        if(!this.animCanCancel) return;

        var action = this.controller.popNextAction();
        while(action){
            if(this.animCanCancel){
                if(action == "attack"){
                    if(this.controller.modifiers.up && !this.controller.modifiers.down){
                        this.changeState("attack_top");
                    }
                    else if(this.controller.modifiers.down && !this.controller.modifiers.up){
                        this.changeState("attack_bot");
                    }
                    else {
                        this.changeState("attack_mid");
                    }
                }
                if(action == "jump" && this.energy > 4){
                    if(this.dirMoving() == "forward") this.changeState("jump_f")
                    else if(this.dirMoving() == "backward") this.changeState("jump_b")
                    else this.changeState("jump_b")
                    this.energy -= 4;
                }
                if(action == "kick"){
                    this.changeState("kick");
                }
                if(action == "turn"){
                    this.changeState("turn");
                }
                if(action == "roll" && this.energy > 10){
                    this.changeState("roll");
                    this.energy -= 10;
                }
                if(action == "flourish"){
                    this.changeState("flourish");
                }
                if(action == "matrix"){
                    this.changeState("matrix");
                }
                if(action == "block"){
                    if(this.controller.modifiers.up && !this.controller.modifiers.down){
                        this.changeState("block_top");
                    }
                    else if(this.controller.modifiers.down && !this.controller.modifiers.up){
                        this.changeState("block_bot");
                    }
                    else {
                        this.changeState("block_mid");
                    }
                }
            }
            action = this.controller.popNextAction();
        }

        if(this.animCanCancel){
            if(this.dirMoving() == "forward") this.changeState("walk_f")
            if(this.dirMoving() == "backward") this.changeState("walk_b")
        }
    }

    dirMoving(){
        if(this.controller.modifiers.right && !this.controller.modifiers.left){
            if(this.direction=="right") return "forward"
            else return "backward"
        }
        if(this.controller.modifiers.left && !this.controller.modifiers.right){
            if(this.direction=="left") return "forward"
            else return "backward"
        }
        return false
    }

    changeState(state, override){
        if(!this.currentAnimFrame().cancel && !override) return;
        console.log(this.currentState)
        if((this.currentState == "dying" || this.currentState == "dead") && state != "dead") return;
        if(this.currentState == state) return;
        this.currentState = state
        this.animFrame = 0;
        this.animCounter = 0;
        let directionMod = this.direction=="right"?1:-1;
        let movement = this.currentAnimFrame().movement;
        this.animCanCancel = this.currentAnimFrame().cancel;
        if(movement){
            this.x += movement*directionMod
        }
    }

    currentAnimFrame(){
        return this.fighterDef.states[this.currentState].frames[this.animFrame];
    }

    getHitboxMod(type){
        if(this.currentAnimFrame().hitboxMod){
            return this.currentAnimFrame().hitboxMod[type];
        }
        return false;
    }

    checkAttackOn(attack,fighter){
        var fighterOffsetX = 0;
        if(fighter.getHitboxMod(attack.type).miss) return false; //Hitbox mod makes them miss
        if(fighter.getHitboxMod(attack.type).shift){
            if(fighter.direction=="right"){fighterOffsetX = fighter.getHitboxMod(attack.type).shift}
            else {fighterOffsetX = -fighter.getHitboxMod(attack.type).shift}
            var blockDirection = fighter.direction;
        }
        var distance = Math.abs(this.x - (fighter.x+fighterOffsetX)) - (this.fighterDef.hitboxWidth/2 + fighter.fighterDef.hitboxWidth/2)
        var correctDirection = "right";
        if(this.x > fighter.x) correctDirection = "left";
        var realDirection = "left";
        if(attack.direction=="f"&&this.direction=="right"){realDirection = "right"}
        if(attack.direction=="b"&&this.direction=="left"){realDirection = "right"}
        if(correctDirection != realDirection) return false; //Not attacking the right way
        
        var takeDamage = true;
        if(attack.range >= distance){
            if(fighter.getHitboxMod(attack.type).block){
                var blockDirection = fighter.direction;
                if(fighter.getHitboxMod(attack.type).block == "b") blockDirection=fighter.direction=="left"?"right":"left";
                if(blockDirection != correctDirection){
                    if(attack.blockState){
                        this.changeState(attack.blockState,true);
                        takeDamage = false;
                        this.stance -= 40;
                        if(this.stance < 0){
                            this.stanceBroken = 50;
                            this.stance = 100;
                        }
                    }
                }
            }
            if(takeDamage){
                fighter.changeState("damage",true)
                fighter.hp -= attack.damage;
                if(fighter.hp <= 0){
                    fighter.hp = 0;
                    if(fighter.isMe){
                        document.getElementById("title").innerHTML = "You died."
                        window.setTimeout(function(){document.getElementById("title").innerHTML = "<span class='black'>.</span>"},5000)
                    }
                    else {
                        document.getElementById("title").innerHTML = "You won!!!"
                        window.setTimeout(function(){document.getElementById("title").innerHTML = "<span class='black'>.</span>"},5000)
                    }
                }
            }
        }
    }

    updateAndDraw(delta){
        if(this.hp == 0){
            this.changeState("dying",true)
        }
        if(this.stanceBroken > 0) delta /= 2
        this.animCounter += delta;
        this.energy += this.energyRegen * delta;
        if(this.energy > 20) this.energy = 20; 
        let currentAnimation = this.fighterDef.states[this.currentState]
        let directionMod = this.direction=="right"?1:-1;
        let holding = false;
        this.stanceBroken -= delta;
        if(this.stanceBroken < 0){this.stanceBroken = 0}
        this.stance += delta/10;
        if(this.stance > 100) this.stance = 100;
        if(currentAnimation.frames[this.animFrame].keyToHold && this.controller.modifiers[currentAnimation.frames[this.animFrame].keyToHold]){
            holding = true;
        }
        if(this.animCounter > currentAnimation.frames[this.animFrame].duration && !holding){
            this.animCounter = 0;
            this.animFrame++;
            if(this.animFrame > currentAnimation.frames.length - 1){
                this.animFrame = 0;
                this.changeState(currentAnimation.endState, true);
                if(currentAnimation.turn){
                    this.direction = this.direction=="right"?"left":"right";
                }
                currentAnimation=this.fighterDef.states[this.currentState]
            }
            else {
                let movement = currentAnimation.frames[this.animFrame].movement;
                if(movement){this.x += movement*directionMod}
            }
            let attack = this.currentAnimFrame().attack;
            if(attack){
                if(this.isMe){
                    for(let i = 0; i < enemyFighters.length; i++){
                        this.checkAttackOn(attack,enemyFighters[i])
                    }
                }
                else {
                    this.checkAttackOn(attack,myFighter)
                }
            }
            this.animCanCancel = currentAnimation.frames[this.animFrame].cancel;
        }
        if(this.fighterDef.states[this.currentState].blocking){
            if(this.controller.modifiers.up && !this.controller.modifiers.down && this.currentState != "block_top"){
                this.changeState("block_top",true)
            }
            else if(!this.controller.modifiers.up && this.controller.modifiers.down && this.currentState != "block_bot"){
                this.changeState("block_bot",true)
            }
            else if (this.controller.modifiers.up == this.controller.modifiers.down && this.currentState != "block_mid"){
                this.changeState("block_mid",true)
            }
        }
        currentAnimation = this.fighterDef.states[this.currentState]
        directionMod = this.direction=="right"?1:-1
        let frameWidth = this.fighterDef.width;
        let frameHeight = this.fighterDef.height;
        let gridStartX = currentAnimation.gridPos[0]
        let gridStartY = currentAnimation.gridPos[1]
        let directionOffsetY = this.direction=="right"?0:frameHeight;
        let z = currentAnimation.frames[this.animFrame].z
        if(typeof z == "undefined"){z = 1};
        if(this.isMe){
            addImageToQueue(
                [
                    images[this.fighterDef.imageName],
                    gridStartX*frameWidth +  this.animFrame*frameWidth,
                    gridStartY*frameHeight + directionOffsetY,
                    frameWidth,
                    frameHeight,
                    this.x - frameWidth/2 - this.fighterDef.xOffset*directionMod,
                    this.y - frameHeight,
                    frameWidth,
                    frameHeight,
                    z,
                ]
            ) 
        }
        else {
            addImageToQueue(
                [
                    images["blueFighter"],
                    gridStartX*frameWidth +  this.animFrame*frameWidth,
                    gridStartY*frameHeight + directionOffsetY,
                    frameWidth,
                    frameHeight,
                    this.x - frameWidth/2 - this.fighterDef.xOffset*directionMod,
                    this.y - frameHeight,
                    frameWidth,
                    frameHeight,
                    z,
                ]
            )
        }
        if(this.isMe){
            ctx.fillStyle = "rgb(10,200,10)";
            ctx.fillRect(1,1,Math.floor(this.hp)*4,4) 
            ctx.fillStyle = "white";
            ctx.fillRect(1,6,Math.floor(this.energy)*2,2) 
        }
        if(!this.isMe){
            ctx.fillStyle = "red";
            ctx.fillRect(120-Math.floor((this.hp*2.35)/2),97,Math.floor(this.hp*2.35),2) 
        }
        if(this.x - 18 < 0) this.x = 0 + 18;
        if(this.x + 12 > 240) this.x = 240 - 12;
    }
}