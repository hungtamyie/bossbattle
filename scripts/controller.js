class Controller {
    constructor(){
        this.modifiers = {
            up: false,
            down: false,
            right: false,
            left: false,
            block: false,
            pull: false,
        }
        this.nextActions = []
    }

    setModifier(modifier,bool){
        this.modifiers[modifier] = bool
    }

    addAction(action){
        if(this.nextActions.length < 2){this.nextActions.unshift(action)}
    }
    popNextAction(){
        if(this.nextActions.length == 0) return false;
        return this.nextActions.pop();
    }
}