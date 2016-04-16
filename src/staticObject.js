var PIXI = require('./pixi.min');

function staticObject(textures, defaultTexture){
	this.textures = textures;
	PIXI.Sprite.call(this, textures[defaultTexture]);
}

staticObject.prototype = Object.create(PIXI.Sprite.prototype);
staticObject.prototype.constructor = staticObject;



module.exports = staticObject;