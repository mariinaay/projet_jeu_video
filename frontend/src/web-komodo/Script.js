class Script{
    constructor(scriptFunction,beginIndex,endIndex,scriptSpeed,loop){
        this.scriptFunction=scriptFunction;
        this.beginIndex=beginIndex;
        this.index=beginIndex;
        this.endIndex=endIndex;
        this.scriptSpeed=scriptSpeed;
        this.loop=loop;
        this.mother=null;
        this.conditionMap={};
    }
    
    createCondition(conditionIndex){
        this.conditionMap[conditionIndex]=true;
    }
    
    checkCondition(conditionIndex){
        if(!this.conditionMap[conditionIndex]) return false;
        const conditionState = this.conditionMap[conditionIndex];
        this.conditionMap[conditionIndex] = false;
        return conditionState;
    }
    
    loadScript(){
        if(this.index<=this.endIndex){
            this.scriptFunction(this);
            this.index += this.scriptSpeed * this.mother.gameInstance.dt;
        }else if(this.loop){
            this.index = this.beginIndex;
        }
    }
}

export default Script;