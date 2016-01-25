'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sum = sum;
exports.bound = bound;
exports.timestamp = timestamp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function sum(a, b) {
	return a + b;
}

function bound(x, min, max) {
	return Math.max(min, Math.min(max, x));
}

function timestamp() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var Texture = exports.Texture = function Texture(image, width, height, offsetX, offsetY) {
	_classCallCheck(this, Texture);

	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	context.drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
	return canvas;
};

var Vector2d = exports.Vector2d = function Vector2d(x, y) {
	_classCallCheck(this, Vector2d);

	this.x = x;
	this.y = y;
	return this;
};

var Sprite = exports.Sprite = function () {
	function Sprite(filename) {
		_classCallCheck(this, Sprite);

		this.image = null;
		this.width = null;
		this.height = null;
		this.sourceX = 0;
		this.sourceY = 0;
		this.pattern = null;
		this.ticksPerFrame = 3;

		if (filename != undefined && filename != "" && filename != null) {
			this.image = new Image();
			this.image.src = filename;
		} else {
			console.log('unable to load sprite');
		}
	}

	_createClass(Sprite, [{
		key: 'draw',
		value: function draw(x, y, context) {
			if (this.width == null && this.height == null) {
				context.drawImage(this.image, x, y);
			} else {
				context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, x, y, this.width, this.height);
			}
		}
	}]);

	return Sprite;
}();

var Game = exports.Game = function () {
	function Game() {
		_classCallCheck(this, Game);
	}

	_createClass(Game, [{
		key: 'update',
		value: function update(h) {
			h();
		}
	}, {
		key: 'render',
		value: function render(dt) {
			Screen.context.clearRect(0, 0, Screen.canvas.width, Screen.canvas.height);
		}
	}, {
		key: 'init',
		value: function init(h) {
			h();
			//Screen.create('screen');
			this.frame();
		}
	}, {
		key: 'frame',
		value: function frame() {
			now = timestamp();
			this.dt = this.dt + Math.min(1, (now - last) / 1000);
			while (this.dt > step) {
				this.dt = this.dt - step;
				this.update(step);
			}
			this.render(this.dt);
			last = now;
			var that = this;
			requestAnimationFrame(function () {
				that.frame();
			}, Screen.canvas);
		}
	}]);

	return Game;
}();