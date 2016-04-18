window.Caveman = (function(Caveman, PIXI, _){
    var Renderer = require('./renderer'),
        AnimatedObject = require('./animatedObject'),
        PlayerObject = require('./player'),
        Events = require('./events'),
        KeyboardEvents = require('./keyboardEvents'),
        fps = 60,
        step = 1/fps,
        now, last = timestamp(),
        ticks = 0,
        dt = 0,
        Player,
        Cursor,
        Keyboard;
    

    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    function init(){
        PIXI.loader
        .add('Player', 'assets/player.json')
        .add('Door', 'assets/door.json')
        //.add('Tileset', 'assets/tileset.json')
        .load(create);

        document.addEventListener('mousemove', function(e){
            Cursor = {x: e.pageX, y: e.pageY}; 
        })
    }

    function create(){

        Renderer.init({fullscreen: true});
        Keyboard = new KeyboardEvents(window);

        Door = new AnimatedObject(PIXI.loader.resources['Door'].textures);
        Door.animations.add('open', ['open0', 'open1', 'open2', 'open3', 'open4'], 3);

        Player = new PlayerObject(PIXI.loader.resources["Player"].textures);
        Player.animations.add('walk', ['walk0', 'walk1', 'walk2', 'walk3'], 8);
        Player.animations.add('stop', ['stop'], 10);

        Player.x = 50;
        Player.y = 50;

        Door.x = 200;
        Door.y = 200;

        
        Renderer.addLayer('level', Door);
        Renderer.addLayer('player', Player);

        frame();
    }

    function update(){
        Player.rotation = Math.atan2(Cursor.x- Player.x,- (Cursor.y- Player.y)); 
        var xDistance = Cursor.x - Player.x;
        var yDistance = Cursor.y - Player.y;
        var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        if (Keyboard.isDown(Keyboard.W)) {
            if(distance > 6){
                xDistance = xDistance * 3 / distance;
                yDistance = yDistance * 3 / distance;
            }
            Player.x += xDistance;
            Player.y += yDistance;
            Player.walk();
        }
        Door.animate('open');
    }

    function frame(){
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > step){
            dt = dt - step;
            update(step);
        }
        Renderer.render();
        last = now;
        requestAnimationFrame(frame);
    }

    return {
        init: init
    };


})(window.Caveman || {}, require('./pixi.min'), require('lodash'));

Caveman.init();