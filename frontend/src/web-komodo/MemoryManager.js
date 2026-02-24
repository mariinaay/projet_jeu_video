class MemoryManager{
    constructor(){
        this.imgMem={};
        this.scriptsMem={};
        this.pipeline=[];
    }
    addImg(imgId){
        this.pipeline.push(async ()=>{
            try{
                const image = await new Promise((resolve,reject)=>{
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error("image loading error"));
                    img.src = imgId;
                });
                this.imgMem[imgId] = image;
            }catch(err){
                throw err;
            }
        });
    }

    getImg(imgId){
        if(!this.imgMem[imgId]){
            throw new Error("image hasn't been loaded in ram");
        }
        return this.imgMem[imgId];
    }

    removeImg(imgId){
        if(!this.imgMem[imgId]){
            throw new Error("image hasn't been loaded in ram");
        }
        delete this.imgMem[imgId];
    }

    addScript(scriptId,script){
        this.pipeline.push(()=>{
            this.scriptsMem[scriptId]=script;
        })
    }

    getScript(scriptId){
        if(!this.scriptsMem[scriptId]){
            throw new Error("script hasn't been loaded in ram");
        }
        return this.scriptsMem[scriptId];
    }

    removeScript(scriptId){
        if(!this.scriptsMem[scriptId]){
            throw new Error("script hasn't been loaded in ram");
        }
        delete this.scriptsMem[scriptId];
    }

    clearMems(){
        for(let imgId in this.imgMem){
            this.removeImg(imgId);
        }
        for(let scriptId in this.scriptsMem){
            this.removeScript(scriptId);
        }
    }

    async readPipeline(){
        for(let order of this.pipeline){
            await order();
        }
        this.pipeline=[];
    }

}

export default MemoryManager;