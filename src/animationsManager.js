function animationsManager(){
	var animations = [],
		ticks = 0,
		frameIndex = 0;

	this.currentFrame = 'stop';

	this.add = function(name, frames, speed){
		animations[name] = {frames: frames, speed: speed}
	};

	this.remove = function(name, frames, speed){
		animations[name] = {frames: frames, speed: speed}
	};

	this.play = function(name){
		if(!(ticks % animations[name].speed)){
			this.currentFrame = animations[name].frames[frameIndex];

			if(frameIndex == animations[name].frames.length-1){
				frameIndex = 0;
			}else{
				frameIndex++;
			}

			ticks = 0;
		}
		ticks++;
	};

	this.list = function(){
		return animations;
	};
}


module.exports = animationsManager;