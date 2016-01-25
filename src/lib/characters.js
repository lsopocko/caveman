class Character{

	constructor(params){

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
		this.ticksPerFrame = params.hasOwnProperty('ticks_per_frame') ? params.ticks_per_frame : 4;
		this.jumping = false;
		this.falling = true;
		this.life = params.hasOwnProperty('life') ? params.life : 6;
		this.spawn = params.hasOwnProperty('spawn') ? params.spawn : {x:0, y:0};
		this.dead = false;
		this.respawn_after = params.hasOwnProperty('respawn_after') ? params.respawn_after : 5*1000;
		this.time_of_dead = null;

	}

	update(dt, events){}

	draw(){
		this.ticks++;
		this.sprite.draw(this.position.x, this.position.y);
	}

	moveLeft(){}

	moveRight(){}

	jump(){}

	die(){}

	stop(){}

}

export class Player extends Character{

	constructor(params){
		super(params);
		this.name = 'Player';
	}

	update(dt, events){

		var wasleft = this.dx < 0,
			wasright = this.dx > 0,
			falling = this.falling,
			friction = this.friction * (falling ? 0.5 : 1),
			acceleration = this.acceleration * (falling ? 0.5 : 1);

		this.ddx = 0;
		this.ddy = gravity;

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
				Game.jumpAudio.play();
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

		    if(((this.position.x*2)) >= Screen.canvas.width-Camera.margin && (Key.isDown(Key.RIGHT) || wasright) && (Camera.offset.x+Screen.canvas.width < (((Game.level.width*Game.level.tilewidth)*2)-Camera.offset.x))){
		    	this.position.x = this.position.x;
		    	Camera.offset.x += horizontal_movement;
		    }else if(((this.position.x*2)) <= Camera.margin && (Key.isDown(Key.LEFT) || wasleft) && Camera.offset.x > 0){
		    	this.position.x = this.position.x;
		    	Camera.offset.x += horizontal_movement;
		    }else{
		    	this.position.x = this.position.x + horizontal_movement;
		    }

		    vertical_movement = Math.round(dt * this.dy);

		    if(((this.position.y*2) >= Screen.canvas.height-Camera.margin && !this.jumping) && (Camera.offset.y+Screen.canvas.height < (((Game.level.height*Game.level.tileheight)*2)-Camera.offset.y))){
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

		    this.checkForCollisions();
		    this.checkForPowerUps();
		    this.checkForCoins();
		    this.checkForEnemies();

		}else{
			this.dx = 0;
			this.dy = 0;
			this.ddx = 0;
			if(timestamp() >= this.timeofdead+this.respawnAfter){
				this.spawn();
			}
		}
	}

	checkForCollisions(){
		player = this;
		Game.coliders.map(function(object){
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

	checkForPowerUps(){
		player = this;
		Game.powerUps.map(function(powerUp){

			if (!powerUp.deleted
				&& (player.position.x+8 > powerUp.x-Camera.offset.x && player.position.x < (powerUp.x+powerUp.height)-Camera.offset.x)
				&& (player.position.y+8 > (powerUp.y-powerUp.height)-Camera.offset.y && player.position.y+16 < (powerUp.y+powerUp.height)-Camera.offset.y)) {
		    	powerUp.deleted = true;
		    	if(powerUp.type == 'life' && player.life < 6){
		    		player.life++;
		    	}
		    	Game.pickAudio.play();
		    }

		});
	};

	checkForCoins(){
		player = this;
		//coin.x-Camera.offset.x, (coin.y-coin.height)-Camera.offset.y
		Game.coins.map(function(coin){
			if (!coin.deleted
				&& (player.position.x+8 > coin.x-Camera.offset.x && player.position.x < (coin.x+coin.height)-Camera.offset.x)
				&& (player.position.y+8 > (coin.y-coin.height)-Camera.offset.y && player.position.y+16 < (coin.y+coin.height)-Camera.offset.y)) {
			    	coin.deleted = true;	
			    	Game.pickAudio.play();
		    }

		});
	};

	checkForEnemies(){
		player = this;
		//coin.x-Camera.offset.x, (coin.y-coin.height)-Camera.offset.y
		// @TODO change to circular colision 
		Game.enemies.map(function(enemy){
			//if ( squared(OB1.x-OB2.x) + squared(OB1.y-OB2.y) < squared(OB1.Radius+OB2.Radius)) return true;
			if (!enemy.deleted
				&& (player.position.x+8 > enemy.x-Camera.offset.x && player.position.x+8 < (enemy.x+enemy.height)-Camera.offset.x)
				&& (player.position.y+16 > (enemy.y)-Camera.offset.y && player.position.y+8 < (enemy.y+enemy.height)-Camera.offset.y)) {
			    	!player.dead && player.die();
		    }

		});
	};

	moveRight(){

		this.sprite.sourceY = 0;
		if(this.ticks > this.ticksPerFrame){
			this.ticks = 0;
			this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
		}
	};

	moveLeft(){

		this.sprite.sourceY = 32;
		if(this.ticks > this.ticksPerFrame){
			this.ticks = 0;
			this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX+16;
		}
	};

	jumpRight(){
		this.sprite.sourceY = 16;
		this.sprite.sourceX = 0;
	};
	jumpLeft(){
		this.sprite.sourceY = 48;
		this.sprite.sourceX = 0;
	};

	die(){
		this.sprite.sourceY = 16;
		this.sprite.sourceX = 48;
		this.life -= 1;
		this.dead = true;
		this.timeofdead = timestamp();			
	};

	spawn(){
		this.dead = false;
		this.sprite.sourceY = 16;
		this.sprite.sourceX = 16;
		this.position.x = this.spawn.x;
		this.position.y = this.spawn.y;
		Camera.offset.x = 0;
		Camera.offset.y = 0;

	};

	stop(){
		this.sprite.sourceY = 16;
		this.sprite.sourceX = 16;
	};
}

export class Enemy extends Character{
	constructor(params){
		super(params);
		this.name = 'Enemy';
	}
}

export class Princess extends Character{
	
	constructor(params){
		super(params);
		this.name = 'Princess';
	}

	update(dt){
		this.wave();
	}

	wave(){
		Game.sprites.princess.sourceY = 0;
		if(!(Game.ticks%Game.sprites.princess.ticksPerFrame)){
			Game.sprites.princess.sourceX = Game.sprites.princess.sourceX == 48 ? 16 : Game.sprites.princess.sourceX+16;
		}
	};
}