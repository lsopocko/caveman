export function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

export function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

export class Texture{
	constructor(image, width, height, offsetX, offsetY){
		canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		context = canvas.getContext('2d');
		context.drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
		return canvas;
	}
}

export class Vector2d{
	constructor(x, y){
		this.x = x;
		this.y = y;
		return this;
	}
}

export class Sprite{

	constructor(filename) {
		this.image = null;
		this.width = null;
		this.height = null;
		this.sourceX = 0;
		this.sourceY = 0;
		this.pattern = null;
		this.ticksPerFrame = 3;

		if(filename != undefined && filename != "" && filename != null){
			this.image = new Image();
			this.image.src = filename;
		}else{
			console.log('unable to load sprite');
		}

	}

	draw(x, y, context){
		if(this.width == null && this.height == null){
			context.drawImage(this.image, x, y);
		}else{
			context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, x, y, this.width, this.height);
		}
		
	}
}

