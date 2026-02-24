export function detectInbound(x1, y1, width1, heigth1, x2, y2, width2, heigth2){
    return !(
        x1+width1<x2 ||
        x1>x2+width2 ||
        y1+heigth1<y2 ||
        y1>y2+heigth2 
    );
}

export class Collider{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    checkCollision(collider){
        const sides={};
        for(let side of ["up","down","left","right","collideTrue"]){
            sides[side]=false;
        }
        if(detectInbound(this.x-50,this.y-50,this.width+50,this.height+50,collider.x-50,collider.y-50,collider.width+50,collider.height+50)){
            let xCollisionZoneLength=Math.min(this.x+this.width,collider.x+collider.width)-Math.max(this.x,collider.x);
            let yCollisionZoneLength=Math.min(this.y+this.height,collider.y+collider.height)-Math.max(this.y,collider.y);
            if(yCollisionZoneLength>xCollisionZoneLength){
                if(this.x+this.width>=collider.x&&this.x+this.width<collider.x+(collider.width/2)){
                    sides.left=true;
                }
                if(this.x<=collider.x+collider.width&&this.x>collider.x+(collider.width/2)){
                    sides.right=true;
                }
            }else{
                if(this.y+this.height>=collider.y&&this.y+this.height<collider.y+(collider.height/2)){
                    sides.up=true;
                }
                if(this.y<=collider.y+collider.height&&this.y>collider.y+(collider.height/2)){
                    sides.down=true;
                }
            }
            sides.collideTrue=(sides.up||sides.down||sides.left||sides.right);
        }
        return sides;
    }
}