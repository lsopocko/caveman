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

// Quad tree

function QuadTree(){
	this.objects = [];	
}

QuadTree.prototype.add = function(object){
	this.objects.push(object);
}
QuadTree.prototype.remove = function(id){
	delete this.objects[id];
}
QuadTree.prototype.retrive = function(object){
	return this.objects;
}
QuadTree.prototype.clear = function(){
	this.objects = [];
}

// Drawing context

function DrawingContext(canvas_tag_id){

	if(typeof canvas_tag_id != 'undefined'){
		w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.canvas = document.getElementById(canvas_tag_id);
		this.context = this.canvas.getContext('2d');

		this.resize((Math.floor(w/32))*32, (Math.floor(h/32)+0.5)*32);
		this.context.imageSmoothingEnabled = false;
		this.context.scale(2,2);
		this.center();	
	}else{
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
	}

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
	this.render_map = [];
	this.current_frame = null;

	if(filename != undefined && filename != "" && filename != null){
		this.image = new Image();
		this.image.src = filename;
		this.updateCurrentFrame();
	}else{
		console.log('unable to load sprite');
	}
}

Sprite.prototype.getCurrentFrame = function(){
	return this.current_frame;
}

Sprite.prototype.updateCurrentFrame = function(){
	canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	context = canvas.getContext('2d');
	context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, 0, 0, this.width, this.height);
	this.current_frame = context;
}

Sprite.prototype.getRenderMap = function(frame){
	this.render_map = [];
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			pixel = frame.getImageData(x, y, 1, 1);
			if(pixel.data[3] != 0){
				this.render_map.push({x:x, y:y});
			}
		}
	}
	return this.render_map;
}

Sprite.prototype.draw = function(x, y){
	if(this.width == null && this.height == null){
		this.screen.context.drawImage(this.image, x, y);
	}else{
		this.updateCurrentFrame();
		this.screen.context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, x, y, this.width, this.height);
	}
}

// Gameobject prototype

function GameObject(params){
	this.position = params.hasOwnProperty('position') ? params.position : {x:0, y:0};
	this.sprite = params.hasOwnProperty('sprite') ? params.sprite : null;
	this.id = params.hasOwnProperty('id') ? params.id : 0;
	this.ticks = 0;
}

GameObject.prototype.draw = function(){
	this.ticks++;
	if(this.ticks > this.sprite.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 48 ? 0 : this.sprite.sourceX+16;
	}
	this.sprite.draw(this.position.x, this.position.y);
}

GameObject.prototype.update = function(dt){

}

GameObject.prototype.delete = function(){
	
}

// Coin prototype

function Coin(params){
	GameObject.call(this, params);
	this.type = 'coin';
	this.sprite.sourceY = 16;
}

Coin.prototype = Object.create(GameObject.prototype);
Coin.prototype.constructor = Coin;

// LaserBeam prototype

function LaserBeam(params){
	GameObject.call(this, params);
	this.type = 'laserbeam';
	this.sprite.sourceY = 32;
	this.start_position = new Vector2d(params.position.x, params.position.y);
	this.speed = 2;
	this.range = 100;
}

LaserBeam.prototype = Object.create(GameObject.prototype);
LaserBeam.prototype.constructor = LaserBeam;

LaserBeam.prototype.draw = function(){
	this.ticks++;
	if(this.ticks > this.sprite.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
	this.sprite.draw(this.position.x, this.position.y);
}

LaserBeam.prototype.update = function(){
	this.position.x += this.speed;
}

// Life prototype

function Life(params){
	GameObject.call(this, params);
	this.type = 'life';
	this.sprite.sourceY = 48;
	this.sprite.sourceX = 16;
}


Life.prototype = Object.create(GameObject.prototype);
Life.prototype.constructor = Life;


Life.prototype.draw = function(){
	this.sprite.draw(this.position.x, this.position.y);
}

// Pistol prototype

function Pistol(params){
	GameObject.call(this, params);
	this.type = 'pistol';
	this.sprite.sourceY = 48;
	this.sprite.sourceX = 0;
}


Pistol.prototype = Object.create(GameObject.prototype);
Pistol.prototype.constructor = Pistol;


Pistol.prototype.draw = function(){
	this.sprite.draw(this.position.x, this.position.y);
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
	this.respawn_after = params.hasOwnProperty('respawn_after') ? params.respawn_after : 1*1000;
	this.time_of_dead = null;
	this.gravity = 16 * 9.8 * 6;
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
	this.direction = params.direction;
	this.id = params.id;
	this.type = 'enemy';
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt){
	var wasleft = this.dx < 0,
		wasright = this.dx > 0,
		acceleration = this.acceleration;

	this.ddx = 0;
	this.ddy = this.gravity;

	if (this.direction == 'left')
      	this.ddx = this.ddx - acceleration;

	if (this.direction == 'right')
      	this.ddx = this.ddx + acceleration;

    if(this.direction == 'right'){
    	this.moveRight();
    }

    if(this.direction == 'left'){
    	this.moveLeft();
    }


    horizontal_movement = Math.round(dt * this.dx);
	this.position.x = this.position.x + horizontal_movement;

    vertical_movement = Math.round(dt * this.dy);
	this.position.y = this.position.y + vertical_movement;

    this.dx = bound(this.dx + (dt * this.ddx), -this.max_vx, this.max_vx);
    this.dy = bound(this.dy + (dt * this.ddy), -this.max_vy, this.max_vy);

    if(vertical_movement > 0){
    	this.falling = true;
    }

}

Enemy.prototype.moveRight = function(){

	this.sprite.sourceY = 0;
	if(this.ticks > this.sprite.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
}

Enemy.prototype.moveLeft = function(){

	this.sprite.sourceY = 48;
	if(this.ticks > this.sprite.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
}


// Player Character prototype

function Player(params){
	Character.call(this, params);
	this.shoting = false;
	this.has_pistol = false;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveRight = function(){

	this.sprite.sourceY = 0;
	if(this.ticks > this.sprite.ticks_per_frame){
		this.ticks = 0;
		this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
	}
}

Player.prototype.moveLeft = function(){

	this.sprite.sourceY = 32;
	if(this.ticks > this.sprite.ticks_per_frame){
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
Player.prototype.shot = function(){
	this.sprite.sourceY = 0;
	this.sprite.sourceX = 48;
	this.shooting = true;
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
}

Player.prototype.update = function(dt, Key){
	var wasleft = this.dx < 0,
		wasright = this.dx > 0,
		falling = this.falling,
		friction = this.friction * (falling ? 0.5 : 1),
		acceleration = this.acceleration * (falling ? 0.5 : 1);

	this.ddx = 0;
	this.ddy = this.gravity;

	if(!this.dead){
		if (Key.isDown(Key.LEFT) && !Key.isDown(Key.CTRL))
	      	this.ddx = this.ddx - acceleration;
	    else if (wasleft)
	      	this.ddx = this.ddx + friction;

		if (Key.isDown(Key.RIGHT) && !Key.isDown(Key.CTRL))
	      	this.ddx = this.ddx + acceleration;
	    else if (wasright)
	      	this.ddx = this.ddx - friction;

	  	if (Key.isDown(Key.SPACE) && !this.jumping && !falling && !Key.isDown(Key.CTRL)) {

			this.ddy = this.ddy - this.jump_height;
			this.jumping = true;
			//Game.jumpAudio.play();
	    }

	    if((Key.isDown(Key.RIGHT) || wasright) && !Key.isDown(Key.CTRL)){
	    	this.moveRight();
	    }

	    if((Key.isDown(Key.LEFT) || wasleft) && !Key.isDown(Key.CTRL)){
	    	this.moveLeft();
	    }

	    if(Key.isDown(Key.CTRL) && this.has_pistol && !Key.isDown(Key.RIGHT) && !Key.isDown(Key.LEFT)){
	    	this.shot();
	    }else{
	    	this.shooting = false;
	    }

	    if(Key.isDown(Key.SPACE) && (Key.isDown(Key.LEFT) || wasleft)){
	    	this.jumpLeft();
	    }else if(Key.isDown(Key.SPACE) && (Key.isDown(Key.RIGHT) || wasright)){
	    	this.jumpRight();	
	    }else if(!Key.isDown(Key.SPACE) && !Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT) && !Key.isDown(Key.CTRL) && !wasright && !wasleft && !this.falling){
	    	this.stop();
	    } 
  
	    horizontal_movement = Math.round(dt * this.dx);
		this.position.x = this.position.x + horizontal_movement;

	    vertical_movement = Math.round(dt * this.dy);
		this.position.y = this.position.y + vertical_movement;


	    this.dx = bound(this.dx + (dt * this.ddx), -this.max_vx, this.max_vx);
	    this.dy = bound(this.dy + (dt * this.ddy), -this.max_vy, this.max_vy);

	    

	    if ((wasleft  && (this.dx > 0)) ||
	        (wasright && (this.dx < 0))) {
	      	this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
	    }

	    if(vertical_movement > 0){
	    	this.falling = true;
	    }

	    //this.checkForCollisions(Map.coliders);
	    // this.checkForPowerUps();
	    // this.checkForCoins();
	    // this.checkForEnemies();

	}else{
		this.dx = 0;
		this.dy = 0;
		this.ddx = 0;

		if(timestamp() >= this.time_of_dead+this.respawn_after){
			this.respawn();
		}
	}
}

Player.prototype.stop = function(){
	this.sprite.sourceY = 16;
	this.sprite.sourceX = 16;
}


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
	this.CTRL = 17;
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

// UI prototype

function UI(sprite, position){
	this.sprite = sprite;
	this.position = position;
	this.life = 0;
}

UI.prototype.draw = function(){
	this.sprite.sourceY = 7*(this.life-1);
	this.sprite.draw(this.position.x, this.position.y);
}
UI.prototype.update = function(player){
	this.life = player.life;
}
UI.prototype.removeLife = function(){}
UI.prototype.addLife = function(){}


// Map prototype

function MapGenerator(json_map, tiles_sprite, screen, viewport){
	this.json_map = json_map;
	this.tiles_sprite = tiles_sprite;
	this.tiles = [];
	this.screen = screen;
	this.viewport = viewport;
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

MapGenerator.prototype.drawTile = function(x, y, tile_index){
	this.screen.context.drawImage(	this.tiles[tile_index], 
									0, 
									0,
									this.json_map.tilewidth, 
									this.json_map.tileheight, 
									(x*this.json_map.tilewidth), 
									(y*this.json_map.tileheight), 
									this.json_map.tilewidth, 
									this.json_map.tileheight);
}

MapGenerator.prototype.drawMap = function(offset_x, offset_y){
	self = this;

	screenTWidth = (this.viewport.width/32)+4;
	screenTHeight = (this.viewport.height/32)+4;

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
				
				if(tile_index != 0) self.drawTile(x+offsetTWidth, y+offsetTHeight, tile_index-self.json_map.tilesets[0].firstgid);
				
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



// Platformer prototype

function Platformer(screen){
	this.callbacks = {init: [], render: [], update: []};
	this.screen = screen;
	this.unit = 16;
	this.fps = 60;
	this.step = 1/this.fps;
	this.now, this.last = timestamp();
	this.ticks = 0;
	this.dt = 0;
	this.enemies = [];
	this.coins = [];
	this.items = [];
	this.laserbeams = [];
	this.intervals = {shooting: false};
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


Platformer.prototype.checkForCollision = function(obj_1, obj_2){

	vX = (obj_1.position.x+8) - (obj_2.x + (obj_2.width / 2));
	vY = (obj_1.position.y+8) - (obj_2.y + (obj_2.height / 2));

	hWidths = 8 + (obj_2.width / 2);
	hHeights = 8 + (obj_2.height / 2);

	collision = false;

	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                collision = {site: 'top', offset_top:oY, offset_left:0, offset_right:0, offset_bottom:0, object:obj_2}
            } else {
                collision = {site: 'bottom', offset_top:0, offset_left:0, offset_right:0, offset_bottom:oY, object:obj_2}
            }
        } else {
            if (vX > 0) {
                collision = {site: 'left', offset_top:0, offset_left:oX, offset_right:0, offset_bottom:0, object:obj_2}
            } else {
                collision = {site: 'right', offset_top:0, offset_left:0, offset_right:oX, offset_bottom:0, object:obj_2}
            }
        }
    }

    return collision;

}

Platformer.prototype.checkForCollisionPixelPerfect = function(obj_1, obj_2){

	obj_1_render_map = obj_1.sprite.getRenderMap(obj_1.sprite.getCurrentFrame());
	obj_2_render_map = obj_2.sprite.getRenderMap(obj_2.sprite.getCurrentFrame());

	//console.log(obj_1.position.x + ' || ' + obj_2.position.x);

	for(var s = 0;s< obj_1_render_map.length; s++){
		obj_1_pixel = obj_1_render_map[s];

		//console.log(obj_1_pixel);
	
		obj_1_x = obj_1.position.x+obj_1_pixel.x;
		obj_1_y = obj_1.position.y+obj_1_pixel.y;

		for(var t = 0;t< obj_2_render_map.length; t++){
			obj_2_pixel = obj_2_render_map[t];
			obj_2_x = obj_2.position.x+obj_2_pixel.x;
			obj_2_y = obj_2.position.y+obj_2_pixel.y;

			if(!((( obj_1_y + 1 ) < ( obj_2_y ) ) ||
					( obj_1_y > ( obj_2_y + 1 ) ) ||
					( ( obj_1_x + 1 ) < obj_2_x ) ||
					( obj_1_x > ( obj_2_x + 1 ) )
				)){
				return true;
			}
			
		}

	}

	//console.log(obj_1_render_map);

}