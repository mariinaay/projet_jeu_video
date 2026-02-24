class InputManager{
    constructor(keys){
        this.keys={};
        this.oldKeys={};
        for(let key of keys){
            this.keys[key]=false;
            this.oldKeys[key]=false;
        }
        for(let i in this.keys){
            window.addEventListener("keyup",e=>{if(e.key===i){
                this.keys[i]=false;
            }});
            window.addEventListener("keydown",e=>{if(e.key===i){
                this.keys[i]=true;
            }});
        }
    }
    checkPressed(keyId){
        return this.keys[keyId]
    }
    checkClicked(keyId){
        let pressedKey=this.checkPressed(keyId);
        if(pressedKey && !this.oldKeys[keyId]){
            this.oldKeys[keyId]=true;
            return true;
        }
        this.oldKeys[keyId]=pressedKey;
        return false;
    }
}

export default InputManager;