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

const unit = 16,
	gravity = 16 * 9.8 * 6,
	fps = 60,
	step = 1/fps;

let now, last = helpers.timestamp();

let Screen = require('./lib/screen.js');
let Camera = require('./lib/camera.js');
let Events = require('./lib/events.js');

let Caveman = {
	ticks:0,

	init(){
		window.addEventListener('keyup', function(event) { Events.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Events.onKeydown(event); }, false);

		const player = new Player({});
	},
	render(dt){
		Screen.clear();
		this.ticks++;
	},
	update(dt){
		
	},
	frame(){
		now = helpers.timestamp();
		this.dt = this.dt + Math.min(1, (now - last) / 1000);
		while(this.dt > step){
			this.dt = this.dt - step;
			this.update(step);
		}
		this.render();
		last = now;
		that = this;
		requestAnimationFrame(() => frame(), Screen.canvas);
	}
}




// var Caveman = {
// 	init(){
// 		window.addEventListener('keyup', function(event) { Events.onKeyup(event); }, false);
// 		window.addEventListener('keydown', function(event) { Events.onKeydown(event); }, false);

// 		const player = new Princess({});
// 		console.log(player);
// 	}
// }

Caveman.init();
