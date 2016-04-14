// Keyboard prototype

function keyboardEvents(window){
	this._pressed =  {};
	this.LEFT = 37;
	this.UP = 38;
	this.RIGHT = 39;
	this.DOWN = 40;
	this.W = 87;
	this.S = 83;
	this.A = 65;
	this.D = 68;
	this.SPACE = 32;
	this.CTRL = 17;

	var that = this;

	window.addEventListener('keyup', function(event) { that.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { that.onKeydown(event); }, false);
}

keyboardEvents.prototype.isDown = function(keyCode) {
	return this._pressed[keyCode] ? true : false;
}

keyboardEvents.prototype.onKeydown = function(event) {
	this._pressed[event.keyCode] = true;
}

keyboardEvents.prototype.onKeyup =  function(event) {
	delete this._pressed[event.keyCode];
}

module.exports = keyboardEvents;