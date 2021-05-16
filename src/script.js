let canvas = document.getElementById("canvas");
let plyr = document.getElementById("player");
let enmy = document.getElementById("enemy");
let vent = document.getElementById("Vent");
let RedBoss = document.getElementById("RedBoss");
let knife = document.getElementById("Knife");
let plyrShoot = document.getElementById("UZltYi");
let context = canvas.getContext("2d");


class shoot {
    isShoting= false;
    x= 0;
    y= 0;
    speed=9 ;
    dy= 0
    constructor(width,height){
        this.w = width; 
        this.h = height;
    }
}

let score = 0;
let player = {
    isGameOver: false,
    hasWon: false,
    level: 1,
    w: 60,
    h: 80,
    x: canvas.width / 2,
    y: canvas.height - 100,
    speed: 5,
    dx: 0,
    shot :new shoot(15,20)
}
const numOfRockets = 4;
let AllRockets = []
class Rock {
    w = 65;
    h = 55;
    x = Math.floor(Math.random() * (canvas.width - 200));
    y = Math.floor(Math.random() * (canvas.height - 400)) + 200
    
}

const numOfEnemies = 4;
let AllEnemies = []
class Enemy {
    w = 100;
    h = 70;
    x = Math.floor(Math.random() * (canvas.height - 100));
    y = 0;
    dy = 0;
    speed = Math.floor(Math.random() * 3) + (1 / 2); // random speed (1/2 , 3)
    isActive = false
}
class bigEnemy extends Enemy {
    w = 55;
    h = 90;
    dx = 6;
    dy = 8;
    shot = new shoot(15,26);
}

 ///////////////////////
///// main function /////
 //////////////////////
function drawGame() {
    if (!player.isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawScore();
        drawRockets();
        playerShooting();
        rocketShotCollision();
        if (player.level == 1) {
            drawEnemies()
            shotEnemyCollision()
            rocketEnemyCollision()
            playerEnemyCollision()
        }
        else if (player.level == 2) {
            drawBigEnemy();
            printBigEnemyShots();
            bigEnemyShotsCollisions();
        }
        requestAnimationFrame(drawGame);
    }
    else {
        if (player.hasWon) printMessage("    Victory", 'rgba(255, 255, 0, 0.7)',"blue");
        else printMessage("Game Over", "red", "black");
    }
}

function printMessage(msg, backgroundColor, textColor){
    context.fillStyle = backgroundColor;
    context.fillRect(canvas.width / 4 , canvas.height / 2 - 100, 400, 100);
    context.fillStyle = textColor;
    context.font = "italic bold 70px arial,serif";
    context.fillText(msg, canvas.width / 4 , canvas.height / 2 - 20);
}
function drawPlayer(){
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    else if (player.x > canvas.width - 70) player.x = canvas.width - 70;
    context.drawImage(plyr, player.x, player.y, player.w, player.h);
}
big = new bigEnemy();
function drawBigEnemy() {
    big.isActive = true;
    context.drawImage(RedBoss, big.x, big.y, big.w, big.h);
    big.y += big.dy;
    big.x += big.dx;
    if (big.x + big.w >= canvas.width) {big.dx = -big.speed;}
    if (big.y + big.h >= canvas.height - 300) {big.dy = - big.speed;}
    if ((big.x) < 0) { big.dx = big.speed;}
    if ((big.y) < 0) {big.dy = big.speed;}
    big.speed = Math.floor(Math.random() * 10) + (1); // to have a random speed in movement 
}

function printBigEnemyShots() {
    big.shot.y += big.shot.dy; // big.shot.x += big.shot.dx
    big.shot.isShoting = true;
    context.drawImage(knife, big.shot.x, big.shot.y, big.shot.w, big.shot.h);
    big.shot.speed = Math.floor(Math.random() * 5) + (1/2);
    big.shot.dy += big.shot.speed; // big.shot.dx += big.shot.speed;
}

function EnemyGeneretor() {
    for (let i = 0; i < numOfEnemies; i++) {
        e = new Enemy()
        AllEnemies.push(e);
    }

}
function drawEnemies(){
    for (const e of AllEnemies) {
        e.isActive = true
        context.drawImage(enmy, e.x, e.y, e.w, e.h);
        e.y += e.speed
        if (e.y > 630) {
            e.x = Math.floor(Math.random() * (canvas.height - 100))
            e.y = 0;
            e.speed = Math.floor(Math.random() * 3) + (1 / 2);
            continue;
        }
    }
}
//---------
function rocketsGeneretor() {
    for (let i = 0; i < numOfRockets; i++){
        r = new Rock()
        AllRockets.push(r);
    }
}
function drawRockets() {
    for (const r of AllRockets) {
        context.drawImage(vent, r.x, r.y, r.w, r.h);}
}
function drawScore() {
    context.fillStyle = 'black';
    context.font = '20px Verdana';
    context.fillText("Level : " + player.level + " | Score : " + score, canvas.width - 220, 20);
    if (player.level == 1 && score === 50) {
        player.level = 2;
        score = 0;
        player.speed =10;
        player.shot.speed = 15;

    }
    if (player.level == 2 && score === 20) {
        player.hasWon = player.isGameOver = true;
    }
}
function playerShooting() {
    player.shot.y += player.shot.dy

    if (player.shot.y < 0) player.shot.isShoting = false
    if (player.shot.isShoting) {
        context.drawImage(plyrShoot,player.shot.x, player.shot.y, player.shot.w, player.shot.h);
    }
    else if (!player.shot.isShoting) {
        player.shot.x = player.x + (player.w/2);
        player.shot.y = player.y;
        player.shot.dy = 0;
    }
}

function isCollapsed(object_1, object_2) {
    return (object_1.x < object_2.x + object_2.w && object_1.x + object_1.w > object_2.x &&
        object_1.y < object_2.y + object_2.h && object_1.y + object_1.h > object_2.y)
}

function bigEnemyShotsCollisions() {

    if (big.isActive && player.shot.isShoting && isCollapsed(big, player.shot)) {
        player.shot.isShoting = false;
        // ToDo: some effects
        score++;
    }
    if (big.shot.isShoting && isCollapsed(player,big.shot)) {
        player.isGameOver = true;
        big.isShoting = false;
    }
    if (big.shot.isShoting && (big.shot.y > canvas.height /*- 100*/ || big.shot.x > canvas.width)) {
        big.shot.y = big.y + big.h;
        big.shot.x = big.x + (big.w/2);
        big.shot.dy = big.shot.dx= 0;
        big.isShoting = false;
    }
    for (let rocket of AllRockets) {
        if (isCollapsed(rocket,big)||isCollapsed(big, rocket)) {
                big.dx = - big.speed;
                big.dy = - big.speed;
        }
        if ( (isCollapsed(rocket, big.shot)||isCollapsed(rocket, big.shot))) {
            big.shot.y = big.y + big.h;
            big.shot.x = big.x + (big.w/2);
            big.shot.dy = big.shot.dx = 0;
            big.isShoting = false;
        }
    }
}
function rocketEnemyCollision() {
    for (let enemy of AllEnemies) {
        if (enemy.isActive) {
            for (let rocket of AllRockets) {
                if (isCollapsed(enemy, rocket)) {
                    enemy.x = Math.floor(Math.random() * (canvas.height - 100));
                    enemy.y = 0;
                    enemy.speed = Math.floor(Math.random() * 4) + (1 / 2);
                }
            }
        }
    }
}
function rocketShotCollision() {
    for (let rocket of AllRockets) {
        if (player.shot.isShoting && isCollapsed(rocket, player.shot)) {
            player.shot.isShoting = false;
        }
    }
}
function playerEnemyCollision() {
    for (let enemy of AllEnemies) {
        if (enemy.isActive && isCollapsed(enemy, player)) {
            player.isGameOver = true;
        }
    }
}
function shotEnemyCollision() {
    for (let enemy of AllEnemies) {
        if (enemy.isActive && player.shot.isShoting && isCollapsed(enemy, player.shot)) {
            player.shot.isShoting = false;
            enemy.x = Math.floor(Math.random() * (canvas.height - 100));
            enemy.y = 0;
            score++;
        }
    }
}

// events //
document.addEventListener("keyup", keyUp);
document.addEventListener("keydown", keyDown);
function keyDown(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {player.dx = player.speed}
    else if (e.key === "ArrowLeft" || e.key === "Left") {player.dx = -player.speed}
    else if (e.key === "Enter" || e.key === "Return") {
        player.shot.isShoting = true;
        player.shot.dy -= player.shot.speed
    }
}
function keyUp(e) {
    if (e.key === "ArrowRight" || e.key === "Right" || e.key === "ArrowLeft" || e.key === "Left") {
        player.dx = 0;}
}
rocketsGeneretor();
EnemyGeneretor();
drawGame();
