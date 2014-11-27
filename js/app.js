// Game state
var start = false;

// number of enemies (const)
var numEnemy = 5;

// an array of enemies
var allEnemies = [];

// Spin lock for critical section
/*
    As player may be reset while moving and cause position inconsistency,
    this lock ensures player can only do one thing at a time.
 */
var moving = false;


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The speed for each enemy move in x direction
    this.speed = Math.random() * 60 + 60;

    // The position of enemy
    this.x = -100;
    this.y = -100;
};

// Spawn a enemy
Enemy.prototype.spawn = function() {
    // set initial value of x and y
    this.x = -200 - Math.floor(Math.random() * 300);
    this.y = Math.floor(Math.random() * 3) * 80 + 60;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // update position
    this.x += dt * this.speed;

    // respawn enemy if enemy has been out
    if (this.x > 600)
        this.spawn();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player Class
var Player = function() {

    // initial position
    this.x = 202;
    this.y = 404;

    // sprite set
    this.sprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    // choose one of sprite
    this.sprite = this.sprites[2];
};

// Update Player status
Player.prototype.update = function(){

};

// Draw the player on the screen
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset player to initial position, return false if fail
Player.prototype.reset = function() {
    // check spin lock
    if (moving) {
        return false;
    } else {
        // set position
        this.x = 202;
        this.y = 404;
        return true;
    }
};

// Player input handler
Player.prototype.handleInput = function(key){
    // players' moving distance
    var disX = 101;
    var disY = 85;
    this.dx = 0;
    this.dy = 0;

    // calculate target point
    var targetX = this.x;
    var targetY = this.y;

    switch (key) {
        case 'up':
            targetY = this.y - disY;
            this.dy = - disY / 5;
            break;
        case 'down':
            targetY = this.y + disY;
            this.dy = disY / 5;
            break;
        case 'left':
            targetX = this.x - disX;
            this.dx = - disX / 5;
            break;
        case 'right':
            targetX = this.x + disX;
            this.dx = disX / 5;
            break;
    }

    // check if the movement if legal
    if (!(targetX > 500 || targetX < -2 || targetY < 60 || targetY > 450)) {
        // Critical region: transition animation

        // 1. Grab the lock
        moving = true;

        // 2. Do something
        for (i = 0 ; i < 5 ; i++)
            // Here involves a hard coding, which is not a good practice
            setTimeout(function(){
                player.x += player.dx;
                player.y += player.dy;
                player.render();
            },15*i);

        // 3. Release the lock (in predicted future)
        setTimeout(function(){moving = false},70);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// generate enemies
for (i = 0; i < numEnemy; i++) {
    var enemy = new Enemy();
    enemy.spawn();
    allEnemies.push(enemy);
}

// player instance
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
