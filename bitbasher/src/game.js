var entities = [];
var sprites = [];
var player_entity = null;
const gravity = -1;
class AnimSprite{
    constructor(img, sWidth,sHeight, sx,sy, width,height, anims)
    {
        this.image = img;
        this.sWidth = sWidth;
        this.sHeight= sHeight;
        this.width = width;
        this.height =height;
        this.anims =anims;
        this.animIndex = 0;
        this.currentAnim = 6;
        this.sx = sx;
        this.sy = sy;
        
    }
    draw(ctx, x, y, scale)
    {
        ctx.drawImage(this.image,
            (this.sWidth *this.animIndex    )+this.sx, 
            (this.sHeight*this.currentAnim  )+this.sy,
            this.width,
            this.height,
            x - (this.width*scale), y,//(this.height*scale*0.5), 
            this.width*scale, this.height*scale,
        )
    }
    tick_anim()
    {
        if (this.anims[this.currentAnim].length == 0)
        {
            this.animIndex = 0;
            return;
        }
        if ( (this.animIndex < this.anims[this.currentAnim].length-1))
        {
            this.animIndex++;
            return;
        }
        if (this.anims[this.currentAnim].loop)
        {
            this.animIndex=0;
            return;
        }
        this.currentAnim = 0;
        this.animIndex=0;
    }
    anim(anim)
    {
        this.currentAnim = anim;
        this.animIndex = 0;
    }
}
class GameEnt{
    constructor(sprite=null)
    {
        this.x=0;
        this.y=0;
        this.vx=0;
        this.vy=gravity;
        this.vtx=0; // target x velocity
        this.width = 1;
        this.height = 2;
        this.sprite = sprite;
        this.health=1;
        this.delete=false;
    }
    tick_anim()
    {
        this.sprite.tick_anim();
    }
    tick_core()
    {
    }
    draw(ctx, canvas, scale=1)
    {
        var size = levels[current_level].lvl_tile_size;
        var scalex = (canvas.width/size);
        scale = scalex/this.sprite.width;
        this.sprite.draw(ctx, this.x*scalex, canvas.height-(this.y*scalex), scale);
    }
    anim(anm)
    {
        this.sprite.anim(anm);
    }
    collide(ent)
    {
        return ent_collide(this,ent);
    }
}
class LivingEnt extends GameEnt{
    jump(velocity)
    {
        console.log("Jump");
        this.vy= velocity;
    }
    left(velocity=1)
    {
        this.vx = -velocity;
    }
    right(velocity=1)
    {
        this.vx = velocity;
    }
    gettilex()
    {
        return Math.floor(this.x);
    }
    gettiley()
    {
        return Math.floor(this.y);
    }
    gettile(xoffset=0,yoffset=0)
    {
        x = Math.floor(this.x); // this.gettilex();
        y = Math.floor(this.y);
        if (y > 0 && y < current_tiles.length && x > 0 && x < current_tiles[0].length)
        {
            y = current_tiles.length - y;
            return (current_tiles[y+yoffset][x+xoffset] != 0);
        }
        return 1;
    }
    grounded()
    {
        x = this.gettilex();
        y = this.gettiley();
        //console.log(current_tiles[y-1][x])
        if (y >= current_tiles.length) return false;
        if (y > 0 && y < current_tiles.length && x > 0 && x < current_tiles[0].length)
        {
            y = current_tiles.length - y;
            return (this.gettile(0,-1) != 0) || this.gettile(0,0)!=0;
        }
        return true;
    }
    tick_ai()
    {

    }
    damage(amount)
    {
        this.health -= amount;
        if (this.health <= 0)
        {
            this.sprite.anim(5);
        }
    }
    tick()
    {
        if (this.delete) return;
        if (this.health <= 0 && this.sprite.currentAnim == 0) {this.delete=true; return;}
        this.tick_core();
        this.tick_ai();
        this.vx = ((this.vx != this.vtx) ? (this.vx < this.vtx ? this.vx+0.1 : this.vx-0.1) : this.vx);
        if (Math.abs(this.vx-this.vtx) <= 0.0025) this.vx=this.vtx;
        
        this.x += this.vx/10;
        if (this.gettile()!=0) 
        {
            this.x-=this.vx/10;
            this.vx=0;
        }
        this.y += this.vy;
        if (this.gettile()!=0)
        { this.y-=this.vy;
        }

        if ( this.gettile(0,0) != 0)
            this.y = Math.ceil(this.y)+1;
        if (this.grounded()) { this.vy=0; return;}
        if (this.vy > gravity && !this.grounded() )
            this.vy = this.vy-0.1;
       
    }
}
class Enemy extends LivingEnt
{
    tick_ai()
    {
        if (player_entity == null) return;
        this.vtx = player_entity.x>this.x?0.5:-0.5;

    }
}

function ent_collide(ent, ent2)
{
    console.log(ent);
    console.log(ent2);
    return ent.x + ent.width > ent2.x && ent.x < ent2.x + ent2.width && ent.y + ent.height >= ent2.y && ent.y <= ent2.y + ent2.height
}
class Player extends LivingEnt
{
    tick_attack()
    {

        if (this.sprite.currentAnim != 7) return;
        for (var i=0;i<entities.length;i++)
        {
            var ent = entities[i];
            if (ent == this) continue;
            if (ent == player_entity) continue;
            if (!this.collide(ent)) continue;// || collide(this, ent)){

            ent.damage(1);
            //break;
            
        };
    }
    tick_ai()
    {
        this.tick_attack();
        if ( Math.ceil(this.x) < current_tiles[0].length-10) return;
        level_load(levels[current_level].lvl_nextlvl);
    }
}
nextAnim = performance.now();
function tick_entities()
{
    for(var i=0; i<entities.length;i++)
        {
            if (i>=entities.length) break;
            if (entities[i].delete) 
                {
                    entities.splice(i); i = i>0?i-1 : i}
            entities[i].tick();
        }
    if (performance.now() < nextAnim)
        return;
    nextAnim = performance.now()+100;
    entities.forEach(ent =>{
        ent.tick_anim();
    })
}
sprites.push(new AnimSprite(document.getElementById("warrior"), 80, 54, 27, 20,27, 32, [
    {
        length: 8,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 11,
        loop:true
    },
    {
        length: 6,
        loop:false
    }
    ,
    {
        length: 5,
        loop:false
    }
    ,
    {
        length: 5,
        loop:false
    },
    {
        length:5,
        loop:false
    }
]));
sprites.push(new AnimSprite(document.getElementById("adventurer"), 50, 50, 10,5, 30, 30, [
    {
        length: 3,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 8,
        loop:true
    },
    {
        length: 11,
        loop:true
    },
    {
        length: 6,
        loop:false
    }
    ,
    {
        length: 5,
        loop:false
    }
    ,
    {
        length: 5,
        loop:false
    },
    {
        length:5,
        loop:false
    }
]));
//entities[1].damage(1);
