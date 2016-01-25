if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame = 	window.webkitRequestAnimationFrame || 
                               		window.mozRequestAnimationFrame    || 
                               		window.oRequestAnimationFrame      || 
                               		window.msRequestAnimationFrame     || 
                               		function(callback, element) {
                                 		window.setTimeout(callback, 1000 / 60);
                               }
}

import * as helpers from "./lib/helpers";
import {Player, Enemy, Princess} from "./lib/characters";

var Screen = require('./lib/screen.js');
var Camera = require('./lib/camera.js');
var Events = require('./lib/events.js');



const unit = 16,
	gravity = 16 * 9.8 * 6,
	fps = 60,
	step = 1/fps;

let now, last = helpers.timestamp(); 

var Caveman = new helpers.Game();

Caveman.init(function(){
	window.addEventListener('keyup', function(event) { Events.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Events.onKeydown(event); }, false);

	const player = new Princess({});
	console.log(player);
});

// var Caveman = {
// 	init(){
// 		window.addEventListener('keyup', function(event) { Events.onKeyup(event); }, false);
// 		window.addEventListener('keydown', function(event) { Events.onKeydown(event); }, false);

// 		const player = new Princess({});
// 		console.log(player);
// 	}
// }

//Caveman.init();
