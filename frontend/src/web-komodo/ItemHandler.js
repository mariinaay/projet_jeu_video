import GameObject from "./GameObject";
import AnimatedImage from "./AnimatedImage";
class ItemHandler extends GameObject {
    constructor(x, y, idsList, scriptsIds){
        super(idsList,scriptsIds);
        this.x=x;
        this.y=y;
        this.elements=[];
        this.addPipeline=[];
        this.remPipeline=[];
    }
    readPipelines(){
        while(this.addPipeline.length>0){
            this.elements.push(this.addPipeline[0]);
            this.addPipeline.splice(0,1);
        }
        this.remPipeline.sort((a,b)=>a-b);
        while(this.remPipeline.length>0){
            this.elements.splice(this.remPipeline[0],1);
            this.remPipeline.splice(0,1);
        }
    }
    step(){
        if(this.mother){
            this.x+=this.mother.x;
            this.y+=this.mother.y;
        }
        this.readPipelines();
        super.step();
        for(let i=0;i<this.elements.length;i++){
            let element=this.elements[i];
            element.arrayId=i;
            if(element.isJustCreated){
                element.create();
                element.isJustCreated=false;
            }
            element.step();
        }
        if(this.mother){
            this.x-=this.mother.x;
            this.y-=this.mother.y;
        }
    }
    getElementById(id){
        const gameObjectsList=[];
        for(let i=0;i<this.elements.length;i++){
            const list=this.elements[i].idsList;
            if(list.includes(id)){
                gameObjectsList.push(this.elements[i]);
            }
        }
        return gameObjectsList;
    }

    getWidth(){
        let width=0;
        let first=true;
        for(let i of this.elements){
            if(i instanceof ItemHandler){
                let itemHandlerWidth=i.getWidth();
                if(itemHandlerWidth>width || first){
                    width=itemHandlerWidth;
                    first=false;
                }
            }else if(i instanceof AnimatedImage){
                const itemHighestPosition=i.x+(i.imageCoords[i.imageCoordsIndex].width*i.scaleX);
                if(itemHighestPosition>width || first){
                    width=itemHighestPosition;
                    first=false;
                }
            }
        }
        return width;
    }

    getHeight(){
        let height=0;
        let first=true;
        for(let i of this.elements){
            if(i instanceof ItemHandler){
                let itemHandlerHeight=i.getHeight();
                if(itemHandlerHeight>height || first){
                    height=itemHandlerHeight;
                    first=false;
                }
            }else if(i instanceof AnimatedImage){
                const itemHighestPosition=i.y+(i.imageCoords[i.imageCoordsIndex].height*i.scaleY);
                if(itemHighestPosition>height || first){
                    height=itemHighestPosition;
                    first=false;
                }
            }
        }
        return height;
    }
}

export default ItemHandler;