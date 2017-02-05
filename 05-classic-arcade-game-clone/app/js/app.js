'use strict';

//
// Parameters to tweak the gaming experience
//

// number of enemies that are created when the game begins
const INITIAL_NUMBER_OF_ENEMIES = 4;
// each enemy is assigned a random speed value between min and max
const MIN_ENEMY_SPEED = 50;
const MAX_ENEMY_SPEED = 150;
// maximum number of enemies that are added to the game
const MAX_NUMBER_OF_ENEMIES = 15;
// probability with which additional enemies are added to the game (whenever an enemy has crossed the grid, an additional enemy is added with the given probability)
const ADD_ADDITIONAL_ENEMY_WITH_PROBABILITY = 15;
// each enemy is spawned at a random position (x-coordinate) between min and max
const MIN_ENEMY_RESPAWN_POSITION = -1000;
const MAX_ENEMY_RESPAWN_POSITION = -100;
// how often can the player be hit by an enemy before the game is reset
const NUMBER_OF_LIVES = 3;
// score that needs to be reached to win the game
const SCORE_GAME_OVER = 150;

//
// Enemies
//
var Enemy = function() {
    // background image
    this.sprite = 'images/enemy-bug.png';
    // initial position
    this.x = getRandomNumber(MIN_ENEMY_RESPAWN_POSITION, MAX_ENEMY_RESPAWN_POSITION);
    this.y = 60 + getRandomNumber(0,2) * 85;
    // initial speed
    this.speed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // move enemy in x-direction
    this.x = this.x + (this.speed*dt);
    // re-compute collission zone because the enemy's position has changed
    this.updateCollissionZone();
    // enemy has left the grid and is not visible anymore: make sure the x-coordinate is reset appropriately
    if(this.x > 500){
        // respawn position
        this.x = getRandomNumber(MIN_ENEMY_RESPAWN_POSITION, MAX_ENEMY_RESPAWN_POSITION);
        // respawn speed
        this.speed = getRandomNumber(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED);
        // add an additional enemy with a fixed probability
        if(allEnemies.length < MAX_NUMBER_OF_ENEMIES && getRandomNumber(1,100) > (100 - ADD_ADDITIONAL_ENEMY_WITH_PROBABILITY)){
            // call utility function to add an additional enemy
            addAdditionalEnemy();
        }
    }
    // check if this enemy has collided with the player
    if(!isIntersectionEmpty(this.collissionZone, player.collissionZone)){
        player.reset();
        gameState.playerDied();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Recompute the collission zone (i.e. a rectangle around the visible parts of the enemy sprite)
Enemy.prototype.updateCollissionZone = function(){
    this.collissionZone = {
        "upperLeft": {
            "x": this.x,
            "y": this.y + 75
        },
        "width": 100,
        "height": 70
    };
};

//
// Player
//
var Player = function(aSprite) {
    this.sprite = aSprite;
    this.reset();
    this.updateCollissionZone();
};

// Update the player's position if it has reached the river
Player.prototype.update = function() {
    if(this.hasReachedWater()){
        gameState.increaseScoreBy(allEnemies.length);
        this.reset();
    }
};

// Render the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// React to input events (i.e. move the player on the grid)
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
    // for performance reasons, the player's collission zone is only updated when it has moved
    this.updateCollissionZone();
    };

// Move the player to the left
Player.prototype.moveLeft = function() {
    var horizontalOffset = 100;
    if(this.x >= horizontalOffset){
        this.x = this.x-horizontalOffset;
    }
};

// Move the player to the rigth
Player.prototype.moveRight = function() {
    var horizontalOffset = 100;
    if(this.x <= 301){
        this.x = this.x+horizontalOffset;
    }
};

// Move the player up
Player.prototype.moveUp = function() {
    var verticalOffset = 83;
    if(this.y >= 69){
        this.y = this.y-verticalOffset;
    }
};

// Move the player down
Player.prototype.moveDown = function() {
    var verticalOffset = 83;
    if(this.y < 400) {
        this.y = this.y + 83;
    }
};

// Check if the player has reached the water (resp. the river)
Player.prototype.hasReachedWater = function() {
    return this.y < 0;
};

// Reset the player's position
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 401;
    // for performance reasons, the player's collission zone is only updated when it has moved
    this.updateCollissionZone();
};

// Recompute the collission zone (i.e. a rectangle around the visible parts of the player sprite)
Player.prototype.updateCollissionZone = function(){
    this.collissionZone = {
        "upperLeft": {
            "x": this.x + 20,
            "y": this.y + 60
        },
        "width": 60,
        "height": 80
    };
};

//
// GameState
//
var GameState = function() {
    this.init();
};

// Initialize the game state
GameState.prototype.init = function(){
    this.score = 0;
    this.remainingLives = NUMBER_OF_LIVES;
};

// Render the game state
GameState.prototype.render = function() {
    // status text message
    var statusText;
    if(this.youWonMessage) {
        statusText = this.youWonMessage;
    } else {
        statusText = "Score: " + this.score + "/" + SCORE_GAME_OVER + " \t\t\tLives: " + this.remainingLives + "\t\t\tEnemies: " + allEnemies.length;
    }
    // status text style
    ctx.font = '20px serif';
    ctx.fillStyle = 'white';
    // layout text (centered)
    ctx.fillText(statusText, (ctx.canvas.width - ctx.measureText(statusText).width) / 2, 570);
};

// Update the game state and trigger the reset of the game if no lives remain
GameState.prototype.update = function() {
    if(this.remainingLives === 0) {
        this.init();
        allEnemies = createEnemies(INITIAL_NUMBER_OF_ENEMIES);
    }
    if(this.score >= SCORE_GAME_OVER){
        // real gamers would expect something more fancy... but that's hopefully sufficient for the demo game
        this.youWonMessage = "Congratulations. You have won. Go back to work.";
        allEnemies = [];
    }
};

// Increase the score by the given number
GameState.prototype.increaseScoreBy = function(aNumber) {
    this.score = this.score + aNumber;
};

// Decrease the remaining number of lives by 1
GameState.prototype.playerDied = function(aNumber) {
    this.remainingLives = this.remainingLives - 1;
};


// Register an event listener for the 'keyup' event that dispatches to the
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

// Return a random number in the interval [lBound, uBound].
function getRandomNumber(lBound, uBound){
    return Math.floor(Math.random() * (uBound - lBound + 1)) + lBound;
}

// Check if the intersection between two rectangles is empty
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

// adds a new enemy to the game
function addAdditionalEnemy(){
    allEnemies.push(new Enemy());
}

// Creates the given number of enemies and returns an array that contains those enemies
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