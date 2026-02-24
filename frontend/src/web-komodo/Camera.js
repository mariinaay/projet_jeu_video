import {detectInbound} from "./Collider";
class Camera{
    constructor(renderers,cameraX,cameraY){
        this.renderers=renderers;
        this.cameraX=cameraX;
        this.cameraY=cameraY;
    }
    pushCameraGraphicOrder(imgId, x, y, imageX, imageY, imageWidth, imageHeight, scaleX, scaleY,gameInstance){
        for(let renderer of this.renderers){
            let rendererX=renderer[0];
            let rendererY=renderer[1];
            let rendererWidth=renderer[2];
            let rendererHeight=renderer[3];
            if(detectInbound(x,y,imageWidth*scaleX,imageHeight*scaleY,this.cameraX,this.cameraY,rendererWidth,rendererHeight)){
                let worldX=x-(this.cameraX-rendererX);
                let worldY=y-(this.cameraY-rendererY);
                let imageXTemp=imageX;
                let imageYTemp=imageY;
                let imageWidthTemp=imageWidth;
                let imageHeightTemp=imageHeight;

                if(worldX<rendererX){
                    let overflow=rendererX-worldX;
                    let downscaledOverflow=overflow/scaleX;
                    imageXTemp+=downscaledOverflow;
                    imageWidthTemp-=downscaledOverflow;
                    worldX=rendererX;
                }

                if(worldY<rendererY){
                    let overflow=rendererY-worldY;
                    let downscaledOverflow=overflow/scaleY;
                    imageYTemp+=downscaledOverflow;
                    imageHeightTemp-=downscaledOverflow;
                    worldY=rendererY;
                }

                if(worldX+imageWidthTemp*scaleX>rendererX+rendererWidth){
                    let overflow=(worldX+imageWidthTemp*scaleX)-(rendererX+rendererWidth);
                    imageWidthTemp-=(overflow/scaleX);
                }

                if(worldY+imageHeightTemp*scaleY>rendererY+rendererHeight){
                    let overflow=(worldY+imageHeightTemp*scaleY)-(rendererY+rendererHeight);
                    imageHeightTemp-=(overflow/scaleY);
                }

                gameInstance.addGraphicOrder(imgId,worldX,worldY,imageXTemp,imageYTemp,imageWidthTemp,imageHeightTemp,scaleX,scaleY);
            }
        }
    }
}

export default Camera;