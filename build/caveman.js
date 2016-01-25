(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _helpers = require('./lib/helpers');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Screen = require('./lib/screen.js');

var Caveman = {
	init: function init() {
		Screen.create('screen');
		console.log('test');
	}
};

Caveman.init();
},{"./lib/helpers":2,"./lib/screen.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sum = sum;
exports.bound = bound;
exports.timestamp = timestamp;
function sum(a, b) {
    return a + b;
}

function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
},{}],3:[function(require,module,exports){
'use strict';

// module screen
module.exports = {
	canvas: null,
	context: null,
	create: function create(canvas_tag_id) {
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.canvas = document.getElementById(canvas_tag_id);
		this.context = this.canvas.getContext('2d');

		this.resize(Math.floor(w / 32) * 20, Math.floor(h / 32) * 20);
		this.context.imageSmoothingEnabled = false;
		this.context.scale(2, 2);
		this.center();
		return this.context;
	},
	resize: function resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	},
	fitToViewport: function fitToViewport() {
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		this.resize(Math.floor(w / 32) * 20, Math.floor(h / 32) * 20);
		this.context.imageSmoothingEnabled = false;
		this.context.scale(2, 2);
		this.center();
	},
	center: function center() {
		this.canvas.style.marginLeft = this.canvas.width / 2 * -1 + 'px';
		this.canvas.style.marginTop = this.canvas.height / 2 * -1 + 'px';
	}
};
},{}]},{},[1]);
