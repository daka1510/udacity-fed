//
// Parameters to tweak the gaming experience
//
const INITIAL_NUMBER_OF_ENEMIES = 4;
const MIN_ENEMY_SPEED = 50;
const MAX_ENEMY_SPEED = 150;
const MAX_NUMBER_OF_ENEMIES = 15;
const ADD_ADDITIONAL_ENEMY_WITH_PROBABILITY = 15; // the higher the value, the faster are more enemies added
const MIN_ENEMY_RESPAWN_POSITION = -1000;
const MAX_ENEMY_RESPAWN_POSITION = -100;
const NUMBER_OF_LIVES = 3;

//
// Enemies
//
var Enemy = function() {
    // background image
    this.sprite = 'images/enemy-bug.png';
    // initial position
    this.x = getRandomNumber(MIN_ENEMY_RESPAWN_POSITION, MAX_ENEMY_RESPAWN_POSITION);
    this.y = 60+getRandomNumber(0,2)*85;
    this.speed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + (this.speed*dt);
    this.updateCollissionZone();
    if(this.x > 500){
        this.x = getRandomNumber(MIN_ENEMY_RESPAWN_POSITION, MAX_ENEMY_RESPAWN_POSITION);
        this.speed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
        if(allEnemies.length < MAX_NUMBER_OF_ENEMIES && getRandomNumber(1,100) > (100 - ADD_ADDITIONAL_ENEMY_WITH_PROBABILITY)){
            var enemy = new Enemy();
            console.log("adding an additional enemy: " + enemy);
            allEnemies.push(new Enemy());
        }
    }
    if(!isIntersectionEmpty(this.collissionZone, player.collissionZone)){
        player.reset();
        gameState.playerDied();
    };
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.updateCollissionZone = function(){
    // the visible players (here: char-boy) do not fill the whole sprite,
    // compute the "collission zone" (i.e. a rectangle around the visible character)
    // based on the current coordinates
    this.collissionZone = {
        "upperLeft": {
            "x": this.x,
            "y": this.y + 75
        },
        "width": 100,
        "height": 70
        }
};

//
// Player
//
var Player = function(aSprite) {
    this.sprite = aSprite;
    this.reset();
    this.updateCollissionZone();
};

Player.prototype.update = function() {
    if(this.hasReachedWater()){
        console.log(allEnemies.length);
        gameState.increaseScoreBy(allEnemies.length);
        this.reset();
    }
};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case "up":
            this.moveUp();
            break;
        case "down":
            this.moveDown();
            break;
        case "left":
            this.moveLeft();
            break;
        case "right":
            this.moveRight();
            break;
    }
    this.updateCollissionZone();
    console.log(this.sprite + " has moved to: (" +  this.x + ", " + this.y + "), collission zone: " + JSON.stringify(this.collissionZone));
};

Player.prototype.moveLeft = function() {
    var horizontalOffset = 100;
    if(this.x >= horizontalOffset){
        this.x = this.x-horizontalOffset;
    }
}

Player.prototype.moveRight = function() {
    var horizontalOffset = 100;
    if(this.x <= 301){
        this.x = this.x+horizontalOffset;
    }
}

Player.prototype.moveUp = function() {
    var verticalOffset = 83;
    if(this.y >= 69){
        this.y = this.y-verticalOffset;
    }
}

Player.prototype.moveDown = function() {
    var verticalOffset = 83;
    if(this.y < 400) {
        this.y = this.y + 83;
    }
}

Player.prototype.hasReachedWater = function() {
    return this.y < 0;
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 401;
    this.updateCollissionZone();
};

Player.prototype.updateCollissionZone = function(){
    // the visible players (here: char-boy) do not fill the whole sprite,
    // compute the "collission zone" (i.e. a rectangle around the visible character)
    // based on the current coordinates
    this.collissionZone = {
        "upperLeft": {
            "x": this.x + 20,
            "y": this.y + 60
        },
        "width": 60,
        "height": 80
    }
};

//
// GameState
//
var GameState = function() {
    this.init();
};

// initialize the game state
GameState.prototype.init = function(){
    this.score = 0;
    this.remainingLives = NUMBER_OF_LIVES;
}

// render the game state
GameState.prototype.render = function() {
    // status text message
    var statusText = "Score: " + this.score + " \t\t\tLives: " + this.remainingLives + "\t\t\tEnemies: " + allEnemies.length;
    // status text style
    ctx.font = '20px serif';
    ctx.fillStyle = 'white';
    // layout text (centered)
    ctx.fillText(statusText, (ctx.canvas.width - ctx.measureText(statusText).width) / 2, 570);
};

// udpate the game state
GameState.prototype.update = function() {
    if(this.remainingLives == 0) {
        this.init();
        allEnemies = createEnemies(INITIAL_NUMBER_OF_ENEMIES);
    }
}

// increase the score by the given number
GameState.prototype.increaseScoreBy = function(aNumber) {
    this.score = this.score + aNumber;
};

// decrease the remaining number of lives by 1
GameState.prototype.playerDied = function(aNumber) {
    this.remainingLives = this.remainingLives - 1;
};


// register an event listener for the 'keyup' event that dispatches to the
// player's handleInput function
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// return a random number in the interval [lBound, uBound].
function getRandomNumber(lBound, uBound){
    return Math.floor(Math.random() * (uBound - lBound + 1)) + lBound;
}

// check if the intersection between two rectangles is empty
function isIntersectionEmpty(aCollissionZone1, aCollissionZone2) {
    // assign to variables for better readability
    var x1 = aCollissionZone1.upperLeft.x;
    var y1 = aCollissionZone1.upperLeft.y;
    var w1 = aCollissionZone1.width;
    var h1 = aCollissionZone1.height;
    var x2 = aCollissionZone2.upperLeft.x;
    var y2 = aCollissionZone2.upperLeft.y;
    var w2 = aCollissionZone2.width;
    var h2 = aCollissionZone2.height;
    // see also: http://stackoverflow.com/questions/13390333/two-rectangles-intersection
    return (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}

function createEnemies(aNumberOfEnemies) {
    var myEnemies = [];
    for (var i = 0; i < aNumberOfEnemies; i++){
        myEnemies.push(new Enemy());
    }
    return myEnemies;
}

//
// Instantiation
//
var allEnemies = createEnemies(INITIAL_NUMBER_OF_ENEMIES);
var player = new Player('images/char-boy.png');
var gameState = new GameState();