class GameObject{
    constructor(idsList,scriptsIds){
        this.idsList=idsList;
        this.scriptsIds=scriptsIds; 
        this.scriptsList=[];
        this.isJustCreated=true;
        this.mother=null;
        this.gameInstance=null;
        this.arrayId=null;
        this.cameras=[];
    }
    addScript(scriptId,memoryManager){
        const newScript=memoryManager.getScript(scriptId);
        newScript.mother=this;
        this.scriptsList.push({...newScript});
    }
    create(){

    }
    step(){
        for(let script of this.scriptsList){
            script.loadScript();
        }
    }
}

export default GameObject;