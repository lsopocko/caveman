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

	var cPlayer = new Player({	position: new Vector2d(4*16, 4*16),
								spawn: new Vector2d(4*16, 4*16),
								sprite: new Sprite('/assets/sprites/player.png', Scene, 16, 16, 3),
								camera: Camera,
								screen: Scene});

	Caveman.onInit(function(){
		window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);
		Caveman.addSprite('items', new Sprite('/assets/sprites/items.png', Scene, 16, 16, 5));
		Map.generateTiles();
		Map.loadObjects();
		Scene.resize(Map.json_map.width*Map.json_map.tilewidth, Map.json_map.height*Map.json_map.tilewidth);
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

		Map.drawCoins(	Caveman.getSprite('items'), 
						Caveman.ticks);

		cPlayer.draw();

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

		Map.enemies.map(function(e){
			e.update(dt);
		})

		Caveman.checkForCollisions(cPlayer, Map.coliders, Camera.offset.x, Camera.offset.y);

		if(cPlayer.position.x > 224){
			Camera.offset.x = -(cPlayer.position.x-224);
		}else{
			Camera.offset.x = 0;
		}

		if(cPlayer.position.y > 224){
			Camera.offset.y = -(cPlayer.position.y-224);
		}else{
			Camera.offset.y = 0;
		}
		
	})

	tiles.onload = function(){
		Caveman.init();
	}

}