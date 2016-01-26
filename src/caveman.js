window.onload = function(){

	Camera = {	margin: 100,
				offset: {x: 0, y: 0}}

	tiles = new Image();
	tiles.src = '/assets/sprites/tiles.png';

	var Screen = new DrawingContext('screen');
	var Caveman = new Platformer(Screen);
	var Keyboard = new KeyboardEvents();
	var Map = new MapGenerator(json_map, tiles, Screen);

	var cPlayer = new Player({	position: new Vector2d(4*16, 4*16),
								spawn: new Vector2d(4*16, 4*16),
								sprite: new Sprite('/assets/sprites/player.png', Screen, 16, 16, 3)});

	cPlayer.update = function(dt, Key){

		var wasleft = this.dx < 0,
			wasright = this.dx > 0,
			falling = this.falling,
			friction = this.friction * (falling ? 0.5 : 1),
			acceleration = this.acceleration * (falling ? 0.5 : 1);

		this.ddx = 0;
		this.ddy = Caveman.gravity;

		if(!this.dead){
			if (Key.isDown(Key.LEFT))
		      	this.ddx = this.ddx - acceleration;
		    else if (wasleft)
		      	this.ddx = this.ddx + friction;

			if (Key.isDown(Key.RIGHT))
		      	this.ddx = this.ddx + acceleration;
		    else if (wasright)
		      	this.ddx = this.ddx - friction;

	      	if (Key.isDown(Key.SPACE) && !this.jumping && !falling) {

				this.ddy = this.ddy - this.jump_height;
				this.jumping = true;
				//Game.jumpAudio.play();
		    }

		    if(Key.isDown(Key.RIGHT) || wasright){
		    	this.moveRight();
		    }

		    if(Key.isDown(Key.LEFT) || wasleft){
		    	this.moveLeft();
		    }

		    if(Key.isDown(Key.SPACE) && (Key.isDown(Key.LEFT) || wasleft)){
		    	this.jumpLeft();
		    }else if(Key.isDown(Key.SPACE) && (Key.isDown(Key.RIGHT) || wasright)){
		    	this.jumpRight();	
		    }else if(!Key.isDown(Key.SPACE) && !Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT) && !wasright && !wasleft && !this.falling){
		    	this.stop();
		    }

		    horizontal_movement = Math.round(dt * this.dx);

		    if(((this.position.x*2)) >= Screen.canvas.width-Camera.margin && (Key.isDown(Key.RIGHT) || wasright) && (Camera.offset.x+Screen.canvas.width < (((Map.json_map.width*Map.json_map.tilewidth)*2)-Camera.offset.x))){
		    	this.position.x = this.position.x;
		    	Camera.offset.x += horizontal_movement;
		    }else if(((this.position.x*2)) <= Camera.margin && (Key.isDown(Key.LEFT) || wasleft) && Camera.offset.x > 0){
		    	this.position.x = this.position.x;
		    	Camera.offset.x += horizontal_movement;
		    }else{
		    	this.position.x = this.position.x + horizontal_movement;
		    }

		    vertical_movement = Math.round(dt * this.dy);

		    if(((this.position.y*2) >= Screen.canvas.height-Camera.margin && !this.jumping) && (Camera.offset.y+Screen.canvas.height < (((Map.json_map.height*Map.json_map.tileheight)*2)-Camera.offset.y))){
		    	this.position.y = this.position.y;
		    	Camera.offset.y += vertical_movement;
		    }else if((this.position.y*2) <= Screen.canvas.height-Camera.margin && this.jumping && Camera.offset.y > 0){
		    	this.position.y = this.position.y;
		    	Camera.offset.y += vertical_movement;
		    }else{
		    	this.position.y = this.position.y + vertical_movement;
		    }

		    this.dx = bound(this.dx + (dt * this.ddx), -this.max_vx, this.max_vx);
		    this.dy = bound(this.dy + (dt * this.ddy), -this.max_vy, this.max_vy);

		    

		    if ((wasleft  && (this.dx > 0)) ||
		        (wasright && (this.dx < 0))) {
		      	this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
		    }

		    if(vertical_movement > 0){
		    	this.falling = true;
		    }

		    this.checkForCollisions(Map.coliders);
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

	Caveman.onInit(function(){
		window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);
		Caveman.addSprite('items', new Sprite('/assets/sprites/items.png', Screen, 16, 16, 5));
		console.log(Caveman.getSprite('items'));
		Map.generateTiles();
		Map.loadObjects();
	})

	Caveman.onRender(function(){
		Map.drawMap(Camera.offset.x, Camera.offset.y);
		Map.drawCoins(Caveman.getSprite('items'), Camera.offset.x, Camera.offset.y, Caveman.ticks);
		cPlayer.draw();
	})

	Caveman.onUpdate(function(dt){
		cPlayer.update(dt, Keyboard);
	})

	tiles.onload = function(){
		Caveman.init();
	}

}