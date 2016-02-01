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
	var ObjectsTree = new QuadTree(1, [20, 20]);
	var UserInterface = new UI(new Sprite('/assets/sprites/ui.png', Scene, 28, 7), new Vector2d(20, 20));

	var cPlayer = new Player({	position: new Vector2d(2*16, 1*16),
								spawn: new Vector2d(2*16, 1*16),
								sprite: new Sprite('/assets/sprites/player.png', Scene, 16, 16, 3),
								camera: Camera,
								screen: Scene});

	Caveman.onInit(function(){
		window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);
		Caveman.addSprite('items', new Sprite('/assets/sprites/items.png', Scene, 16, 16, 5));
		Map.generateTiles();
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

		Map.drawObjects(Caveman.ticks);

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
		cPlayer.update(dt, Keyboard);
		UserInterface.update(cPlayer);


		Map.json_map.layers[2].objects.map(function(obj, i){
			if(collision = Caveman.checkForCollision(cPlayer, obj)){
				if(obj.type == 'platform'){
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
				}else if(obj.type == 'coin'){
					delete Map.json_map.layers[2].objects[i];
				}else if(obj.type == 'item'){
					delete Map.json_map.layers[2].objects[i];
				}
				else if(obj.type == 'killing'){
					cPlayer.life--;
				}
			}
		})
		//console.log(Scene.canvas.width)
		if(cPlayer.position.x > 224){
			
			if(Math.abs(Camera.offset.x*2)+32 < (((Map.json_map.width*Map.json_map.tilewidth)*2) - Display.canvas.width)){
				Camera.offset.x = -(cPlayer.position.x-224);
			}
			
			UserInterface.position.x = Math.abs(Camera.offset.x)+20;
		}else{
			Camera.offset.x = 0;
			UserInterface.position.x = 20;
		}

		if(cPlayer.position.y > 224){
			console.log((((Map.json_map.height*Map.json_map.tileheight)*2) - Display.canvas.height))
			if(Math.abs(Camera.offset.y*2)+32 < (((Map.json_map.height*Map.json_map.tileheight)*2) - Display.canvas.height)){
				Camera.offset.y = -(cPlayer.position.y-224);
			}
			UserInterface.position.y = Math.abs(Camera.offset.y)+20;
		}else{
			Camera.offset.y = 0;
			UserInterface.position.y = 20;
		}

	})

	tiles.onload = function(){
		Caveman.init();
	}

}