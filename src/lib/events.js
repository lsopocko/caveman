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

	isDown(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup(event) {
		delete this._pressed[event.keyCode];
	}
}