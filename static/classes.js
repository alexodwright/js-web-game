export class Player {
    constructor(width, height) {
        this.x = 0,
        this.y = 0,
        this.width = width,
        this.height = height,
        this.up = false,
        this.down = false,
        this.left = false,
        this.right = false
        this.damageFlag = true,
        this.resettingDamageFlag = false,
        this.xFrame = 9,
        this.yFrame = 0,
        this.speed = 2,
        this.counter = 0,
        this.damage = 10
        this.health = 100,
        this.dead = false,
        this.image = new Image();
        this.inventory = {};
        this.ammo = 10;
        this.shield = false;
        this.kills = 0;
    }
    draw(context, canvas) {
        context.drawImage(this.image, this.xFrame * this.width, this.yFrame * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        context.fillStyle = "black";
        context.fillRect(canvas.width/2, canvas.height - 48, canvas.width/2-16, 32);
        context.fillStyle = "red";
        context.fillRect(canvas.width/2+1, canvas.height - 47, this.health * (canvas.width/2-16-2)/100, 30);

        // shield
        if (this.shield) {
            context.fillStyle = "rgba(5, 218, 255, 0.5)";
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, 24, 0, 2*Math.PI);
            context.strokeStyle = "rgb(255, 255, 255)";
            context.stroke()
            context.arc(this.x + this.width/2, this.y + this.height/2, 24, 0, 2*Math.PI);
            context.fill();
        }
    }
    take_damage(amount) {
        if (this.health - amount <= 0) {
            this.dead = true;
        }
        else {
            this.health -= amount;
        }
    }
    heal(amount) {
        if (this.health + amount <= 100) {
            this.health += amount;
        } else {
            this.health = 100;
        }
    }
}
export class Enemy {
    constructor(width, height, frames, speed) {
            this.x = 0,
            this.y = 0,
            this.frames = frames,
            this.width = width,
            this.height = height,
            this.xFrame = 0,
            this.yFrame = 0,
            this.speed = speed,
            this.counter = 0,
            this.health = 50,
            this.dead = false,
            this.image = new Image()
    }
    draw(context) {
        let barWidth = this.health;
        let barHeight = 15;
        context.drawImage(this.image, this.xFrame * this.width, this.yFrame * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        context.fillStyle = "black";
        context.fillRect(this.x-((50-this.width)/2+1), this.y-(barHeight+11), 50+2, barHeight+2);
        context.fillStyle = "blue";
        context.fillRect(this.x-((50-this.width)/2), this.y-(barHeight+10), barWidth, barHeight);
    }
    take_damage(amount) {
        if (this.health - amount <= 0) {
            this.dead = true;
        }
        else {
            this.health -= amount;
        }
    }
}
export class Bullet {
    constructor(x, y, angle) {
        this.x = x,
        this.y = y,
        this.angle = angle,
        this.width = 32;
        this.height = 32;
        this.speed = 6;
        this.counter = 0;
        this.image = new Image();
        this.xFrame = 0;
        this.yFrame = 23;
    }
    draw(context) {
        context.drawImage(this.image, this.xFrame * this.width, this.yFrame * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    updatePath() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
    }
}

export class Tile {
    constructor(r, c, size) {
        this.x = c*size;
        this.y = r*size;
        this.width = size;
        this.height = size;
    }
}
export class Item {
    constructor(x, y, size, image, xFrame, type) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.image = image;
        this.xFrame = xFrame;
        this.type = type
    }
    draw(context) {
        context.drawImage(this.image, this.xFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}