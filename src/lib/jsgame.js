// reauestAnimationFrame polyfil

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame = 	window.webkitRequestAnimationFrame || 
                               		window.mozRequestAnimationFrame    || 
                               		window.oRequestAnimationFrame      || 
                               		window.msRequestAnimationFrame     || 
                               		function(callback, element) {
                                 		window.setTimeout(callback, 1000 / 60);
                               }
}

// Helpers

function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

// Drawing context

function DrawingContext(canvas_tag_id){

	w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	this.canvas = document.getElementById(canvas_tag_id);
	this.context = this.canvas.getContext('2d');

	this.resize((Math.floor(w/32))*20, (Math.floor(h/32))*20);
	this.context.imageSmoothingEnabled = false;
	this.context.scale(2,2);
	this.center();	
}

DrawingContext.prototype.resize =  function(width, height){
	this.canvas.width = width;
	this.canvas.height = height;
}

DrawingContext.prototype.fitToViewport = function(){
	w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	this.resize((Math.floor(w/32))*20, (Math.floor(h/32))*20);
	this.context.imageSmoothingEnabled = false;
	this.context.scale(2,2);
	this.center();
}

DrawingContext.prototype.center = function(){
	this.canvas.style.marginLeft = ((this.canvas.width/2)*-1)+'px';
	this.canvas.style.marginTop = ((this.canvas.height/2)*-1)+'px';
}

// Texture prototype

function Texture(image, width, height, offsetX, offsetY){
		canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		context = canvas.getContext('2d');
		context.drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
		return canvas;
}

// Vector2d prototype

function Vector2d(x, y){
	this.x = x;
	this.y = y;
	return this;
}

// Sprite prototype

function Sprite(filename, screen, width, hegiht, ticks_per_frame){

	this.image = null; 
	this.width = width;
	this.height = hegiht;
	this.sourceX = 0;
	this.sourceY = 0;
	this.pattern = null;
	this.ticks_per_frame = ticks_per_frame;
	this.screen = screen;

	if(filename != undefined && filename != "" && filename != null){
		this.image = new Image();
		this.image.src = filename;
	}else{
		console.log('unable to load sprite');
	}
}

Sprite.prototype.draw = function(x, y){
	if(this.width == null && this.height == null){
		this.screen.context.drawImage(this.image, x, y);
	}else{
		this.screen.context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, x, y, this.width, this.height);
	}
}

// Character prototype

function Character(params){

	this.position = params.hasOwnProperty('position') ? params.position : {x:0, y:0};
	this.sprite = params.hasOwnProperty('sprite') ? params.sprite : null;
	this.dx = 0;
	this.dy = 0;
	this.max_vx = params.hasOwnProperty('max_vx') ? params.max_vx : 16 * 7.5;
	this.max_vy = params.hasOwnProperty('max_vy') ? params.max_vy : 16 * 15;
	this.acceleration = params.hasOwnProperty('acceleration') ? params.acceleration : this.max_vx * 10;
	this.friction = params.hasOwnProperty('friction') ? params.friction : this.max_vx * 6;
	this.jump_height = params.hasOwnProperty('jump_height') ? params.jump_height : 18*1500;
	this.ticks = 0;
	this.ticks_per_frame = params.hasOwnProperty('ticks_per_frame') ? params.ticks_per_frame : 4;
	this.jumping = false;
	this.falling = true;
	this.life = params.hasOwnProperty('life') ? params.life : 6;
	this.spawn = params.hasOwnProperty('spawn') ? params.spawn : {x:0, y:0};
	this.dead = false;
	this.respawn_after = params.hasOwnProperty('respawn_after') ? params.respawn_after : 5*1000;
	this.time_of_dead = null;

}

Character.prototype.update = function(dt, events){}

Character.prototype.draw = function(){
	this.ticks++;
	this.sprite.draw(this.position.x, this.position.y);
}

Character.prototype.moveLeft = function(){}

Character.prototype.moveRight = function(){}

Character.prototype.jump = function(){}

Character.prototype.die = function(){}

Character.prototype.stop = function(){}

// Enemy Character prototype

function Enemy(params){
	Character.call(this, params);
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Player Character prototype

function Player(params){
	Character.call(this, params);
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveRight = function(){

	this.sprite.sourceY = 0;
	if(this.ticks > this.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
}

Player.prototype.moveLeft = function(){

	this.sprite.sourceY = 32;
	if(this.ticks > this.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
}

Player.prototype.jumpRight = function(){
	this.sprite.sourceY = 16;
	this.sprite.sourceX = 0;
}

Player.prototype.jumpLeft = function(){
	this.sprite.sourceY = 48;
	this.sprite.sourceX = 0;
}

Player.prototype.die = function(){
	this.sprite.sourceY = 16;
	this.sprite.sourceX = 48;
	this.life -= 1;
	this.dead = true;
	this.time_of_dead = timestamp();			
}

Player.prototype.respawn = function(){
	this.dead = false;
	this.sprite.sourceY = 16;
	this.sprite.sourceX = 16;
	this.position.x = this.spawn.x;
	this.position.y = this.spawn.y;
	Camera.offset.x = 0;
	Camera.offset.y = 0;

}

Player.prototype.stop = function(){
	this.sprite.sourceY = 16;
	this.sprite.sourceX = 16;
}

Player.prototype.checkForCollisions = function(coliders){
	player = this;
	coliders.map(function(object){
		vX = (player.position.x+8) - (object.x-Camera.offset.x + (object.width / 2));
		vY = (player.position.y+8) - (object.y-Camera.offset.y + (object.height / 2));

		hWidths = 8 + (object.width / 2);
		hHeights = 8 + (object.height / 2);

		if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        // figures out on which side we are colliding (top, bottom, left, or right)
	        var oX = hWidths - Math.abs(vX),
	            oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                player.position.y += oY;
	                player.dy = 0;
	            } else {
	                player.position.y -= oY;
	                player.dy = 0;
	                player.falling = false;
	                player.jumping = false;
	            }
	        } else {
	            if (vX > 0) {
	                player.position.x += oX;
	                player.dx = 0;
	            } else {
	                player.position.x -= oX;
	                player.dx = 0;
	            }
	        }
	        if(object.killing && !player.dead){
	        	player.die();
	        }
	    }

	});
};

// Keyboard prototype

function KeyboardEvents(){
	this._pressed =  {};
	this.LEFT = 37;
	this.UP = 38;
	this.RIGHT = 39;
	this.DOWN = 40;
	this.W = 87;
	this.S = 83;
	this.A = 65;
	this.D = 68;
	this.SPACE = 32;
}

KeyboardEvents.prototype.isDown = function(keyCode) {
	return this._pressed[keyCode] ? true : false;
}

KeyboardEvents.prototype.onKeydown = function(event) {
	this._pressed[event.keyCode] = true;
}

KeyboardEvents.prototype.onKeyup =  function(event) {
	delete this._pressed[event.keyCode];
}

// Map prototype

function MapGenerator(json_map, tiles_sprite, screen){
	this.json_map = json_map;
	this.tiles_sprite = tiles_sprite;
	this.tiles = [];
	this.coliders = [];
	this.items = [];
	this.coins = [];
	this.enemies = [];
	this.princess = [];
	this.screen = screen;
}

MapGenerator.prototype.generateTiles = function(){
	tiles = (this.tiles_sprite.width/this.json_map.tilewidth) * (this.tiles_sprite.height/this.json_map.tileheight);
	x = 0;y = 0;
	for(i=0;i<=tiles;i++){
		this.tiles[i] = new Texture(this.tiles_sprite, this.json_map.tilewidth, this.json_map.tileheight, x*this.json_map.tilewidth, y*this.json_map.tileheight);
		x++;
		if(x*this.json_map.tilewidth >= this.tiles_sprite.width){
			x=0;
			y++;
		}
	}
}

MapGenerator.prototype.drawTile = function(x, y, tile_index, offset_x, offset_y){
	this.screen.context.drawImage(	this.tiles[tile_index], 
									0, 
									0,
									this.json_map.tilewidth, 
									this.json_map.tileheight, 
									(x*this.json_map.tilewidth)-offset_x, 
									(y*this.json_map.tileheight)-offset_y, 
									this.json_map.tilewidth, 
									this.json_map.tileheight);
}

MapGenerator.prototype.drawMap = function(offset_x, offset_y){
	self = this;

	screenTWidth = (this.screen.canvas.width/32)+4;
	screenTHeight = (this.screen.canvas.height/32)+4;

	offsetTWidth = Math.abs(Math.floor((2*offset_x)/32));
	offsetTHeight = Math.abs(Math.floor((2*offset_y)/32));

	this.json_map.layers.map(function(layer){
		if(layer.type == 'tilelayer'){
			x=0;
			y=0;
			offset = 0;

			i = 0;
			tilesOnScreen = screenTWidth*screenTHeight;

			while(i < tilesOnScreen){

				tile_index = layer.data[(x+offsetTWidth)+((y+offsetTHeight)*self.json_map.width)];

				if(typeof tile_index == 'undefined') break;
				
				if(tile_index != 0) self.drawTile(x+offsetTWidth, y+offsetTHeight, tile_index-self.json_map.tilesets[0].firstgid, offset_x, offset_y);
				
				x++;
				if(x > screenTWidth){
					x = 0;
					y++;
				}
				i++;
			}
		}
	});			
}

MapGenerator.prototype.drawCoins = function(sprite, offset_x, offset_y, ticks){
	sprite.sourceY = 16;
	if(!(ticks%sprite.ticks_per_frame)){
		sprite.sourceX = sprite.sourceX == 48 ? 0 : sprite.sourceX+16;
	}
	this.coins.map(function(coin){
		if(!coin.deleted){
			sprite.draw(coin.x-offset_x, (coin.y-coin.height)-offset_y);
		}
	});
}

MapGenerator.prototype.loadObjects = function(){
	self = this;		
	this.json_map.layers.map(function(layer){
		if(layer.type == 'objectgroup' && layer.name == "Coliders"){
			layer.objects.map(function(object){
				self.coliders.push({x: object.x, y: object.y, tile: 256, killing: object.type == 'killing' ? true : false, width: object.width, height: object.height});
			});
		}
		if(layer.type == 'objectgroup' && layer.name == "Items"){
			layer.objects.map(function(object){
				self.items.push({x: object.x, y: object.y, tile: object.gid, type: object.type, width: object.width, height: object.height, deleted: false});
			});
		}
		if(layer.type == 'objectgroup' && layer.name == "Coins"){
			layer.objects.map(function(object){
				self.coins.push({x: object.x, y: object.y, width: object.width, height: object.height, deleted: false});
			});
		}
		if(layer.type == 'objectgroup' && layer.name == "Enemies"){
			layer.objects.map(function(object){
				self.enemies.push({x: object.x, y: object.y, width: object.width, height: object.height, deleted: false});
			});
		}
	});
}

// Platformer prototype

function Platformer(screen){
	this.callbacks = {init: [], render: [], update: []};
	this.screen = screen;
	this.unit = 16;
	this.gravity =  16 * 9.8 * 6;
	this.fps = 60;
	this.step = 1/this.fps;
	this.now, this.last = timestamp();
	this.ticks = 0;
	this.dt = 0;
	this.sprites = [];
}

Platformer.prototype.onInit = function (callback){ 
	this.callbacks.init.push(callback);
} 

Platformer.prototype.onRender = function (callback){ 
	this.callbacks.render.push(callback);
} 

Platformer.prototype.onUpdate = function (callback){ 
	this.callbacks.update.push(callback);

} 

Platformer.prototype.init = function(context){
	
	i = 0;
	while(i < this.callbacks.init.length){
		this.callbacks.init[i]();
		i++;
	}
	this.frame();
}
Platformer.prototype.render = function(dt){
	this.ticks++;
	i = 0;
	while(i < this.callbacks.render.length){
		this.callbacks.render[i]();
		i++;
	}
}
Platformer.prototype.update = function(dt){
	i = 0;
	while(i < this.callbacks.update.length){
		this.callbacks.update[i](dt);
		i++;
	}	
}
Platformer.prototype.frame = function(){
	this.now = timestamp();
	this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
	while(this.dt > this.step){
		this.dt = this.dt - this.step;
		this.update(this.step);
	}
	this.render();
	this.last = this.now;
	requestAnimationFrame(() => this.frame(), this.screen.canvas);
}
Platformer.prototype.addSprite = function(name, sprite){
	this.sprites.push({	sprite_name: name, 
						sprite: sprite});
}

Platformer.prototype.getSprite = function(name){
	return this.sprites.filter(function(item){
		if(item.sprite_name == name) return item;
	})[0].sprite;

}