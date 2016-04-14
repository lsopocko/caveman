var PIXI = require('./pixi.min'),
	AnimatedObject = require('./animatedObject');

function Player(textures){
	this.speed = 1;
	this.vx = 0;


	AnimatedObject.call(this, textures);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
}

Player.prototype = Object.create(AnimatedObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveRight = function(){
	this.x += this.speed;
	this.animate('walk');
}

Player.prototype.moveLeft = function(){
	this.x -= this.speed;
	this.animate('left');
}

Player.prototype.moveUp = function(){
	this.y -= this.speed;
	this.animations.play('move up');
}

Player.prototype.walk = function(){
	this.animate('walk');
}


module.exports = Player;