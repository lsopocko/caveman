var PIXI = require('./pixi.min');

var Renderer = (function(){
	var renderer,
		canvasWidth = 640,
		canvasHeight = 480,
		layers = [];

	function getScreenWidth(){
		body = document.getElementsByTagName('body')[0];
		return body.offsetWidth;
	}

	function getScreenHeight(){
		body = document.getElementsByTagName('body')[0];
		return body.offsetHeight;
	}

	function resize(){

	}

	return {

		init: function(params){
			if(params.fullscreen){
				canvasWidth = getScreenWidth();
				canvasHeight = getScreenHeight();
			}

			renderer = new PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
			document.body.appendChild(renderer.view);
		},

		render: function(){
			stage = new PIXI.Container();
			for(i=0;i<layers.length;i++){
				stage.addChild(layers[i].content);
			}
			renderer.render(stage);
		},

		addLayer: function(name, content){
			container = new PIXI.Container();
			container.addChild(content);
			layers.push({name: name, content: container});
		},

		addToLayer: function(layer, content){
			for(i=0;i<layers.length;i++){
				if(layers[i].name == layer){
					layers[i].addChild(content);
				}
			}
		}
	};

})();

module.exports = Renderer;