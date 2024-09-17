// imports
import {Player, Enemy, Bullet, Tile, Item} from "./classes.js";

//---------------------------------------------------------

// PRESS ")" TO ACTIVATE CHEATS
// WHILE CHEATS ARE ACTIVE YOU HAVE AN INFINITE SHIELD
// PRESS C FOR THE SURGE POWERUP
// PRESS F FOR THE DEATH PLATE POWERUP
// PRESS G FOR THE SPEED POWERUP
// PRESS T TO HEAL 30HP

//---------------------------------------------------------

// initialise variables
let canvas;
let context;
let gameOver;
let countdownLabel;
let request_id;
let collisionTiles = [];
let countdown;
let countdownId;
let req;
let cheat = false;
let themeSong = new Audio();
let themePlaying = false;
let deathSound = new Audio();
let shieldSound = new Audio();
let deathplateSound = new Audio();

// item variables
let items = [];
let powerUpImage = new Image();
let itemTypes = {
    "surge": 0,
    "speedstone": 1,
    "shield": 2,
    "deathplate": 3,
    "heart": 4
};
let shieldTimeout;
let speedTimeout;

// round variables
let roundLabel;
let roundNum = 0;
let roundEnemiesNum = 5;

// different enemy yFrames
let enemyFrames = {
    "m1": 0,
    "m2": 3,
    "g1": 6,
    "g2": 9
}

// fps variables
let fps = 60;
let fpsInterval = 1000 / fps;
let now;
let then = Date.now();

// create player
let player = new Player(32, 48);

// create bullets
let bullets = [];
let bulletImage = new Image();

// create enemies
let enemies = [];
let enemiesImage = new Image();

// background images and matrices
let backgroundImage = new Image();
let backgroundTiles = [
    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, -1, -1, -1, -1, -1, 55, -1, -1, -1, -1, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 55, -1, 55, -1, -1, -1, -1, -1, 55, -1, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, -1, -1, -1, -1, 55, -1, -1, -1, -1, -1, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, -1, -1, -1, -1, -1, -1, 55, -1, -1, -1, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
    [57, 57, 57, 57, 26, 27, 26, 27, 560, 561, 562, 562, 561, 562, 562, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 560, 561, 562, 562, 560, 561, 562, 26, 27, 26, 27, 57, 57, 57, 57],
    [57, 57, 57, 57, 25, 24, 25, 24,616, 616, 616, 616, 616, 616, 616, 747, 744, 745, 746, 747, 744, 745, 746, 747, 744, 616, 616, 616, 616, 616, 616, 616, 25, 24, 25, 24, 57, 57, 57, 57],
    [57, 57, 57, 57, 25, 24, 25, 24, 617, 617, 617, 617, 617, 617, 617, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57,           617, 617, 617, 617, 617, 617, 617, 25, 24, 25, 24, 57, 57, 57, 57],
    [57, 57, 57, 57, 25, 24, 25, 24, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57,           57, 57, 57, 57, 57, 57, 57, 25, 24, 25, 24, 57, 57, 57, 57],
    
    [57, 57, 57, 57, 69, 69, 69, 69, 57, -1, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, -1, 57, 69, 69, 69, 69, 57, 57, 57, 57],
    [57, 57, 57, 57, 69, 69, 69, 69, 57, 71, 57, 57, 57, 71, 71, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 71, 71, 57, 57, 57, 71, 57, 69, 69, 69, 69, 57, 57, 57, 57],

    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],
    [57, 57, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 69, 57, 57],

    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
    [57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57],
];
let foregroundTiles = [
    [680, 681, 682, 683, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,   55, 52, 52, 52, 52, 345, 52, 52, 52, 55,  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 680, 681, 682, 683],
    [736, 737, 738, 739, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,   345, 52, 345, 52, 52, 52, 52, 52, 345, 55,  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 736, 737, 738, 739],
    [792, 793, 794, 795, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,   55, 52, 52, 52, 345, 52, 52, 52, 52, 55,  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 792, 793, 794, 795],
    [848, 849, 850, 851, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,   55, 52, 52, 52, 52, 52, 345, 52, 52, 55,  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 848, 849, 850, 851],
    
    [680, 681, 682, 683, -1, -1, -1, -1, 934, 823, 935, 561, 561, 934, 935,  691, 688, 689, 690, 691, 688, 689, 690, 691, 688,  934, 935, 561, 561, 934, 823, 935, -1, -1, -1, -1, 680, 681, 682, 683],
    [736, 737, 738, 739, -1, -1, -1, -1, 990, 597, 991, 616, 616, 990, 991,   747, 744, 745, 746, 747, 744, 745, 746, 747, 744,  990, 991, 616, 616, 990, 597, 991, -1, -1, -1, -1, 736, 737, 738, 739],
    [792, 793, 794, 795, -1, -1, -1, -1, 707, 819, 707, 616, 616, 707, 707,   187, 53, 187, 52, 187, 187, 187, 53, 187, 187,  707, 707, 616, 616, 707, 819, 707, -1, -1, -1, -1, 792, 793, 794, 795],
    [848, 849, 850, 851, -1, -1, -1, -1, 588, 813, 590, 574, 573, 819, 819,   973, 973, 973, 973, 973, 973, 973, 973, 973, 973,  819, 819, 573, 574, 588, 813, 590, -1, -1, -1, -1, 848, 849, 850, 851],

    [560, 560, 560, 560, -1, -1, -1, -1, 928, 1209, 930, 573, 575, 588, 590, 1142, -1, -1, -1, -1, -1, -1, -1, -1, 1140, 588, 590, 575, 573, 928, 1209, 930, -1, -1, -1, -1, 560, 560, 560, 560],
    [616, 616, 616, 616, -1, -1, -1, -1, -1, -1, -1, 1118, -1, -1, -1, 1198, -1, -1, -1, -1, -1, -1, -1, -1, 1196, -1, -1, -1, 1118, -1, -1, -1, -1, -1, -1, -1, 616, 616, 616, 616],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

//---------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    // get canvas and context
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    gameOver = document.querySelector("#game-over")
    roundLabel = document.querySelector("#round-label");
    countdownLabel = document.getElementById("countdown");

    // add event listeners
    window.addEventListener("keydown", move, false);
    window.addEventListener("keyup", stopMoving, false);
    window.addEventListener("click", shoot, false);
    window.addEventListener("keypress", keypresses, false);

    // create collision tiles
    createCollisionTiles(foregroundTiles);

    // place player in the center of the map
    player.x = Math.floor(canvas.width/2);
    player.y = Math.floor(canvas.height/2);
    
    // load assets and run the game
    loadAssets([{"var": backgroundImage, "url": "static/tiles.png"},
                {"var": enemiesImage, "url": "static/enemies.webp"},
                {"var": player.image, "url": "static/player.webp"},
                {"var": bulletImage, "url": "static/bullets.png"},
                {"var": powerUpImage, "url": "static/powerups.png"},
                {"var": themeSong, "url": "static/maintheme.mp3"},
                {"var": deathSound, "url": "static/death.mp3"},
                {"var": shieldSound, "url": "static/shield.wav"},
                {"var": deathplateSound, "url": "static/fireball.mp3"}], draw);

    roundLabel.innerHTML = 1;
}
            
//---------------------------------------------------------------------------------------------------

function draw() {
    // animation frame
    request_id = window.requestAnimationFrame(draw);

    // fps
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    };
    then = now - (elapsed % fpsInterval);

    // clear background
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw background
    drawBackground(backgroundTiles)

    // draw foreground
    drawBackground(foregroundTiles)

    // drawCollisionTiles();

    // when all the enemeis are dead start a new round
    handleRound();

    // if items, draw items
    if (items.length > 0) {
        drawItems()
    }
    // handle enemies
    handleEnemies();
    
    // update player
    updatePlayer()

    // update bullet counters
    updateBulletCounters()

    // draw hotbar
    drawHotBar()

    // if player isn't dead draw the player, else stop game
    if (!player.dead) {
        player.draw(context, canvas);
    } else {
        stopGame();
    }
    
    // draw bullets
    drawBullets();
}

function move(event) {
    // audio only plays once interacted
    // theme song
    handleMusic();

    let key = event.key;
    if (key==="w") {
        player.up = true;
    }
    if (key==="s") {
        player.down = true;
    }
    if (key==="a") {
        player.left = true;
    }
    if (key==="d") {
        player.right = true;
    }
}
function stopMoving(event) {
    let key = event.key;
    if (key==="w") {
        player.up = false;
    }
    if (key==="s") {
        player.down = false;
    }
    if (key==="a") {
        player.left = false;
    }
    if (key==="d") {
        player.right = false;
    }
    // when you stop moving, make sprite stationary
    player.xFrame = 9;
    player.counter = 0;
}
function drawBackground(background) {
    let tileSize = 32;
    let tilesPerRow = 56;
    let image = backgroundImage;
    for (let r = 0; r < background.length; r++) {
        for (let c = 0; c < background[0].length; c++) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(image, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, c * tileSize, r * tileSize, tileSize, tileSize)
            }
        }
    }
}
function createCollisionTiles(matrix) {
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
            let tile = matrix[r][c];
            if (tile >= 0) {
                createCollisionTile(r, c, 32)
            }
        }
    }
}
function handleCollision(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}
function randint(min, max) {
    return Math.round(Math.random() * (max-min)) + min;
};
function loadAssets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() {
        console.log("loaded");
        num_assets -= 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url;
    }
}
function stopGame() {
    // cancel animation and remove event listeners
    window.cancelAnimationFrame(request_id);
    window.removeEventListener("keydown", move, false);
    window.removeEventListener("keyup", stopMoving, false);


    // play death sound
    deathSound.volume = .7;
    deathSound.play();

    // stop music
    themeSong.pause()
    themeSong.src = "";

    // add event listener for play again
    window.addEventListener("keypress", (ev) => {
        let key = ev.key;
        if (key === " ") {
            location.reload();
        }
    })

    // reveal game over screen
    document.getElementById("round-reached").innerHTML = roundNum;
    gameOver.style.display = "flex";
    context.fillStyle = "rgba(0, 0, 0, 0.8)"
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (!cheat) {
        sendData();
    }
}
function updatePlayer() {
    // if the player were to move in each direction and collided with a collidable object, do not move
    // in that direction
    if (player.up) {
        if (checkValidMove(player, collisionTiles, "u")) {
            player.y -= player.speed;
        }
        player.yFrame = 3;
    };
    if (player.down) {
        if (checkValidMove(player, collisionTiles, "d")) {
            player.y += player.speed;
        }
        player.yFrame = 0;
    };
    if (player.left) {
        if (checkValidMove(player, collisionTiles, "l")) {
            player.x -= player.speed;
        }
        player.yFrame = 1;
    };
    if (player.right) {
        if (checkValidMove(player, collisionTiles, "r")) {
            player.x += player.speed;
        }
        player.yFrame = 2;
    };
    // while the player is moving, increase the counter to animate
    if (player.up || player.down || player.left || player.right) {
        player.counter = (player.counter + 1) % 7;
    };
    // every 7 frames animate the character 1 frame
    if (player.counter === 1) {
        player.xFrame = (player.xFrame + 1) % 3 + 9;
    }

    // check if the player is colliding with enemies and deal the necessary damage
    for (let enemy of enemies) {
        if (handleCollision(player, enemy) && player.damageFlag && !player.shield) {
            player.take_damage(10);
            player.damageFlag = false;
            if (!player.resettingDamageFlag){
                resetDamageFlag(player);
            }
        }
    }

    // check player against items
    let itemsToKeep = [];
    for (let item of items) {
        if (handleCollision(player, item)) {
            if (item.type === "heart") {
                player.heal(30);
            } else if (item.type === "surge") {
                surge();
            } else if (item.type === "shield") {
                shield();
            } else if (item.type === "speedstone") {
                superSpeed();
            } else if (item.type === "deathplate") {
                deathplate();
            }
        }
        else {
            itemsToKeep.push(item)
        }
    }
    items = itemsToKeep;
}
function resetDamageFlag(entity) {
    entity.resettingDamageFlag = true;
    setTimeout(() => {entity.damageFlag = true}, 400);
    entity.resettingDamageFlag = false;
}
function shoot(event) {

    // audio only plays once interacted
    // theme song
    handleMusic();

    // if the player has ammo
    if (player.ammo > 0) {
        let rect = canvas.getBoundingClientRect()
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top - player.height/2;
        if (x < player.x) {
            player.yFrame = 1;
        } else if (x > player.x) {
            player.yFrame = 2;
        }
        let angle = Math.atan2(y - player.y, x - player.x);
        let bullet = new Bullet(player.x + player.width/2-16, player.y + player.height-32, angle);
        bullet.image = bulletImage;
        bullets.push(bullet);
        player.ammo --;
    }
}
function drawBullets() {
    let bulletsToKeep = [];
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        // move bullet
        bullet.updatePath();

        // animate the bullet
        if (bullet.counter === 1 || bullet.counter === 5) {
            if (bullet.yFrame < 15) {
                bullet.xFrame = (bullet.xFrame + 1) % 5;
            } else {
                bullet.xFrame = (bullet.xFrame + 1) % 6;
            }
        }

        // draw the bullet 
        bullet.draw(context);
        
        // if the bullet goes out of bounds or collides with a collidable, remove it from the screen
        if (!outsideBorders(bullet) && !checkCollisionAll(bullet, collisionTiles)) {
            bulletsToKeep.push(bullet)
        }
    }
    // update the bullets list with the bullets that haven't collided with anything
    bullets = bulletsToKeep
}
function checkShotEnemy(enemy) {
    // check every bullet against the enemy
    let bulletsToKeep = []
    for (let bullet of bullets) {
        if (handleCollision(bullet, enemy)) {
            enemy.take_damage(player.damage);
        }
        else {
            bulletsToKeep.push(bullet)
        }
    }
    bullets = bulletsToKeep
}
function createCollisionTile(r, c, size) {
    collisionTiles.push(new Tile(r, c, size))
}
function checkValidMove(entity, collidables, direction) {
    // create copy of the enemy to check future movement
    let entityCopy = {
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
        speed: entity.speed
    }
    if (direction==="u") {
        entityCopy.y -= entityCopy.speed;
    }
    else if (direction==="d") {
        entityCopy.y += entityCopy.speed;
    }
    else if (direction==="l") {
        entityCopy.x -= entityCopy.speed;
    }
    else if (direction==="r") {
        entityCopy.x += entityCopy.speed;
    }
    // check if the enemy goes outside the border
    if (outsideBorders(entityCopy)) {
        return false;
    }
    // only allow the entity's feet to collide with the collidable tiles
    entityCopy.y += (entity.height/2);
    entityCopy.height = entity.height/2

    for (let collidable of collidables) {
        if (handleCollision(entityCopy, collidable)) {
            return false;
        }
    }
    return true;
}
function createEnemies(number) {
    for (let i = 0; i < number; i++) {
        // random enemy from the list of enemies
        let keys = Object.keys(enemyFrames);
        let frames = enemyFrames[keys[randint(0, keys.length-1)]];

        let speedOffset = Math.random()-.5
        let enemy = new Enemy(32, 48, frames, 1+speedOffset);

        enemy.x = randint(0, canvas.width-enemy.width-50);
        enemy.y = randint(0, canvas.height-enemy.height);
        
        // do not spawn an enemy on the player, outside the map, in any other enemies, or in any of the collidable tiles
        while (outsideBorders(enemy) || handleCollision(enemy, player) || checkCollisionAll(enemy, collisionTiles) || checkCollisionAll(enemy, removeElemNotMutating(enemies, enemies.indexOf(enemy)))) {
            enemy.x = randint(0, canvas.width-enemy.width);
            enemy.y = randint(0, canvas.height-enemy.height);
        };
        enemy.image = enemiesImage;

        // add the enemy to the enemies list
        enemies.push(enemy);
    }
}
function trackEntity(entity, toTrack) {
    // if the enemy won't collide with anything, apart from the player, let it move
    entity.counter = (entity.counter + 1) % 7;
    if (entity.y < toTrack.y) {
        if (checkValidMove(entity, collisionTiles, "d") && checkValidMove(entity, removeElemNotMutating(enemies, enemies.indexOf(entity)), "d")) {
            entity.y += entity.speed;
        }
        entity.yFrame = 4;
    }
    if (entity.y > toTrack.y) {
        if (checkValidMove(entity, collisionTiles, "u") && checkValidMove(entity, removeElemNotMutating(enemies, enemies.indexOf(entity)), "u")) {
            entity.y -= entity.speed;
        }
        entity.yFrame = 7;
    }
    if (entity.x < toTrack.x) {
        if (checkValidMove(entity, collisionTiles, "r") && checkValidMove(entity, removeElemNotMutating(enemies, enemies.indexOf(entity)), "r")) {
            entity.x += entity.speed;
        }
        entity.yFrame = 6;
    }

    if (entity.x > toTrack.x) {
        if (checkValidMove(entity, collisionTiles, "l") && checkValidMove(entity, removeElemNotMutating(enemies, enemies.indexOf(entity)), "l")) {
            entity.x -= entity.speed;
        }
        entity.yFrame = 5;
    }
    if (entity.counter === 1) {
        entity.xFrame = ((entity.xFrame + 1) % 3) + entity.frames;
    }
}
function newRound() {

    // increment the round number
    roundNum ++;

    // every 5 rounds make the player do 5 extra damage
    if (roundNum % 5 === 0) {
        player.damage += 5;
    }
    // update the round label with the current round number
    roundLabel.innerHTML = roundNum;

    // add one more enemy to the previous amount of enemies
    roundEnemiesNum ++;

    // create enemies
    createEnemies(roundEnemiesNum);
}
function keypresses(event) {
    let key = event.key;
    // r to refill mana
    if (key === "r") {
        player.ammo = 10;
    }
    // ) to activate cheats
    else if (key === ")") {
        cheat = true;
        player.shield = true;
        shieldSound.volume=.5;
        shieldSound.play();
    }
    // g to use a speed gem while cheats are active
    else if (key === "g" && cheat) {
        superSpeed()
    }
    // c to surge while cheats are active
    else if (key === "c" && cheat) {
        surge()
    }
    // t to heal while cheats are active
    else if (key === "t" && cheat) {
        player.heal(30);
    } 
    // f to use deathplate powerup while cheats are active
    else if (key === "f" && cheat) {
        deathplate();
    }
}
function outsideBorders(entity) {
    // checks if the enemy is out of the borders
    if (entity.x + entity.width > canvas.width || entity.x < 0 || entity.y < 0 || entity.y + entity.height > canvas.height- 64) {
        return true;
    }
    return false;
}
function removeElemNotMutating(list, index) {
    // creates a copy of a list with an element removed, while not mutating the original list
    return list.slice(0, index).concat(list.slice(index+1))
}
function drawHotBar() {
    // background of the hotbar
    context.fillStyle = "rgb(9, 87, 29)";
    context.fillRect(0, canvas.height-64, canvas.width, 64);
    // bullet type to show in the ammo
    let bulletType = 23;
    // draw the bullet symbol
    context.drawImage(bulletImage, 96, bulletType * 32, 32, 32, 16, canvas.height - 48, 32, 32);
    // ammo count
    context.strokeStyle = "rgb(252, 240, 141)"
    context.font = "32px Sans-Serif"
    context.strokeText(player.ammo, 56, canvas.height - 21)
    // draw the background for the reload prompt
    context.fillStyle = "rgb(21, 128, 61)";
    context.fillRect(116, canvas.height - 64, canvas.width/2 - 136, 64);
    // if player has no ammo prompt to refill mana
    if (player.ammo === 0) {
        context.strokeStyle = "rgb(252, 240, 141)"
        context.font = "32px Sans-Serif"
        context.strokeText("Press R to Refill Mana!", 136, canvas.height - 20)
    }
}
function updateBulletCounters() {
    // increment each bullet counter for the animation
    if (bullets) {
        for (let bullet of bullets) {
            bullet.counter = (bullet.counter + 1) % 7;
        }
    }
}
function checkCollisionAll(entity, collidables) {
    // check a list for any single collision
    for (let collidable of collidables) {
        if (handleCollision(entity, collidable)) {
            return true;
        }
    };
    return false;
}
function handleEnemies() {
    let enemiesStillAlive = []
    // update and draw enemies
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        // if there are bullets check are they hitting an enemy
        if (bullets.length !== 0) {
            checkShotEnemy(enemy);
        }
        // if the enemy isn't dead, track the player, draw the enemy, and keep the enemy
        if (!enemy.dead) {
            trackEntity(enemy, player);
            enemy.draw(context);
            enemiesStillAlive.push(enemy);
        // if an enemy has just died have a chance they drop an item
        } else {
            let n = randint(1, 8);
            player.kills ++
            if (n === 1) {
                dropItem(enemy);
        }
    }
    }
    // update the enemies list with the enemies that are still alive
    enemies = enemiesStillAlive;
}
function dropItem(entity) {
    // get the coordinates of the middle of the player
    let x = entity.x + entity.width/2 - 16;
    let y = entity.y + entity.height/2 - 16;

    // choose a random item drop
    let options = Object.keys(itemTypes);
    let randomOption = randint(0, options.length-1);
    
    // add item to the items list
    items.push(new Item(x, y, 32, powerUpImage, itemTypes[options[randomOption]], options[randomOption]))
}
function drawItems() {
    for (let item of items) {
        item.draw(context)
    }
}
function drawCollisionTiles() {
    // make the collidable tiles red
    for (let tile of collisionTiles) {
        context.fillStyle = "red";
        context.fillRect(tile.x, tile.y, tile.width, tile.height);
    }
    // show which part of the player can collide with the collidable tiles
    context.fillStyle = "yellow";
    context.fillRect(player.x, player.y + player.height/2, player.width, player.height/2);
}
function surge() {
    let angle = 0;
    // every 200ms shoot 8 bullets each at 45deg increments
    let intervalId = setInterval(() => {
        for (let i = 0; i < 8; i++) {
            let bullet = new Bullet(player.x + player.width/2-16, player.y + player.height-32, angle);
            bullet.image = bulletImage;
            bullets.push(bullet);
            angle += (45*Math.PI)/180
        }
    }, 200)
    setTimeout(() => {
        clearInterval(intervalId);
    }, 5000)
}

function shield() {
    player.shield = true;
    shieldSound.volume = .5;
    shieldSound.play();
    // if shield is already active overwrite the previous timeout
    clearTimeout(shieldTimeout);
    if (!cheat) {
        shieldTimeout = setTimeout(() => {
            player.shield = false;
        }, 10000)
    }
}

function superSpeed() {
    // if super speed is already active overwrite the previous timeout
    clearTimeout(speedTimeout);
    player.speed *= 3;
    // after 10 seconds reset the players speed
    speedTimeout = setTimeout(() => {
        player.speed = 3;
    }, 10000)
}

function deathplate() {
    deathplateSound.volume = .5
    deathplateSound.play();
    // kill all enemies
    for (let enemy of enemies) {
        enemy.take_damage(enemy.health)
        player.kills ++ 
    }
}
function handleRound() {
    // if all the enemies are dead and you're not already doing the countdown, start the countdown and a new round
    if (enemies.length === 0 && !countdownId) {
        countdown = 5
        let countdownIntervalId = setInterval(() => {
            // reveal the countdown
            countdownLabel.style.display = "flex"
            countdownLabel.firstElementChild.innerHTML = countdown;
            countdown -= 1;
            // if the countdown is done, stop counting down
            if (countdown === 0) {
                clearInterval(countdownIntervalId)
            }
        }, 1000)
        // after the countdown is done, hide the countdownA
        countdownId = setTimeout(() => {
            newRound();
            countdownId = null;
            countdownLabel.style.display = "none"
        }, (countdown+1)*1000)
    }
}
function handleResponse() {
    if (req.readyState === 4) {
        if (req.status === 200) {
            console.log("score stored")
        } else {
            console.log("score failed to store")
        }
    }
}
function sendData() {
    // create form data
    let data = new FormData();
    data.append("roundReached", roundNum);
    data.append("kills", player.kills);

    // creating the request object
    req = new XMLHttpRequest();
    req.addEventListener("readystatechange", handleResponse, false);
    req.open("POST", "storeScore", true);
    req.send(data);
}
function handleMusic() {
    if (!themePlaying) {
        themeSong.play();
        themeSong.volume = .7;
        themePlaying = true;
        setTimeout(() => {
            themePlaying = false;
        }, 280000)
    }
}