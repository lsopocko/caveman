import * as helpers from "./lib/helpers";
var Screen = require('./lib/screen.js');

var Caveman = {
	init(){
		Screen.create('screen');
		console.log('test');
	}
}

Caveman.init();
