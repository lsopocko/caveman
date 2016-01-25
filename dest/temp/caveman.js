"use strict";

var _helpers = require("./lib/helpers");

var helpers = _interopRequireWildcard(_helpers);

var _characters = require("./lib/characters");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

if (!window.requestAnimationFrame) {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
}

var unit = 16,
    gravity = 16 * 9.8 * 6,
    fps = 60,
    step = 1 / fps;

var now = undefined,
    last = helpers.timestamp();

var Screen = require('./lib/screen.js');
var Camera = require('./lib/camera.js');
var Events = require('./lib/events.js');

var Caveman = {
	ticks: 0,

	init: function init() {
		window.addEventListener('keyup', function (event) {
			Events.onKeyup(event);
		}, false);
		window.addEventListener('keydown', function (event) {
			Events.onKeydown(event);
		}, false);

		var player = new _characters.Player({});
	},
	render: function render(dt) {
		Screen.clear();
		this.ticks++;
	},
	update: function update(dt) {},
	frame: function (_frame) {
		function frame() {
			return _frame.apply(this, arguments);
		}

		frame.toString = function () {
			return _frame.toString();
		};

		return frame;
	}(function () {
		now = helpers.timestamp();
		this.dt = this.dt + Math.min(1, (now - last) / 1000);
		while (this.dt > step) {
			this.dt = this.dt - step;
			this.update(step);
		}
		this.render();
		last = now;
		that = this;
		requestAnimationFrame(function () {
			return frame();
		}, Screen.canvas);
	})
};

// var Caveman = {
// 	init(){
// 		window.addEventListener('keyup', function(event) { Events.onKeyup(event); }, false);
// 		window.addEventListener('keydown', function(event) { Events.onKeydown(event); }, false);

// 		const player = new Princess({});
// 		console.log(player);
// 	}
// }

Caveman.init();