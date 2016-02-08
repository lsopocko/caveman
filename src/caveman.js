window.onload = function(){

	Camera = {	margin: 100,
				offset: {x: 0, y: 0}}

	tiles = new Image();
	tiles.src = '/assets/sprites/tiles.png';

	var Scene = new DrawingContext();

	var Display = new DrawingContext('screen');

	var Caveman = new Platformer(Scene);
	var Keyboard = new KeyboardEvents();
	var Map = new MapGenerator(json_map, tiles, Scene, Display.canvas);
	var Objects = new QuadTree();
	var UserInterface = new UI(new Sprite('/assets/sprites/ui.png', Scene, 28, 7), new Vector2d(20, 20));

	var cPlayer = new Player({	position: new Vector2d(2*16, -16),
								spawn: new Vector2d(2*16, -16),
								sprite: new Sprite('/assets/sprites/player.png', Scene, 16, 16, 3)});

	Caveman.onInit(function(){
		window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);
		
		Map.generateTiles();
		Map.json_map.layers[2].objects.map(function(object, i){

			if(object.type == 'enemy'){
				Caveman.enemies.push(new Enemy({	position: new Vector2d(object.x, object.y),
													direction: 'right',
													spawn: new Vector2d(object.x, object.y),
													max_vx: 5*6.5,
													sprite: new Sprite('/assets/sprites/enemies.png', Scene, 16, 16, 5),
													id: i}));
			}
			

			if(object.type == 'life'){
				Caveman.items.push(new Life({	position: new Vector2d(object.x, object.y-16),
												sprite: new Sprite('/assets/sprites/items.png', Scene, 16, 16, 1),
												id: i}));
			}

			if(object.type == 'pistol'){
				Caveman.items.push(new Pistol({	position: new Vector2d(object.x, object.y-16),
												sprite: new Sprite('/assets/sprites/items.png', Scene, 16, 16, 1),
												id: i}));
			}

			if(object.type == 'coin'){
				Caveman.coins.push(new Coin({	position: new Vector2d(object.x, object.y-16),
												sprite: new Sprite('/assets/sprites/items.png', Scene, 16, 16, object.properties.ticks_per_frame),
												id: i}));
			}


		});



		//Map.loadObjects();

		Scene.resize((Map.json_map.width*Map.json_map.tilewidth), (Map.json_map.height*Map.json_map.tilewidth));
	})

	Caveman.onRender(function(){
		Scene.context.clearRect(0, 
								0, 
								Scene.canvas.width, 
								Scene.canvas.height);

		Display.context.clearRect(	0, 
									0, 
									Display.canvas.width, 
									Display.canvas.height);

		Map.drawMap(Camera.offset.x, 
					Camera.offset.y);

		//Map.drawObjects(Caveman.ticks);

		Caveman.enemies.map(function(e){
			e.draw()
		})

		Caveman.coins.map(function(c){
			c.draw()
		})

		Caveman.items.map(function(i){
			i.draw()
		})

		Caveman.laserbeams.map(function(l){
			l.draw()
		})

		cPlayer.draw();

		UserInterface.draw();

		Display.context.drawImage(	Scene.canvas, 
									0, 
									0, 
									Scene.canvas.width, 
									Scene.canvas.height, 
									Camera.offset.x-Map.json_map.tilewidth, 
									Camera.offset.y-Map.json_map.tileheight, 
									Scene.canvas.width, 
									Scene.canvas.height);
	})

	Caveman.onUpdate(function(dt){
		Objects.clear();
		cPlayer.update(dt, Keyboard);


		if(cPlayer.shooting && !Caveman.intervals.shooting){
			Caveman.laserbeams.push(new LaserBeam({	position: new Vector2d(cPlayer.position.x+16, cPlayer.position.y),
														sprite: new Sprite('/assets/sprites/items.png', Scene, 16, 16, 3),
														id: i}));
			Caveman.intervals.shooting = setInterval(function(){
				Caveman.laserbeams.push(new LaserBeam({	position: new Vector2d(cPlayer.position.x+16, cPlayer.position.y+8),
														sprite: new Sprite('/assets/sprites/items.png', Scene, 16, 16, 3),
														id: i}));
			}, 500)
		}else if(!cPlayer.shooting && Caveman.intervals.shooting) {
			console.log('clear interval');
			clearInterval(Caveman.intervals.shooting);
			Caveman.intervals.shooting = false;
		}


		Caveman.enemies.map(function(enemy){
			enemy.update(dt);
			Objects.add(enemy);
		})

		Caveman.coins.map(function(coin){
			Objects.add(coin);
		})

		Caveman.items.map(function(item){
			Objects.add(item);
		})

		Caveman.laserbeams.map(function(l){
			l.update(dt);
			Objects.add(l);
		})

		UserInterface.update(cPlayer);

		Map.json_map.layers[2].objects.map(function(obj, i){
			if(obj.type == 'platform' || obj.type == 'waypoint'){
				Objects.add(obj);
			}
		})


		Objects.retrive(cPlayer).map(function(obj, i){
			if(obj.type == 'platform' && (collision = Caveman.checkForCollision(cPlayer, obj))){
				
				if(collision.site == 'top'){
					cPlayer.position.y += collision.offset_top;
					cPlayer.dy = 0;
				}else if(collision.site == 'bottom'){
					cPlayer.position.y -= collision.offset_bottom;
	                cPlayer.dy = 0;
	                cPlayer.falling = false;
	                cPlayer.jumping = false;
				}else if(collision.site == 'left'){
					cPlayer.position.x += collision.offset_left;
	                cPlayer.dx = 0;
				}else if(collision.site == 'right'){
					cPlayer.position.x -= collision.offset_right;
	                cPlayer.dx = 0;
				}
	
			}else if(obj.type == 'enemy' && !cPlayer.dead && Caveman.checkForCollisionPixelPerfect(cPlayer, obj)){
				cPlayer.die();
			}else if(obj.type == 'coin' && Caveman.checkForCollisionPixelPerfect(cPlayer, obj)){
				Caveman.coins = Caveman.coins.filter(function(elem, i){
					return elem.id !== obj.id;
				})
			}else if(obj.type == 'life' && Caveman.checkForCollisionPixelPerfect(cPlayer, obj)){
				console.log('life');
				Caveman.items = Caveman.items.filter(function(elem, i){
					return elem.id !== obj.id;
				})
			}
		})

		Caveman.enemies.map(function(enemy){
			Objects.retrive(enemy).map(function(obj, i){
				if(collision = Caveman.checkForCollision(enemy, obj)){
					if(obj.type == 'platform' || obj.type == 'waypoint'){
						if(collision.site == 'top'){
							enemy.position.y += collision.offset_top;
							enemy.dy = 0;
						}else if(collision.site == 'bottom'){
							enemy.position.y -= collision.offset_bottom;
			                enemy.dy = 0;
			                enemy.falling = false;
			                enemy.jumping = false;
						}else if(collision.site == 'left'){
							enemy.position.x += collision.offset_left;
			                enemy.dx = 0;
			                enemy.direction = 'right';
						}else if(collision.site == 'right'){
							enemy.position.x -= collision.offset_right;
			                enemy.dx = 0;
			                enemy.direction = 'left';
						}
					}
				}
			});
		})


		
		if(cPlayer.position.x > 224){
			
			if(cPlayer.dx > 0 && (Math.abs(Camera.offset.x*2)+32 < (((Map.json_map.width*Map.json_map.tilewidth)*2) - Display.canvas.width))){
				Camera.offset.x = -(cPlayer.position.x-224);
			}else if(cPlayer.dx < 0 && (Math.abs(Camera.offset.x) >= (cPlayer.position.x-224))){
				Camera.offset.x = -(cPlayer.position.x-224);
			}
			
			UserInterface.position.x = Math.abs(Camera.offset.x)+20;
		}else{
			Camera.offset.x = 0;
			UserInterface.position.x = 20;
		}

		if(cPlayer.position.y > 224){
			if(Math.abs(Camera.offset.y*2)+32 < (((Map.json_map.height*Map.json_map.tileheight)*2) - Display.canvas.height)){
				Camera.offset.y = -(cPlayer.position.y-224);
			}
			UserInterface.position.y = Math.abs(Camera.offset.y)+20;
		}else{
			Camera.offset.y = 0;
			UserInterface.position.y = 20;
		}

		if(!cPlayer.dead && (cPlayer.position.x > (Map.json_map.width*Map.json_map.tilewidth)*2 || cPlayer.position.y > (Map.json_map.height*Map.json_map.tileheight)*2)){
			cPlayer.die();
		}
		
	})

	tiles.onload = function(){
		Caveman.init();
	}

}