var PIXI = require('./pixi.min'),
	AnimationsManager = require('./animationsManager');

function AnimatedObject(textures){
	this.animations = new AnimationsManager();
	this.textures = textures;
	PIXI.Sprite.call(this, textures['stop']);
}

AnimatedObject.prototype = Object.create(PIXI.Sprite.prototype);
AnimatedObject.prototype.constructor = AnimatedObject;

AnimatedObject.prototype.animate = function(animation){
	this.animations.play(animation);
	this.texture = this.textures[this.animations.currentFrame];
}

module.exports = AnimatedObject;