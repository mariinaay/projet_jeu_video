import GameObject from "./GameObject";

class AnimatedImage extends GameObject{
    constructor(imgId,x,y,imageCoords,imageCoordsIndex,animationSpeed,scaleX,scaleY,idsList,scriptsIds){
        super(idsList,scriptsIds);
        this.imgId=imgId;
        this.x=x;
        this.y=y;
        this.imageCoords=imageCoords;
        this.imageCoordsIndex=imageCoordsIndex;
        this.animationSpeed=animationSpeed;
        this.scaleX=scaleX;
        this.scaleY=scaleY;
    }
    step(){
        super.step();
        let xTemp=this.x+this.mother.x;
        let yTemp=this.y+this.mother.y;
        let imageCoord=this.imageCoords[this.imageCoordsIndex];
        if(this.cameras.length>0){
            for(let i of this.cameras){
                i.pushCameraGraphicOrder(this.imgId,xTemp,yTemp,imageCoord.x,imageCoord.y,imageCoord.width,imageCoord.height,this.scaleX,this.scaleY,this.gameInstance);
            }
        }else{
            this.gameInstance.addGraphicOrder(this.imgId,xTemp,yTemp,imageCoord.x,imageCoord.y,imageCoord.width,imageCoord.height,this.scaleX,this.scaleY);
        }
        if(imageCoord.frameTimeIndex<imageCoord.frameTimeMax){
            imageCoord.frameTimeIndex+=this.animationSpeed*this.gameInstance.dt;
        }

        if(imageCoord.frameTimeIndex>=imageCoord.frameTimeMax){
            this.imageCoordsIndex+=1;
            imageCoord.frameTimeIndex=0;
        }
        
        if(this.imageCoordsIndex>=this.imageCoords.length){
            this.imageCoordsIndex=0;
        }
    }
};

export default AnimatedImage;