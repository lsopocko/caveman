"use strict";

module.exports = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	W: 87,
	S: 83,
	A: 65,
	D: 68,
	SPACE: 32,

	isDown: function isDown(keyCode) {
		return this._pressed[keyCode];
	},
	onKeydown: function onKeydown(event) {
		this._pressed[event.keyCode] = true;
	},
	onKeyup: function onKeyup(event) {
		delete this._pressed[event.keyCode];
	}
};