// module screen
module.exports = {
	canvas: null,
	context: null,
	create(canvas_tag_id){
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.canvas = document.getElementById(canvas_tag_id);
		this.context = this.canvas.getContext('2d');

		this.resize((Math.floor(w/32))*20, (Math.floor(h/32))*20);
		this.context.imageSmoothingEnabled = false;
		this.context.scale(2,2);
		this.center();
		return this.context;
	},
	resize(width, height){
		this.canvas.width = width;
		this.canvas.height = height;
	},
	fitToViewport(){
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		this.resize((Math.floor(w/32))*20, (Math.floor(h/32))*20);
		this.context.imageSmoothingEnabled = false;
		this.context.scale(2,2);
		this.center();
	},
	center(){
		this.canvas.style.marginLeft = ((this.canvas.width/2)*-1)+'px';
		this.canvas.style.marginTop = ((this.canvas.height/2)*-1)+'px';
	}
}