import MemoryManager from "./MemoryManager";
import InputManager from "./InputManager";
import ItemHandler from "./ItemHandler";
class Game extends ItemHandler{
    constructor(keys,winWidth,winHeight,imageRendering){
        super(0,0,{},{});
        this.canvas=document.createElement("canvas");
        this.ctx=this.canvas.getContext("2d");
        this.canvas.width=winWidth;
        this.canvas.height=winHeight;
        if(imageRendering){
            this.canvas.style.imageRendering=imageRendering;
        }
        this.mainMemoryManager=new MemoryManager();
        this.mainInputManager=new InputManager(keys);
        this.graphicPipeline={};
        this.previousTime=performance.now();
        this.dt=0;
    }


    async gameLoop(){
        await this.mainMemoryManager.readPipeline();
        this.ctx.fillStyle="black";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        super.step();
        this.readGraphicPipeline();
        let currentTime=performance.now();
        this.dt=(currentTime - this.previousTime) / 1000;
        this.previousTime=currentTime;
        requestAnimationFrame(()=>this.gameLoop());
    }
    storeIn(query=null){
        if(query){
            document.querySelectorAll(query).forEach((item)=>{
                item.appendChild(this.canvas);
            });
        }else{
            console.error("query must not be null");
        }
    }
    addGraphicOrder(imgId, x, y, imageX, imageY, imageWidth, imageHeight, scaleX, scaleY){
        const graphicOrder={imgId:imgId,x:x,y:y,imageX:imageX,imageY:imageY,imageWidth:imageWidth,imageHeight:imageHeight,scaleX:scaleX,scaleY:scaleY};
        if(this.graphicPipeline[imgId]){
            this.graphicPipeline[imgId].push(graphicOrder);
        }else{
            this.graphicPipeline[imgId]=[graphicOrder];
        }
    }
    readGraphicPipeline(){
        for(let imgId in this.graphicPipeline){
            for(let order of this.graphicPipeline[imgId]){
                this.ctx.drawImage(this.mainMemoryManager.getImg(order.imgId),order.imageX,order.imageY,order.imageWidth,order.imageHeight,order.x,order.y,order.imageWidth*order.scaleX,order.imageHeight*order.scaleY);
            }
        }
        this.graphicPipeline={};
    }
    addItem(newObject,itemHandler){
        newObject.mother=itemHandler;
        newObject.gameInstance=this;
        newObject.arrayId=itemHandler.elements.length
        newObject.cameras=[...itemHandler.cameras,...newObject.cameras];
        for(let i of newObject.scriptsIds){
            newObject.addScript(i,this.mainMemoryManager);
        }
        itemHandler.addPipeline.push(newObject);
    }
    removeItem(index,ItemHandler){
        ItemHandler.remPipeline.push(index);
    }
}
export default Game;