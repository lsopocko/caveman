(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var PIXI = require('./pixi.min'),
	AnimationsManager = require('./animationsManager');

function AnimatedObject(textures){
	this.animations = new AnimationsManager();
	this.textures = textures;
	PIXI.Sprite.call(this, textures['stop']);
}

AnimatedObject.prototype = Object.create(PIXI.Sprite.prototype);
AnimatedObject.prototype.constructor = AnimatedObject;

AnimatedObject.prototype.animate = function(animation){
	this.animations.play(animation);
	this.texture = this.textures[this.animations.currentFrame];
}

module.exports = AnimatedObject;
},{"./animationsManager":2,"./pixi.min":6}],2:[function(require,module,exports){
function animationsManager(){
	var animations = [],
		ticks = 0,
		frameIndex = 0;

	this.currentFrame = 'stop';

	this.add = function(name, frames, speed){
		animations[name] = {frames: frames, speed: speed}
	};

	this.remove = function(name, frames, speed){
		animations[name] = {frames: frames, speed: speed}
	};

	this.play = function(name){
		if(!(ticks % animations[name].speed)){
			this.currentFrame = animations[name].frames[frameIndex];

			if(frameIndex == animations[name].frames.length-1){
				frameIndex = 0;
			}else{
				frameIndex++;
			}

			ticks = 0;
		}
		ticks++;
	};

	this.list = function(){
		return animations;
	};
}


module.exports = animationsManager;
},{}],3:[function(require,module,exports){
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

        Door.x = 100;
        Door.y = 100;

        
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
},{"./animatedObject":1,"./events":4,"./keyboardEvents":5,"./pixi.min":6,"./player":7,"./renderer":8,"lodash":9}],4:[function(require,module,exports){
function Events(){

}

module.exports = Events;
},{}],5:[function(require,module,exports){
// Keyboard prototype

function keyboardEvents(window){
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

	var that = this;

	window.addEventListener('keyup', function(event) { that.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { that.onKeydown(event); }, false);
}

keyboardEvents.prototype.isDown = function(keyCode) {
	return this._pressed[keyCode] ? true : false;
}

keyboardEvents.prototype.onKeydown = function(event) {
	this._pressed[event.keyCode] = true;
}

keyboardEvents.prototype.onKeyup =  function(event) {
	delete this._pressed[event.keyCode];
}

module.exports = keyboardEvents;
},{}],6:[function(require,module,exports){
(function (global){
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.PIXI=t()}}(function(){var t;return function e(t,r,i){function n(s,a){if(!r[s]){if(!t[s]){var h="function"==typeof require&&require;if(!a&&h)return h(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=r[s]={exports:{}};t[s][0].call(u.exports,function(e){var r=t[s][1][e];return n(r?r:e)},u,u.exports,e,t,r,i)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(e,r,i){(function(e,i){!function(){function n(){}function o(t){return t}function s(t){return!!t}function a(t){return!t}function h(t){return function(){if(null===t)throw new Error("Callback was already called.");t.apply(this,arguments),t=null}}function l(t){return function(){null!==t&&(t.apply(this,arguments),t=null)}}function u(t){return j(t)||"number"==typeof t.length&&t.length>=0&&t.length%1===0}function c(t,e){for(var r=-1,i=t.length;++r<i;)e(t[r],r,t)}function p(t,e){for(var r=-1,i=t.length,n=Array(i);++r<i;)n[r]=e(t[r],r,t);return n}function d(t){return p(Array(t),function(t,e){return e})}function f(t,e,r){return c(t,function(t,i,n){r=e(r,t,i,n)}),r}function v(t,e){c(Y(t),function(r){e(t[r],r)})}function g(t,e){for(var r=0;r<t.length;r++)if(t[r]===e)return r;return-1}function y(t){var e,r,i=-1;return u(t)?(e=t.length,function(){return i++,e>i?i:null}):(r=Y(t),e=r.length,function(){return i++,e>i?r[i]:null})}function m(t,e){return e=null==e?t.length-1:+e,function(){for(var r=Math.max(arguments.length-e,0),i=Array(r),n=0;r>n;n++)i[n]=arguments[n+e];switch(e){case 0:return t.call(this,i);case 1:return t.call(this,arguments[0],i)}}}function x(t){return function(e,r,i){return t(e,i)}}function b(t){return function(e,r,i){i=l(i||n),e=e||[];var o=y(e);if(0>=t)return i(null);var s=!1,a=0,u=!1;!function c(){if(s&&0>=a)return i(null);for(;t>a&&!u;){var n=o();if(null===n)return s=!0,void(0>=a&&i(null));a+=1,r(e[n],n,h(function(t){a-=1,t?(i(t),u=!0):c()}))}}()}}function _(t){return function(e,r,i){return t(N.eachOf,e,r,i)}}function T(t){return function(e,r,i,n){return t(b(r),e,i,n)}}function E(t){return function(e,r,i){return t(N.eachOfSeries,e,r,i)}}function S(t,e,r,i){i=l(i||n),e=e||[];var o=u(e)?[]:{};t(e,function(t,e,i){r(t,function(t,r){o[e]=r,i(t)})},function(t){i(t,o)})}function w(t,e,r,i){var n=[];t(e,function(t,e,i){r(t,function(r){r&&n.push({index:e,value:t}),i()})},function(){i(p(n.sort(function(t,e){return t.index-e.index}),function(t){return t.value}))})}function A(t,e,r,i){w(t,e,function(t,e){r(t,function(t){e(!t)})},i)}function C(t,e,r){return function(i,n,o,s){function a(){s&&s(r(!1,void 0))}function h(t,i,n){return s?void o(t,function(i){s&&e(i)&&(s(r(!0,t)),s=o=!1),n()}):n()}arguments.length>3?t(i,n,h,a):(s=o,o=n,t(i,h,a))}}function M(t,e){return e}function R(t,e,r){r=r||n;var i=u(e)?[]:{};t(e,function(t,e,r){t(m(function(t,n){n.length<=1&&(n=n[0]),i[e]=n,r(t)}))},function(t){r(t,i)})}function O(t,e,r,i){var n=[];t(e,function(t,e,i){r(t,function(t,e){n=n.concat(e||[]),i(t)})},function(t){i(t,n)})}function P(t,e,r){function i(t,e,r,i){if(null!=i&&"function"!=typeof i)throw new Error("task callback must be a function");return t.started=!0,j(e)||(e=[e]),0===e.length&&t.idle()?N.setImmediate(function(){t.drain()}):(c(e,function(e){var o={data:e,callback:i||n};r?t.tasks.unshift(o):t.tasks.push(o),t.tasks.length===t.concurrency&&t.saturated()}),void N.setImmediate(t.process))}function o(t,e){return function(){s-=1;var r=!1,i=arguments;c(e,function(t){c(a,function(e,i){e!==t||r||(a.splice(i,1),r=!0)}),t.callback.apply(t,i)}),t.tasks.length+s===0&&t.drain(),t.process()}}if(null==e)e=1;else if(0===e)throw new Error("Concurrency must not be zero");var s=0,a=[],l={tasks:[],concurrency:e,payload:r,saturated:n,empty:n,drain:n,started:!1,paused:!1,push:function(t,e){i(l,t,!1,e)},kill:function(){l.drain=n,l.tasks=[]},unshift:function(t,e){i(l,t,!0,e)},process:function(){for(;!l.paused&&s<l.concurrency&&l.tasks.length;){var e=l.payload?l.tasks.splice(0,l.payload):l.tasks.splice(0,l.tasks.length),r=p(e,function(t){return t.data});0===l.tasks.length&&l.empty(),s+=1,a.push(e[0]);var i=h(o(l,e));t(r,i)}},length:function(){return l.tasks.length},running:function(){return s},workersList:function(){return a},idle:function(){return l.tasks.length+s===0},pause:function(){l.paused=!0},resume:function(){if(l.paused!==!1){l.paused=!1;for(var t=Math.min(l.concurrency,l.tasks.length),e=1;t>=e;e++)N.setImmediate(l.process)}}};return l}function F(t){return m(function(e,r){e.apply(null,r.concat([m(function(e,r){"object"==typeof console&&(e?console.error&&console.error(e):console[t]&&c(r,function(e){console[t](e)}))})]))})}function D(t){return function(e,r,i){t(d(e),r,i)}}function B(t){return m(function(e,r){var i=m(function(r){var i=this,n=r.pop();return t(e,function(t,e,n){t.apply(i,r.concat([n]))},n)});return r.length?i.apply(this,r):i})}function L(t){return m(function(e){var r=e.pop();e.push(function(){var t=arguments;i?N.setImmediate(function(){r.apply(null,t)}):r.apply(null,t)});var i=!0;t.apply(this,e),i=!1})}var I,N={},U="object"==typeof self&&self.self===self&&self||"object"==typeof i&&i.global===i&&i||this;null!=U&&(I=U.async),N.noConflict=function(){return U.async=I,N};var k=Object.prototype.toString,j=Array.isArray||function(t){return"[object Array]"===k.call(t)},X=function(t){var e=typeof t;return"function"===e||"object"===e&&!!t},Y=Object.keys||function(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e},G="function"==typeof setImmediate&&setImmediate,W=G?function(t){G(t)}:function(t){setTimeout(t,0)};"object"==typeof e&&"function"==typeof e.nextTick?N.nextTick=e.nextTick:N.nextTick=W,N.setImmediate=G?W:N.nextTick,N.forEach=N.each=function(t,e,r){return N.eachOf(t,x(e),r)},N.forEachSeries=N.eachSeries=function(t,e,r){return N.eachOfSeries(t,x(e),r)},N.forEachLimit=N.eachLimit=function(t,e,r,i){return b(e)(t,x(r),i)},N.forEachOf=N.eachOf=function(t,e,r){function i(t){a--,t?r(t):null===o&&0>=a&&r(null)}r=l(r||n),t=t||[];for(var o,s=y(t),a=0;null!=(o=s());)a+=1,e(t[o],o,h(i));0===a&&r(null)},N.forEachOfSeries=N.eachOfSeries=function(t,e,r){function i(){var n=!0;return null===s?r(null):(e(t[s],s,h(function(t){if(t)r(t);else{if(s=o(),null===s)return r(null);n?N.setImmediate(i):i()}})),void(n=!1))}r=l(r||n),t=t||[];var o=y(t),s=o();i()},N.forEachOfLimit=N.eachOfLimit=function(t,e,r,i){b(e)(t,r,i)},N.map=_(S),N.mapSeries=E(S),N.mapLimit=T(S),N.inject=N.foldl=N.reduce=function(t,e,r,i){N.eachOfSeries(t,function(t,i,n){r(e,t,function(t,r){e=r,n(t)})},function(t){i(t,e)})},N.foldr=N.reduceRight=function(t,e,r,i){var n=p(t,o).reverse();N.reduce(n,e,r,i)},N.transform=function(t,e,r,i){3===arguments.length&&(i=r,r=e,e=j(t)?[]:{}),N.eachOf(t,function(t,i,n){r(e,t,i,n)},function(t){i(t,e)})},N.select=N.filter=_(w),N.selectLimit=N.filterLimit=T(w),N.selectSeries=N.filterSeries=E(w),N.reject=_(A),N.rejectLimit=T(A),N.rejectSeries=E(A),N.any=N.some=C(N.eachOf,s,o),N.someLimit=C(N.eachOfLimit,s,o),N.all=N.every=C(N.eachOf,a,a),N.everyLimit=C(N.eachOfLimit,a,a),N.detect=C(N.eachOf,o,M),N.detectSeries=C(N.eachOfSeries,o,M),N.detectLimit=C(N.eachOfLimit,o,M),N.sortBy=function(t,e,r){function i(t,e){var r=t.criteria,i=e.criteria;return i>r?-1:r>i?1:0}N.map(t,function(t,r){e(t,function(e,i){e?r(e):r(null,{value:t,criteria:i})})},function(t,e){return t?r(t):void r(null,p(e.sort(i),function(t){return t.value}))})},N.auto=function(t,e,r){function i(t){y.unshift(t)}function o(t){var e=g(y,t);e>=0&&y.splice(e,1)}function s(){h--,c(y.slice(0),function(t){t()})}"function"==typeof arguments[1]&&(r=e,e=null),r=l(r||n);var a=Y(t),h=a.length;if(!h)return r(null);e||(e=h);var u={},p=0,d=!1,y=[];i(function(){h||r(null,u)}),c(a,function(n){function a(){return e>p&&f(x,function(t,e){return t&&u.hasOwnProperty(e)},!0)&&!u.hasOwnProperty(n)}function h(){a()&&(p++,o(h),c[c.length-1](y,u))}if(!d){for(var l,c=j(t[n])?t[n]:[t[n]],y=m(function(t,e){if(p--,e.length<=1&&(e=e[0]),t){var i={};v(u,function(t,e){i[e]=t}),i[n]=e,d=!0,r(t,i)}else u[n]=e,N.setImmediate(s)}),x=c.slice(0,c.length-1),b=x.length;b--;){if(!(l=t[x[b]]))throw new Error("Has nonexistent dependency in "+x.join(", "));if(j(l)&&g(l,n)>=0)throw new Error("Has cyclic dependencies")}a()?(p++,c[c.length-1](y,u)):i(h)}})},N.retry=function(t,e,r){function i(t,e){if("number"==typeof e)t.times=parseInt(e,10)||o;else{if("object"!=typeof e)throw new Error("Unsupported argument type for 'times': "+typeof e);t.times=parseInt(e.times,10)||o,t.interval=parseInt(e.interval,10)||s}}function n(t,e){function r(t,r){return function(i){t(function(t,e){i(!t||r,{err:t,result:e})},e)}}function i(t){return function(e){setTimeout(function(){e(null)},t)}}for(;h.times;){var n=!(h.times-=1);a.push(r(h.task,n)),!n&&h.interval>0&&a.push(i(h.interval))}N.series(a,function(e,r){r=r[r.length-1],(t||h.callback)(r.err,r.result)})}var o=5,s=0,a=[],h={times:o,interval:s},l=arguments.length;if(1>l||l>3)throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)");return 2>=l&&"function"==typeof t&&(r=e,e=t),"function"!=typeof t&&i(h,t),h.callback=r,h.task=e,h.callback?n():n},N.waterfall=function(t,e){function r(t){return m(function(i,n){if(i)e.apply(null,[i].concat(n));else{var o=t.next();o?n.push(r(o)):n.push(e),L(t).apply(null,n)}})}if(e=l(e||n),!j(t)){var i=new Error("First argument to waterfall must be an array of functions");return e(i)}return t.length?void r(N.iterator(t))():e()},N.parallel=function(t,e){R(N.eachOf,t,e)},N.parallelLimit=function(t,e,r){R(b(e),t,r)},N.series=function(t,e){R(N.eachOfSeries,t,e)},N.iterator=function(t){function e(r){function i(){return t.length&&t[r].apply(null,arguments),i.next()}return i.next=function(){return r<t.length-1?e(r+1):null},i}return e(0)},N.apply=m(function(t,e){return m(function(r){return t.apply(null,e.concat(r))})}),N.concat=_(O),N.concatSeries=E(O),N.whilst=function(t,e,r){if(r=r||n,t()){var i=m(function(n,o){n?r(n):t.apply(this,o)?e(i):r.apply(null,[null].concat(o))});e(i)}else r(null)},N.doWhilst=function(t,e,r){var i=0;return N.whilst(function(){return++i<=1||e.apply(this,arguments)},t,r)},N.until=function(t,e,r){return N.whilst(function(){return!t.apply(this,arguments)},e,r)},N.doUntil=function(t,e,r){return N.doWhilst(t,function(){return!e.apply(this,arguments)},r)},N.during=function(t,e,r){r=r||n;var i=m(function(e,i){e?r(e):(i.push(o),t.apply(this,i))}),o=function(t,n){t?r(t):n?e(i):r(null)};t(o)},N.doDuring=function(t,e,r){var i=0;N.during(function(t){i++<1?t(null,!0):e.apply(this,arguments)},t,r)},N.queue=function(t,e){var r=P(function(e,r){t(e[0],r)},e,1);return r},N.priorityQueue=function(t,e){function r(t,e){return t.priority-e.priority}function i(t,e,r){for(var i=-1,n=t.length-1;n>i;){var o=i+(n-i+1>>>1);r(e,t[o])>=0?i=o:n=o-1}return i}function o(t,e,o,s){if(null!=s&&"function"!=typeof s)throw new Error("task callback must be a function");return t.started=!0,j(e)||(e=[e]),0===e.length?N.setImmediate(function(){t.drain()}):void c(e,function(e){var a={data:e,priority:o,callback:"function"==typeof s?s:n};t.tasks.splice(i(t.tasks,a,r)+1,0,a),t.tasks.length===t.concurrency&&t.saturated(),N.setImmediate(t.process)})}var s=N.queue(t,e);return s.push=function(t,e,r){o(s,t,e,r)},delete s.unshift,s},N.cargo=function(t,e){return P(t,1,e)},N.log=F("log"),N.dir=F("dir"),N.memoize=function(t,e){var r={},i={},n=Object.prototype.hasOwnProperty;e=e||o;var s=m(function(o){var s=o.pop(),a=e.apply(null,o);n.call(r,a)?N.setImmediate(function(){s.apply(null,r[a])}):n.call(i,a)?i[a].push(s):(i[a]=[s],t.apply(null,o.concat([m(function(t){r[a]=t;var e=i[a];delete i[a];for(var n=0,o=e.length;o>n;n++)e[n].apply(null,t)})])))});return s.memo=r,s.unmemoized=t,s},N.unmemoize=function(t){return function(){return(t.unmemoized||t).apply(null,arguments)}},N.times=D(N.map),N.timesSeries=D(N.mapSeries),N.timesLimit=function(t,e,r,i){return N.mapLimit(d(t),e,r,i)},N.seq=function(){var t=arguments;return m(function(e){var r=this,i=e[e.length-1];"function"==typeof i?e.pop():i=n,N.reduce(t,e,function(t,e,i){e.apply(r,t.concat([m(function(t,e){i(t,e)})]))},function(t,e){i.apply(r,[t].concat(e))})})},N.compose=function(){return N.seq.apply(null,Array.prototype.reverse.call(arguments))},N.applyEach=B(N.eachOf),N.applyEachSeries=B(N.eachOfSeries),N.forever=function(t,e){function r(t){return t?i(t):void o(r)}var i=h(e||n),o=L(t);r()},N.ensureAsync=L,N.constant=m(function(t){var e=[null].concat(t);return function(t){return t.apply(this,e)}}),N.wrapSync=N.asyncify=function(t){return m(function(e){var r,i=e.pop();try{r=t.apply(this,e)}catch(n){return i(n)}X(r)&&"function"==typeof r.then?r.then(function(t){i(null,t)})["catch"](function(t){i(t.message?t:new Error(t))}):i(null,r)})},"object"==typeof r&&r.exports?r.exports=N:"function"==typeof t&&t.amd?t([],function(){return N}):U.async=N}()}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:3}],2:[function(t,e,r){(function(t){function e(t,e){for(var r=0,i=t.length-1;i>=0;i--){var n=t[i];"."===n?t.splice(i,1):".."===n?(t.splice(i,1),r++):r&&(t.splice(i,1),r--)}if(e)for(;r--;r)t.unshift("..");return t}function i(t,e){if(t.filter)return t.filter(e);for(var r=[],i=0;i<t.length;i++)e(t[i],i,t)&&r.push(t[i]);return r}var n=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,o=function(t){return n.exec(t).slice(1)};r.resolve=function(){for(var r="",n=!1,o=arguments.length-1;o>=-1&&!n;o--){var s=o>=0?arguments[o]:t.cwd();if("string"!=typeof s)throw new TypeError("Arguments to path.resolve must be strings");s&&(r=s+"/"+r,n="/"===s.charAt(0))}return r=e(i(r.split("/"),function(t){return!!t}),!n).join("/"),(n?"/":"")+r||"."},r.normalize=function(t){var n=r.isAbsolute(t),o="/"===s(t,-1);return t=e(i(t.split("/"),function(t){return!!t}),!n).join("/"),t||n||(t="."),t&&o&&(t+="/"),(n?"/":"")+t},r.isAbsolute=function(t){return"/"===t.charAt(0)},r.join=function(){var t=Array.prototype.slice.call(arguments,0);return r.normalize(i(t,function(t,e){if("string"!=typeof t)throw new TypeError("Arguments to path.join must be strings");return t}).join("/"))},r.relative=function(t,e){function i(t){for(var e=0;e<t.length&&""===t[e];e++);for(var r=t.length-1;r>=0&&""===t[r];r--);return e>r?[]:t.slice(e,r-e+1)}t=r.resolve(t).substr(1),e=r.resolve(e).substr(1);for(var n=i(t.split("/")),o=i(e.split("/")),s=Math.min(n.length,o.length),a=s,h=0;s>h;h++)if(n[h]!==o[h]){a=h;break}for(var l=[],h=a;h<n.length;h++)l.push("..");return l=l.concat(o.slice(a)),l.join("/")},r.sep="/",r.delimiter=":",r.dirname=function(t){var e=o(t),r=e[0],i=e[1];return r||i?(i&&(i=i.substr(0,i.length-1)),r+i):"."},r.basename=function(t,e){var r=o(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},r.extname=function(t){return o(t)[3]};var s="b"==="ab".substr(-1)?function(t,e,r){return t.substr(e,r)}:function(t,e,r){return 0>e&&(e=t.length+e),t.substr(e,r)}}).call(this,t("_process"))},{_process:3}],3:[function(t,e,r){function i(){u=!1,a.length?l=a.concat(l):c=-1,l.length&&n()}function n(){if(!u){var t=setTimeout(i);u=!0;for(var e=l.length;e;){for(a=l,l=[];++c<e;)a&&a[c].run();c=-1,e=l.length}a=null,u=!1,clearTimeout(t)}}function o(t,e){this.fun=t,this.array=e}function s(){}var a,h=e.exports={},l=[],u=!1,c=-1;h.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];l.push(new o(t,e)),1!==l.length||u||setTimeout(n,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=s,h.addListener=s,h.once=s,h.off=s,h.removeListener=s,h.removeAllListeners=s,h.emit=s,h.binding=function(t){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(t){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},{}],4:[function(e,r,i){(function(e){!function(n){function o(t){throw new RangeError(B[t])}function s(t,e){for(var r=t.length,i=[];r--;)i[r]=e(t[r]);return i}function a(t,e){var r=t.split("@"),i="";r.length>1&&(i=r[0]+"@",t=r[1]),t=t.replace(D,".");var n=t.split("."),o=s(n,e).join(".");return i+o}function h(t){for(var e,r,i=[],n=0,o=t.length;o>n;)e=t.charCodeAt(n++),e>=55296&&56319>=e&&o>n?(r=t.charCodeAt(n++),56320==(64512&r)?i.push(((1023&e)<<10)+(1023&r)+65536):(i.push(e),n--)):i.push(e);return i}function l(t){return s(t,function(t){var e="";return t>65535&&(t-=65536,e+=N(t>>>10&1023|55296),t=56320|1023&t),e+=N(t)}).join("")}function u(t){return 10>t-48?t-22:26>t-65?t-65:26>t-97?t-97:E}function c(t,e){return t+22+75*(26>t)-((0!=e)<<5)}function p(t,e,r){var i=0;for(t=r?I(t/C):t>>1,t+=I(t/e);t>L*w>>1;i+=E)t=I(t/L);return I(i+(L+1)*t/(t+A))}function d(t){var e,r,i,n,s,a,h,c,d,f,v=[],g=t.length,y=0,m=R,x=M;for(r=t.lastIndexOf(O),0>r&&(r=0),i=0;r>i;++i)t.charCodeAt(i)>=128&&o("not-basic"),v.push(t.charCodeAt(i));for(n=r>0?r+1:0;g>n;){for(s=y,a=1,h=E;n>=g&&o("invalid-input"),c=u(t.charCodeAt(n++)),(c>=E||c>I((T-y)/a))&&o("overflow"),y+=c*a,d=x>=h?S:h>=x+w?w:h-x,!(d>c);h+=E)f=E-d,a>I(T/f)&&o("overflow"),a*=f;e=v.length+1,x=p(y-s,e,0==s),I(y/e)>T-m&&o("overflow"),m+=I(y/e),y%=e,v.splice(y++,0,m)}return l(v)}function f(t){var e,r,i,n,s,a,l,u,d,f,v,g,y,m,x,b=[];for(t=h(t),g=t.length,e=R,r=0,s=M,a=0;g>a;++a)v=t[a],128>v&&b.push(N(v));for(i=n=b.length,n&&b.push(O);g>i;){for(l=T,a=0;g>a;++a)v=t[a],v>=e&&l>v&&(l=v);for(y=i+1,l-e>I((T-r)/y)&&o("overflow"),r+=(l-e)*y,e=l,a=0;g>a;++a)if(v=t[a],e>v&&++r>T&&o("overflow"),v==e){for(u=r,d=E;f=s>=d?S:d>=s+w?w:d-s,!(f>u);d+=E)x=u-f,m=E-f,b.push(N(c(f+x%m,0))),u=I(x/m);b.push(N(c(u,0))),s=p(r,y,i==n),r=0,++i}++r,++e}return b.join("")}function v(t){return a(t,function(t){return P.test(t)?d(t.slice(4).toLowerCase()):t})}function g(t){return a(t,function(t){return F.test(t)?"xn--"+f(t):t})}var y="object"==typeof i&&i&&!i.nodeType&&i,m="object"==typeof r&&r&&!r.nodeType&&r,x="object"==typeof e&&e;x.global!==x&&x.window!==x&&x.self!==x||(n=x);var b,_,T=2147483647,E=36,S=1,w=26,A=38,C=700,M=72,R=128,O="-",P=/^xn--/,F=/[^\x20-\x7E]/,D=/[\x2E\u3002\uFF0E\uFF61]/g,B={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},L=E-S,I=Math.floor,N=String.fromCharCode;if(b={version:"1.3.2",ucs2:{decode:h,encode:l},decode:d,encode:f,toASCII:g,toUnicode:v},"function"==typeof t&&"object"==typeof t.amd&&t.amd)t("punycode",function(){return b});else if(y&&m)if(r.exports==y)m.exports=b;else for(_ in b)b.hasOwnProperty(_)&&(y[_]=b[_]);else n.punycode=b}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(t,e,r){"use strict";function i(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.exports=function(t,e,r,o){e=e||"&",r=r||"=";var s={};if("string"!=typeof t||0===t.length)return s;var a=/\+/g;t=t.split(e);var h=1e3;o&&"number"==typeof o.maxKeys&&(h=o.maxKeys);var l=t.length;h>0&&l>h&&(l=h);for(var u=0;l>u;++u){var c,p,d,f,v=t[u].replace(a,"%20"),g=v.indexOf(r);g>=0?(c=v.substr(0,g),p=v.substr(g+1)):(c=v,p=""),d=decodeURIComponent(c),f=decodeURIComponent(p),i(s,d)?n(s[d])?s[d].push(f):s[d]=[s[d],f]:s[d]=f}return s};var n=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},{}],6:[function(t,e,r){"use strict";function i(t,e){if(t.map)return t.map(e);for(var r=[],i=0;i<t.length;i++)r.push(e(t[i],i));return r}var n=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};e.exports=function(t,e,r,a){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?i(s(t),function(s){var a=encodeURIComponent(n(s))+r;return o(t[s])?i(t[s],function(t){return a+encodeURIComponent(n(t))}).join(e):a+encodeURIComponent(n(t[s]))}).join(e):a?encodeURIComponent(n(a))+r+encodeURIComponent(n(t)):""};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},s=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},{}],7:[function(t,e,r){"use strict";r.decode=r.parse=t("./decode"),r.encode=r.stringify=t("./encode")},{"./decode":5,"./encode":6}],8:[function(t,e,r){function i(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function n(t,e,r){if(t&&l(t)&&t instanceof i)return t;var n=new i;return n.parse(t,e,r),n}function o(t){return h(t)&&(t=n(t)),t instanceof i?t.format():i.prototype.format.call(t)}function s(t,e){return n(t,!1,!0).resolve(e)}function a(t,e){return t?n(t,!1,!0).resolveObject(e):e}function h(t){return"string"==typeof t}function l(t){return"object"==typeof t&&null!==t}function u(t){return null===t}function c(t){return null==t}var p=t("punycode");r.parse=n,r.resolve=s,r.resolveObject=a,r.format=o,r.Url=i;var d=/^([a-z0-9.+-]+:)/i,f=/:[0-9]*$/,v=["<",">",'"',"`"," ","\r","\n","	"],g=["{","}","|","\\","^","`"].concat(v),y=["'"].concat(g),m=["%","/","?",";","#"].concat(y),x=["/","?","#"],b=255,_=/^[a-z0-9A-Z_-]{0,63}$/,T=/^([a-z0-9A-Z_-]{0,63})(.*)$/,E={javascript:!0,"javascript:":!0},S={javascript:!0,"javascript:":!0},w={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},A=t("querystring");i.prototype.parse=function(t,e,r){if(!h(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var i=t;i=i.trim();var n=d.exec(i);if(n){n=n[0];var o=n.toLowerCase();this.protocol=o,i=i.substr(n.length)}if(r||n||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var s="//"===i.substr(0,2);!s||n&&S[n]||(i=i.substr(2),this.slashes=!0)}if(!S[n]&&(s||n&&!w[n])){for(var a=-1,l=0;l<x.length;l++){var u=i.indexOf(x[l]);-1!==u&&(-1===a||a>u)&&(a=u)}var c,f;f=-1===a?i.lastIndexOf("@"):i.lastIndexOf("@",a),-1!==f&&(c=i.slice(0,f),i=i.slice(f+1),this.auth=decodeURIComponent(c)),a=-1;for(var l=0;l<m.length;l++){var u=i.indexOf(m[l]);-1!==u&&(-1===a||a>u)&&(a=u)}-1===a&&(a=i.length),this.host=i.slice(0,a),i=i.slice(a),this.parseHost(),this.hostname=this.hostname||"";var v="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!v)for(var g=this.hostname.split(/\./),l=0,C=g.length;C>l;l++){var M=g[l];if(M&&!M.match(_)){for(var R="",O=0,P=M.length;P>O;O++)R+=M.charCodeAt(O)>127?"x":M[O];if(!R.match(_)){var F=g.slice(0,l),D=g.slice(l+1),B=M.match(T);B&&(F.push(B[1]),D.unshift(B[2])),D.length&&(i="/"+D.join(".")+i),this.hostname=F.join(".");break}}}if(this.hostname.length>b?this.hostname="":this.hostname=this.hostname.toLowerCase(),!v){for(var L=this.hostname.split("."),I=[],l=0;l<L.length;++l){var N=L[l];I.push(N.match(/[^A-Za-z0-9_-]/)?"xn--"+p.encode(N):N)}this.hostname=I.join(".")}var U=this.port?":"+this.port:"",k=this.hostname||"";this.host=k+U,this.href+=this.host,v&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!E[o])for(var l=0,C=y.length;C>l;l++){var j=y[l],X=encodeURIComponent(j);X===j&&(X=escape(j)),i=i.split(j).join(X)}var Y=i.indexOf("#");-1!==Y&&(this.hash=i.substr(Y),i=i.slice(0,Y));var G=i.indexOf("?");if(-1!==G?(this.search=i.substr(G),this.query=i.substr(G+1),e&&(this.query=A.parse(this.query)),i=i.slice(0,G)):e&&(this.search="",this.query={}),i&&(this.pathname=i),w[o]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var U=this.pathname||"",N=this.search||"";this.path=U+N}return this.href=this.format(),this},i.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var e=this.protocol||"",r=this.pathname||"",i=this.hash||"",n=!1,o="";this.host?n=t+this.host:this.hostname&&(n=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(n+=":"+this.port)),this.query&&l(this.query)&&Object.keys(this.query).length&&(o=A.stringify(this.query));var s=this.search||o&&"?"+o||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||w[e])&&n!==!1?(n="//"+(n||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):n||(n=""),i&&"#"!==i.charAt(0)&&(i="#"+i),s&&"?"!==s.charAt(0)&&(s="?"+s),r=r.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),s=s.replace("#","%23"),e+n+r+s+i},i.prototype.resolve=function(t){return this.resolveObject(n(t,!1,!0)).format()},i.prototype.resolveObject=function(t){if(h(t)){var e=new i;e.parse(t,!1,!0),t=e}var r=new i;if(Object.keys(this).forEach(function(t){r[t]=this[t]},this),r.hash=t.hash,""===t.href)return r.href=r.format(),r;if(t.slashes&&!t.protocol)return Object.keys(t).forEach(function(e){"protocol"!==e&&(r[e]=t[e])}),w[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r;if(t.protocol&&t.protocol!==r.protocol){if(!w[t.protocol])return Object.keys(t).forEach(function(e){r[e]=t[e]}),r.href=r.format(),r;if(r.protocol=t.protocol,t.host||S[t.protocol])r.pathname=t.pathname;else{for(var n=(t.pathname||"").split("/");n.length&&!(t.host=n.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==n[0]&&n.unshift(""),n.length<2&&n.unshift(""),r.pathname=n.join("/")}if(r.search=t.search,r.query=t.query,r.host=t.host||"",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var o=r.pathname||"",s=r.search||"";r.path=o+s}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var a=r.pathname&&"/"===r.pathname.charAt(0),l=t.host||t.pathname&&"/"===t.pathname.charAt(0),p=l||a||r.host&&t.pathname,d=p,f=r.pathname&&r.pathname.split("/")||[],n=t.pathname&&t.pathname.split("/")||[],v=r.protocol&&!w[r.protocol];if(v&&(r.hostname="",r.port=null,r.host&&(""===f[0]?f[0]=r.host:f.unshift(r.host)),r.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===n[0]?n[0]=t.host:n.unshift(t.host)),t.host=null),p=p&&(""===n[0]||""===f[0])),l)r.host=t.host||""===t.host?t.host:r.host,r.hostname=t.hostname||""===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,f=n;else if(n.length)f||(f=[]),f.pop(),f=f.concat(n),r.search=t.search,r.query=t.query;else if(!c(t.search)){if(v){r.hostname=r.host=f.shift();var g=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1;g&&(r.auth=g.shift(),r.host=r.hostname=g.shift())}return r.search=t.search,r.query=t.query,u(r.pathname)&&u(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!f.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var y=f.slice(-1)[0],m=(r.host||t.host)&&("."===y||".."===y)||""===y,x=0,b=f.length;b>=0;b--)y=f[b],"."==y?f.splice(b,1):".."===y?(f.splice(b,1),x++):x&&(f.splice(b,1),x--);if(!p&&!d)for(;x--;x)f.unshift("..");!p||""===f[0]||f[0]&&"/"===f[0].charAt(0)||f.unshift(""),m&&"/"!==f.join("/").substr(-1)&&f.push("");var _=""===f[0]||f[0]&&"/"===f[0].charAt(0);if(v){r.hostname=r.host=_?"":f.length?f.shift():"";var g=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1;g&&(r.auth=g.shift(),r.host=r.hostname=g.shift())}return p=p||r.host&&f.length,p&&!_&&f.unshift(""),f.length?r.pathname=f.join("/"):(r.pathname=null,r.path=null),u(r.pathname)&&u(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},i.prototype.parseHost=function(){var t=this.host,e=f.exec(t);e&&(e=e[0],":"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},{punycode:4,querystring:7}],9:[function(t,e,r){"use strict";function i(t,e,r){r=r||2;var i=e&&e.length,o=i?e[0]*r:t.length,a=n(t,0,o,r,!0),h=[];if(!a)return h;var l,u,p,d,f,v,g;if(i&&(a=c(t,e,a,r)),t.length>80*r){l=p=t[0],u=d=t[1];for(var y=r;o>y;y+=r)f=t[y],v=t[y+1],l>f&&(l=f),u>v&&(u=v),f>p&&(p=f),v>d&&(d=v);g=Math.max(p-l,d-u)}return s(a,h,r,l,u,g),h}function n(t,e,r,i,n){var o,s,a,h=0;for(o=e,s=r-i;r>o;o+=i)h+=(t[s]-t[o])*(t[o+1]+t[s+1]),s=o;if(n===h>0)for(o=e;r>o;o+=i)a=M(o,t[o],t[o+1],a);else for(o=r-i;o>=e;o-=i)a=M(o,t[o],t[o+1],a);return a}function o(t,e){if(!t)return t;e||(e=t);var r,i=t;do if(r=!1,i.steiner||!T(i,i.next)&&0!==_(i.prev,i,i.next))i=i.next;else{if(R(i),i=e=i.prev,i===i.next)return null;r=!0}while(r||i!==e);return e}function s(t,e,r,i,n,c,p){if(t){!p&&c&&v(t,i,n,c);for(var d,f,g=t;t.prev!==t.next;)if(d=t.prev,f=t.next,c?h(t,i,n,c):a(t))e.push(d.i/r),e.push(t.i/r),e.push(f.i/r),R(t),t=f.next,g=f.next;else if(t=f,t===g){p?1===p?(t=l(t,e,r),s(t,e,r,i,n,c,2)):2===p&&u(t,e,r,i,n,c):s(o(t),e,r,i,n,c,1);break}}}function a(t){var e=t.prev,r=t,i=t.next;if(_(e,r,i)>=0)return!1;for(var n=t.next.next;n!==t.prev;){if(x(e.x,e.y,r.x,r.y,i.x,i.y,n.x,n.y)&&_(n.prev,n,n.next)>=0)return!1;n=n.next}return!0}function h(t,e,r,i){var n=t.prev,o=t,s=t.next;if(_(n,o,s)>=0)return!1;for(var a=n.x<o.x?n.x<s.x?n.x:s.x:o.x<s.x?o.x:s.x,h=n.y<o.y?n.y<s.y?n.y:s.y:o.y<s.y?o.y:s.y,l=n.x>o.x?n.x>s.x?n.x:s.x:o.x>s.x?o.x:s.x,u=n.y>o.y?n.y>s.y?n.y:s.y:o.y>s.y?o.y:s.y,c=y(a,h,e,r,i),p=y(l,u,e,r,i),d=t.nextZ;d&&d.z<=p;){if(d!==t.prev&&d!==t.next&&x(n.x,n.y,o.x,o.y,s.x,s.y,d.x,d.y)&&_(d.prev,d,d.next)>=0)return!1;d=d.nextZ}for(d=t.prevZ;d&&d.z>=c;){if(d!==t.prev&&d!==t.next&&x(n.x,n.y,o.x,o.y,s.x,s.y,d.x,d.y)&&_(d.prev,d,d.next)>=0)return!1;d=d.prevZ}return!0}function l(t,e,r){var i=t;do{var n=i.prev,o=i.next.next;E(n,i,i.next,o)&&w(n,o)&&w(o,n)&&(e.push(n.i/r),e.push(i.i/r),e.push(o.i/r),R(i),R(i.next),i=t=o),i=i.next}while(i!==t);return i}function u(t,e,r,i,n,a){var h=t;do{for(var l=h.next.next;l!==h.prev;){if(h.i!==l.i&&b(h,l)){var u=C(h,l);return h=o(h,h.next),u=o(u,u.next),s(h,e,r,i,n,a),void s(u,e,r,i,n,a)}l=l.next}h=h.next}while(h!==t)}function c(t,e,r,i){var s,a,h,l,u,c=[];for(s=0,a=e.length;a>s;s++)h=e[s]*i,l=a-1>s?e[s+1]*i:t.length,u=n(t,h,l,i,!1),u===u.next&&(u.steiner=!0),c.push(m(u));for(c.sort(p),s=0;s<c.length;s++)d(c[s],r),r=o(r,r.next);return r}function p(t,e){return t.x-e.x}function d(t,e){if(e=f(t,e)){var r=C(e,t);o(r,r.next)}}function f(t,e){var r,i=e,n=t.x,o=t.y,s=-(1/0);do{if(o<=i.y&&o>=i.next.y){var a=i.x+(o-i.y)*(i.next.x-i.x)/(i.next.y-i.y);n>=a&&a>s&&(s=a,r=i.x<i.next.x?i:i.next)}i=i.next}while(i!==e);if(!r)return null;if(t.x===r.x)return r.prev;var h,l=r,u=1/0;for(i=r.next;i!==l;)n>=i.x&&i.x>=r.x&&x(o<r.y?n:s,o,r.x,r.y,o<r.y?s:n,o,i.x,i.y)&&(h=Math.abs(o-i.y)/(n-i.x),(u>h||h===u&&i.x>r.x)&&w(i,t)&&(r=i,u=h)),i=i.next;return r}function v(t,e,r,i){var n=t;do null===n.z&&(n.z=y(n.x,n.y,e,r,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==t);n.prevZ.nextZ=null,n.prevZ=null,g(n)}function g(t){var e,r,i,n,o,s,a,h,l=1;do{for(r=t,t=null,o=null,s=0;r;){for(s++,i=r,a=0,e=0;l>e&&(a++,i=i.nextZ,i);e++);for(h=l;a>0||h>0&&i;)0===a?(n=i,i=i.nextZ,h--):0!==h&&i?r.z<=i.z?(n=r,r=r.nextZ,a--):(n=i,i=i.nextZ,h--):(n=r,r=r.nextZ,a--),o?o.nextZ=n:t=n,n.prevZ=o,o=n;r=i}o.nextZ=null,l*=2}while(s>1);return t}function y(t,e,r,i,n){return t=32767*(t-r)/n,e=32767*(e-i)/n,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),e=16711935&(e|e<<8),e=252645135&(e|e<<4),e=858993459&(e|e<<2),e=1431655765&(e|e<<1),t|e<<1}function m(t){var e=t,r=t;do e.x<r.x&&(r=e),e=e.next;while(e!==t);return r}function x(t,e,r,i,n,o,s,a){return(n-s)*(e-a)-(t-s)*(o-a)>=0&&(t-s)*(i-a)-(r-s)*(e-a)>=0&&(r-s)*(o-a)-(n-s)*(i-a)>=0}function b(t,e){return T(t,e)||t.next.i!==e.i&&t.prev.i!==e.i&&!S(t,e)&&w(t,e)&&w(e,t)&&A(t,e)}function _(t,e,r){return(e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function T(t,e){return t.x===e.x&&t.y===e.y}function E(t,e,r,i){return _(t,e,r)>0!=_(t,e,i)>0&&_(r,i,t)>0!=_(r,i,e)>0}function S(t,e){var r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==e.i&&r.next.i!==e.i&&E(r,r.next,t,e))return!0;
r=r.next}while(r!==t);return!1}function w(t,e){return _(t.prev,t,t.next)<0?_(t,e,t.next)>=0&&_(t,t.prev,e)>=0:_(t,e,t.prev)<0||_(t,t.next,e)<0}function A(t,e){var r=t,i=!1,n=(t.x+e.x)/2,o=(t.y+e.y)/2;do r.y>o!=r.next.y>o&&n<(r.next.x-r.x)*(o-r.y)/(r.next.y-r.y)+r.x&&(i=!i),r=r.next;while(r!==t);return i}function C(t,e){var r=new O(t.i,t.x,t.y),i=new O(e.i,e.x,e.y),n=t.next,o=e.prev;return t.next=e,e.prev=t,r.next=n,n.prev=r,i.next=r,r.prev=i,o.next=i,i.prev=o,i}function M(t,e,r,i){var n=new O(t,e,r);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function R(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function O(t,e,r){this.i=t,this.x=e,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}e.exports=i},{}],10:[function(t,e,r){"use strict";function i(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function n(){}var o="function"!=typeof Object.create?"~":!1;n.prototype._events=void 0,n.prototype.listeners=function(t,e){var r=o?o+t:t,i=this._events&&this._events[r];if(e)return!!i;if(!i)return[];if(i.fn)return[i.fn];for(var n=0,s=i.length,a=new Array(s);s>n;n++)a[n]=i[n].fn;return a},n.prototype.emit=function(t,e,r,i,n,s){var a=o?o+t:t;if(!this._events||!this._events[a])return!1;var h,l,u=this._events[a],c=arguments.length;if("function"==typeof u.fn){switch(u.once&&this.removeListener(t,u.fn,void 0,!0),c){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,e),!0;case 3:return u.fn.call(u.context,e,r),!0;case 4:return u.fn.call(u.context,e,r,i),!0;case 5:return u.fn.call(u.context,e,r,i,n),!0;case 6:return u.fn.call(u.context,e,r,i,n,s),!0}for(l=1,h=new Array(c-1);c>l;l++)h[l-1]=arguments[l];u.fn.apply(u.context,h)}else{var p,d=u.length;for(l=0;d>l;l++)switch(u[l].once&&this.removeListener(t,u[l].fn,void 0,!0),c){case 1:u[l].fn.call(u[l].context);break;case 2:u[l].fn.call(u[l].context,e);break;case 3:u[l].fn.call(u[l].context,e,r);break;default:if(!h)for(p=1,h=new Array(c-1);c>p;p++)h[p-1]=arguments[p];u[l].fn.apply(u[l].context,h)}}return!0},n.prototype.on=function(t,e,r){var n=new i(e,r||this),s=o?o+t:t;return this._events||(this._events=o?{}:Object.create(null)),this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],n]:this._events[s].push(n):this._events[s]=n,this},n.prototype.once=function(t,e,r){var n=new i(e,r||this,!0),s=o?o+t:t;return this._events||(this._events=o?{}:Object.create(null)),this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],n]:this._events[s].push(n):this._events[s]=n,this},n.prototype.removeListener=function(t,e,r,i){var n=o?o+t:t;if(!this._events||!this._events[n])return this;var s=this._events[n],a=[];if(e)if(s.fn)(s.fn!==e||i&&!s.once||r&&s.context!==r)&&a.push(s);else for(var h=0,l=s.length;l>h;h++)(s[h].fn!==e||i&&!s[h].once||r&&s[h].context!==r)&&a.push(s[h]);return a.length?this._events[n]=1===a.length?a[0]:a:delete this._events[n],this},n.prototype.removeAllListeners=function(t){return this._events?(t?delete this._events[o?o+t:t]:this._events=o?{}:Object.create(null),this):this},n.prototype.off=n.prototype.removeListener,n.prototype.addListener=n.prototype.on,n.prototype.setMaxListeners=function(){return this},n.prefixed=o,"undefined"!=typeof e&&(e.exports=n)},{}],11:[function(t,e,r){"use strict";function i(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var n=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable;e.exports=Object.assign||function(t,e){for(var r,s,a=i(t),h=1;h<arguments.length;h++){r=Object(arguments[h]);for(var l in r)n.call(r,l)&&(a[l]=r[l]);if(Object.getOwnPropertySymbols){s=Object.getOwnPropertySymbols(r);for(var u=0;u<s.length;u++)o.call(r,s[u])&&(a[s[u]]=r[s[u]])}}return a}},{}],12:[function(e,r,i){(function(e){!function(){function i(t){var e=!1;return function(){if(e)throw new Error("Callback was already called.");e=!0,t.apply(n,arguments)}}var n,o,s={};n=this,null!=n&&(o=n.async),s.noConflict=function(){return n.async=o,s};var a=Object.prototype.toString,h=Array.isArray||function(t){return"[object Array]"===a.call(t)},l=function(t,e){for(var r=0;r<t.length;r+=1)e(t[r],r,t)},u=function(t,e){if(t.map)return t.map(e);var r=[];return l(t,function(t,i,n){r.push(e(t,i,n))}),r},c=function(t,e,r){return t.reduce?t.reduce(e,r):(l(t,function(t,i,n){r=e(r,t,i,n)}),r)},p=function(t){if(Object.keys)return Object.keys(t);var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e};"undefined"!=typeof e&&e.nextTick?(s.nextTick=e.nextTick,"undefined"!=typeof setImmediate?s.setImmediate=function(t){setImmediate(t)}:s.setImmediate=s.nextTick):"function"==typeof setImmediate?(s.nextTick=function(t){setImmediate(t)},s.setImmediate=s.nextTick):(s.nextTick=function(t){setTimeout(t,0)},s.setImmediate=s.nextTick),s.each=function(t,e,r){function n(e){e?(r(e),r=function(){}):(o+=1,o>=t.length&&r())}if(r=r||function(){},!t.length)return r();var o=0;l(t,function(t){e(t,i(n))})},s.forEach=s.each,s.eachSeries=function(t,e,r){if(r=r||function(){},!t.length)return r();var i=0,n=function(){e(t[i],function(e){e?(r(e),r=function(){}):(i+=1,i>=t.length?r():n())})};n()},s.forEachSeries=s.eachSeries,s.eachLimit=function(t,e,r,i){var n=d(e);n.apply(null,[t,r,i])},s.forEachLimit=s.eachLimit;var d=function(t){return function(e,r,i){if(i=i||function(){},!e.length||0>=t)return i();var n=0,o=0,s=0;!function a(){if(n>=e.length)return i();for(;t>s&&o<e.length;)o+=1,s+=1,r(e[o-1],function(t){t?(i(t),i=function(){}):(n+=1,s-=1,n>=e.length?i():a())})}()}},f=function(t){return function(){var e=Array.prototype.slice.call(arguments);return t.apply(null,[s.each].concat(e))}},v=function(t,e){return function(){var r=Array.prototype.slice.call(arguments);return e.apply(null,[d(t)].concat(r))}},g=function(t){return function(){var e=Array.prototype.slice.call(arguments);return t.apply(null,[s.eachSeries].concat(e))}},y=function(t,e,r,i){if(e=u(e,function(t,e){return{index:e,value:t}}),i){var n=[];t(e,function(t,e){r(t.value,function(r,i){n[t.index]=i,e(r)})},function(t){i(t,n)})}else t(e,function(t,e){r(t.value,function(t){e(t)})})};s.map=f(y),s.mapSeries=g(y),s.mapLimit=function(t,e,r,i){return m(e)(t,r,i)};var m=function(t){return v(t,y)};s.reduce=function(t,e,r,i){s.eachSeries(t,function(t,i){r(e,t,function(t,r){e=r,i(t)})},function(t){i(t,e)})},s.inject=s.reduce,s.foldl=s.reduce,s.reduceRight=function(t,e,r,i){var n=u(t,function(t){return t}).reverse();s.reduce(n,e,r,i)},s.foldr=s.reduceRight;var x=function(t,e,r,i){var n=[];e=u(e,function(t,e){return{index:e,value:t}}),t(e,function(t,e){r(t.value,function(r){r&&n.push(t),e()})},function(t){i(u(n.sort(function(t,e){return t.index-e.index}),function(t){return t.value}))})};s.filter=f(x),s.filterSeries=g(x),s.select=s.filter,s.selectSeries=s.filterSeries;var b=function(t,e,r,i){var n=[];e=u(e,function(t,e){return{index:e,value:t}}),t(e,function(t,e){r(t.value,function(r){r||n.push(t),e()})},function(t){i(u(n.sort(function(t,e){return t.index-e.index}),function(t){return t.value}))})};s.reject=f(b),s.rejectSeries=g(b);var _=function(t,e,r,i){t(e,function(t,e){r(t,function(r){r?(i(t),i=function(){}):e()})},function(t){i()})};s.detect=f(_),s.detectSeries=g(_),s.some=function(t,e,r){s.each(t,function(t,i){e(t,function(t){t&&(r(!0),r=function(){}),i()})},function(t){r(!1)})},s.any=s.some,s.every=function(t,e,r){s.each(t,function(t,i){e(t,function(t){t||(r(!1),r=function(){}),i()})},function(t){r(!0)})},s.all=s.every,s.sortBy=function(t,e,r){s.map(t,function(t,r){e(t,function(e,i){e?r(e):r(null,{value:t,criteria:i})})},function(t,e){if(t)return r(t);var i=function(t,e){var r=t.criteria,i=e.criteria;return i>r?-1:r>i?1:0};r(null,u(e.sort(i),function(t){return t.value}))})},s.auto=function(t,e){e=e||function(){};var r=p(t),i=r.length;if(!i)return e();var n={},o=[],a=function(t){o.unshift(t)},u=function(t){for(var e=0;e<o.length;e+=1)if(o[e]===t)return void o.splice(e,1)},d=function(){i--,l(o.slice(0),function(t){t()})};a(function(){if(!i){var t=e;e=function(){},t(null,n)}}),l(r,function(r){var i=h(t[r])?t[r]:[t[r]],o=function(t){var i=Array.prototype.slice.call(arguments,1);if(i.length<=1&&(i=i[0]),t){var o={};l(p(n),function(t){o[t]=n[t]}),o[r]=i,e(t,o),e=function(){}}else n[r]=i,s.setImmediate(d)},f=i.slice(0,Math.abs(i.length-1))||[],v=function(){return c(f,function(t,e){return t&&n.hasOwnProperty(e)},!0)&&!n.hasOwnProperty(r)};if(v())i[i.length-1](o,n);else{var g=function(){v()&&(u(g),i[i.length-1](o,n))};a(g)}})},s.retry=function(t,e,r){var i=5,n=[];"function"==typeof t&&(r=e,e=t,t=i),t=parseInt(t,10)||i;var o=function(i,o){for(var a=function(t,e){return function(r){t(function(t,i){r(!t||e,{err:t,result:i})},o)}};t;)n.push(a(e,!(t-=1)));s.series(n,function(t,e){e=e[e.length-1],(i||r)(e.err,e.result)})};return r?o():o},s.waterfall=function(t,e){if(e=e||function(){},!h(t)){var r=new Error("First argument to waterfall must be an array of functions");return e(r)}if(!t.length)return e();var i=function(t){return function(r){if(r)e.apply(null,arguments),e=function(){};else{var n=Array.prototype.slice.call(arguments,1),o=t.next();o?n.push(i(o)):n.push(e),s.setImmediate(function(){t.apply(null,n)})}}};i(s.iterator(t))()};var T=function(t,e,r){if(r=r||function(){},h(e))t.map(e,function(t,e){t&&t(function(t){var r=Array.prototype.slice.call(arguments,1);r.length<=1&&(r=r[0]),e.call(null,t,r)})},r);else{var i={};t.each(p(e),function(t,r){e[t](function(e){var n=Array.prototype.slice.call(arguments,1);n.length<=1&&(n=n[0]),i[t]=n,r(e)})},function(t){r(t,i)})}};s.parallel=function(t,e){T({map:s.map,each:s.each},t,e)},s.parallelLimit=function(t,e,r){T({map:m(e),each:d(e)},t,r)},s.series=function(t,e){if(e=e||function(){},h(t))s.mapSeries(t,function(t,e){t&&t(function(t){var r=Array.prototype.slice.call(arguments,1);r.length<=1&&(r=r[0]),e.call(null,t,r)})},e);else{var r={};s.eachSeries(p(t),function(e,i){t[e](function(t){var n=Array.prototype.slice.call(arguments,1);n.length<=1&&(n=n[0]),r[e]=n,i(t)})},function(t){e(t,r)})}},s.iterator=function(t){var e=function(r){var i=function(){return t.length&&t[r].apply(null,arguments),i.next()};return i.next=function(){return r<t.length-1?e(r+1):null},i};return e(0)},s.apply=function(t){var e=Array.prototype.slice.call(arguments,1);return function(){return t.apply(null,e.concat(Array.prototype.slice.call(arguments)))}};var E=function(t,e,r,i){var n=[];t(e,function(t,e){r(t,function(t,r){n=n.concat(r||[]),e(t)})},function(t){i(t,n)})};s.concat=f(E),s.concatSeries=g(E),s.whilst=function(t,e,r){t()?e(function(i){return i?r(i):void s.whilst(t,e,r)}):r()},s.doWhilst=function(t,e,r){t(function(i){if(i)return r(i);var n=Array.prototype.slice.call(arguments,1);e.apply(null,n)?s.doWhilst(t,e,r):r()})},s.until=function(t,e,r){t()?r():e(function(i){return i?r(i):void s.until(t,e,r)})},s.doUntil=function(t,e,r){t(function(i){if(i)return r(i);var n=Array.prototype.slice.call(arguments,1);e.apply(null,n)?r():s.doUntil(t,e,r)})},s.queue=function(t,e){function r(t,e,r,i){return t.started||(t.started=!0),h(e)||(e=[e]),0==e.length?s.setImmediate(function(){t.drain&&t.drain()}):void l(e,function(e){var n={data:e,callback:"function"==typeof i?i:null};r?t.tasks.unshift(n):t.tasks.push(n),t.saturated&&t.tasks.length===t.concurrency&&t.saturated(),s.setImmediate(t.process)})}void 0===e&&(e=1);var n=0,o={tasks:[],concurrency:e,saturated:null,empty:null,drain:null,started:!1,paused:!1,push:function(t,e){r(o,t,!1,e)},kill:function(){o.drain=null,o.tasks=[]},unshift:function(t,e){r(o,t,!0,e)},process:function(){if(!o.paused&&n<o.concurrency&&o.tasks.length){var e=o.tasks.shift();o.empty&&0===o.tasks.length&&o.empty(),n+=1;var r=function(){n-=1,e.callback&&e.callback.apply(e,arguments),o.drain&&o.tasks.length+n===0&&o.drain(),o.process()},s=i(r);t(e.data,s)}},length:function(){return o.tasks.length},running:function(){return n},idle:function(){return o.tasks.length+n===0},pause:function(){o.paused!==!0&&(o.paused=!0)},resume:function(){if(o.paused!==!1){o.paused=!1;for(var t=1;t<=o.concurrency;t++)s.setImmediate(o.process)}}};return o},s.priorityQueue=function(t,e){function r(t,e){return t.priority-e.priority}function i(t,e,r){for(var i=-1,n=t.length-1;n>i;){var o=i+(n-i+1>>>1);r(e,t[o])>=0?i=o:n=o-1}return i}function n(t,e,n,o){return t.started||(t.started=!0),h(e)||(e=[e]),0==e.length?s.setImmediate(function(){t.drain&&t.drain()}):void l(e,function(e){var a={data:e,priority:n,callback:"function"==typeof o?o:null};t.tasks.splice(i(t.tasks,a,r)+1,0,a),t.saturated&&t.tasks.length===t.concurrency&&t.saturated(),s.setImmediate(t.process)})}var o=s.queue(t,e);return o.push=function(t,e,r){n(o,t,e,r)},delete o.unshift,o},s.cargo=function(t,e){var r=!1,i=[],n={tasks:i,payload:e,saturated:null,empty:null,drain:null,drained:!0,push:function(t,r){h(t)||(t=[t]),l(t,function(t){i.push({data:t,callback:"function"==typeof r?r:null}),n.drained=!1,n.saturated&&i.length===e&&n.saturated()}),s.setImmediate(n.process)},process:function o(){if(!r){if(0===i.length)return n.drain&&!n.drained&&n.drain(),void(n.drained=!0);var s="number"==typeof e?i.splice(0,e):i.splice(0,i.length),a=u(s,function(t){return t.data});n.empty&&n.empty(),r=!0,t(a,function(){r=!1;var t=arguments;l(s,function(e){e.callback&&e.callback.apply(null,t)}),o()})}},length:function(){return i.length},running:function(){return r}};return n};var S=function(t){return function(e){var r=Array.prototype.slice.call(arguments,1);e.apply(null,r.concat([function(e){var r=Array.prototype.slice.call(arguments,1);"undefined"!=typeof console&&(e?console.error&&console.error(e):console[t]&&l(r,function(e){console[t](e)}))}]))}};s.log=S("log"),s.dir=S("dir"),s.memoize=function(t,e){var r={},i={};e=e||function(t){return t};var n=function(){var n=Array.prototype.slice.call(arguments),o=n.pop(),a=e.apply(null,n);a in r?s.nextTick(function(){o.apply(null,r[a])}):a in i?i[a].push(o):(i[a]=[o],t.apply(null,n.concat([function(){r[a]=arguments;var t=i[a];delete i[a];for(var e=0,n=t.length;n>e;e++)t[e].apply(null,arguments)}])))};return n.memo=r,n.unmemoized=t,n},s.unmemoize=function(t){return function(){return(t.unmemoized||t).apply(null,arguments)}},s.times=function(t,e,r){for(var i=[],n=0;t>n;n++)i.push(n);return s.map(i,e,r)},s.timesSeries=function(t,e,r){for(var i=[],n=0;t>n;n++)i.push(n);return s.mapSeries(i,e,r)},s.seq=function(){var t=arguments;return function(){var e=this,r=Array.prototype.slice.call(arguments),i=r.pop();s.reduce(t,r,function(t,r,i){r.apply(e,t.concat([function(){var t=arguments[0],e=Array.prototype.slice.call(arguments,1);i(t,e)}]))},function(t,r){i.apply(e,[t].concat(r))})}},s.compose=function(){return s.seq.apply(null,Array.prototype.reverse.call(arguments))};var w=function(t,e){var r=function(){var r=this,i=Array.prototype.slice.call(arguments),n=i.pop();return t(e,function(t,e){t.apply(r,i.concat([e]))},n)};if(arguments.length>2){var i=Array.prototype.slice.call(arguments,2);return r.apply(this,i)}return r};s.applyEach=f(w),s.applyEachSeries=g(w),s.forever=function(t,e){function r(i){if(i){if(e)return e(i);throw i}t(r)}r()},"undefined"!=typeof r&&r.exports?r.exports=s:"undefined"!=typeof t&&t.amd?t([],function(){return s}):n.async=s}()}).call(this,e("_process"))},{_process:3}],13:[function(t,e,r){function i(t,e){a.call(this),e=e||10,this.baseUrl=t||"",this.progress=0,this.loading=!1,this._progressChunk=0,this._beforeMiddleware=[],this._afterMiddleware=[],this._boundLoadResource=this._loadResource.bind(this),this._boundOnLoad=this._onLoad.bind(this),this._buffer=[],this._numToLoad=0,this._queue=n.queue(this._boundLoadResource,e),this.resources={}}var n=t("async"),o=t("url"),s=t("./Resource"),a=t("eventemitter3");i.prototype=Object.create(a.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.add=i.prototype.enqueue=function(t,e,r,i){if(Array.isArray(t)){for(var n=0;n<t.length;++n)this.add(t[n]);return this}if("object"==typeof t&&(i=e||t.callback||t.onComplete,r=t,e=t.url,t=t.name||t.key||t.url),"string"!=typeof e&&(i=r,r=e,e=t),"string"!=typeof e)throw new Error("No url passed to add resource to loader.");if("function"==typeof r&&(i=r,r=null),this.resources[t])throw new Error('Resource with name "'+t+'" already exists.');return e=this._handleBaseUrl(e),this.resources[t]=new s(t,e,r),"function"==typeof i&&this.resources[t].once("afterMiddleware",i),this._numToLoad++,this._queue.started?(this._queue.push(this.resources[t]),this._progressChunk=(100-this.progress)/(this._queue.length()+this._queue.running())):(this._buffer.push(this.resources[t]),this._progressChunk=100/this._buffer.length),this},i.prototype._handleBaseUrl=function(t){var e=o.parse(t);return e.protocol||0===e.pathname.indexOf("//")?t:this.baseUrl.length&&this.baseUrl.lastIndexOf("/")!==this.baseUrl.length-1&&"/"!==t.charAt(0)?this.baseUrl+"/"+t:this.baseUrl+t},i.prototype.before=i.prototype.pre=function(t){return this._beforeMiddleware.push(t),this},i.prototype.after=i.prototype.use=function(t){return this._afterMiddleware.push(t),this},i.prototype.reset=function(){this.progress=0,this.loading=!1,this._progressChunk=0,this._buffer.length=0,this._numToLoad=0,this._queue.kill(),this._queue.started=!1,this.resources={}},i.prototype.load=function(t){if("function"==typeof t&&this.once("complete",t),this._queue.started)return this;this.emit("start",this);for(var e=0;e<this._buffer.length;++e)this._queue.push(this._buffer[e]);return this._buffer.length=0,this},i.prototype._loadResource=function(t,e){var r=this;t._dequeue=e,this._runMiddleware(t,this._beforeMiddleware,function(){t.load(r._boundOnLoad)})},i.prototype._onComplete=function(){this.emit("complete",this,this.resources)},i.prototype._onLoad=function(t){this.progress+=this._progressChunk,this.emit("progress",this,t),this._runMiddleware(t,this._afterMiddleware,function(){t.emit("afterMiddleware",t),this._numToLoad--,0===this._numToLoad&&(this.progress=100,this._onComplete()),t.error?this.emit("error",t.error,this,t):this.emit("load",this,t)}),t._dequeue()},i.prototype._runMiddleware=function(t,e,r){var i=this;n.eachSeries(e,function(e,r){e.call(i,t,r)},r.bind(this,t))},i.LOAD_TYPE=s.LOAD_TYPE,i.XHR_READY_STATE=s.XHR_READY_STATE,i.XHR_RESPONSE_TYPE=s.XHR_RESPONSE_TYPE},{"./Resource":14,async:12,eventemitter3:10,url:8}],14:[function(t,e,r){function i(t,e,r){if(s.call(this),r=r||{},"string"!=typeof t||"string"!=typeof e)throw new Error("Both name and url are required for constructing a resource.");this.name=t,this.url=e,this.isDataUrl=0===this.url.indexOf("data:"),this.data=null,this.crossOrigin=r.crossOrigin===!0?"anonymous":r.crossOrigin,this.loadType=r.loadType||this._determineLoadType(),this.xhrType=r.xhrType,this.metadata=r.metadata||{},this.error=null,this.xhr=null,this.isJson=!1,this.isXml=!1,this.isImage=!1,this.isAudio=!1,this.isVideo=!1,this._dequeue=null,this._boundComplete=this.complete.bind(this),this._boundOnError=this._onError.bind(this),this._boundOnProgress=this._onProgress.bind(this),this._boundXhrOnError=this._xhrOnError.bind(this),this._boundXhrOnAbort=this._xhrOnAbort.bind(this),this._boundXhrOnLoad=this._xhrOnLoad.bind(this),this._boundXdrOnTimeout=this._xdrOnTimeout.bind(this)}function n(t){return t.toString().replace("object ","")}function o(t,e,r){e&&0===e.indexOf(".")&&(e=e.substring(1)),e&&(t[e]=r)}var s=t("eventemitter3"),a=t("url"),h=!(!window.XDomainRequest||"withCredentials"in new XMLHttpRequest),l=null;i.prototype=Object.create(s.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.complete=function(){this.data&&this.data.removeEventListener&&(this.data.removeEventListener("error",this._boundOnError),this.data.removeEventListener("load",this._boundComplete),this.data.removeEventListener("progress",this._boundOnProgress),this.data.removeEventListener("canplaythrough",this._boundComplete)),this.xhr&&(this.xhr.removeEventListener?(this.xhr.removeEventListener("error",this._boundXhrOnError),this.xhr.removeEventListener("abort",this._boundXhrOnAbort),this.xhr.removeEventListener("progress",this._boundOnProgress),this.xhr.removeEventListener("load",this._boundXhrOnLoad)):(this.xhr.onerror=null,this.xhr.ontimeout=null,this.xhr.onprogress=null,this.xhr.onload=null)),this.emit("complete",this)},i.prototype.load=function(t){switch(this.emit("start",this),t&&this.once("complete",t),this.crossOrigin!==!1&&"string"==typeof this.crossOrigin||(this.crossOrigin=this._determineCrossOrigin(this.url)),this.loadType){case i.LOAD_TYPE.IMAGE:this._loadImage();break;case i.LOAD_TYPE.AUDIO:this._loadElement("audio");break;case i.LOAD_TYPE.VIDEO:this._loadElement("video");break;case i.LOAD_TYPE.XHR:default:h&&this.crossOrigin?this._loadXdr():this._loadXhr()}},i.prototype._loadImage=function(){this.data=new Image,this.crossOrigin&&(this.data.crossOrigin=this.crossOrigin),this.data.src=this.url,this.isImage=!0,this.data.addEventListener("error",this._boundOnError,!1),this.data.addEventListener("load",this._boundComplete,!1),this.data.addEventListener("progress",this._boundOnProgress,!1)},i.prototype._loadElement=function(t){if("audio"===t&&"undefined"!=typeof Audio?this.data=new Audio:this.data=document.createElement(t),null===this.data)return this.error=new Error("Unsupported element "+t),void this.complete();if(navigator.isCocoonJS)this.data.src=Array.isArray(this.url)?this.url[0]:this.url;else if(Array.isArray(this.url))for(var e=0;e<this.url.length;++e)this.data.appendChild(this._createSource(t,this.url[e]));else this.data.appendChild(this._createSource(t,this.url));this["is"+t[0].toUpperCase()+t.substring(1)]=!0,this.data.addEventListener("error",this._boundOnError,!1),this.data.addEventListener("load",this._boundComplete,!1),this.data.addEventListener("progress",this._boundOnProgress,!1),this.data.addEventListener("canplaythrough",this._boundComplete,!1),this.data.load()},i.prototype._loadXhr=function(){"string"!=typeof this.xhrType&&(this.xhrType=this._determineXhrType());var t=this.xhr=new XMLHttpRequest;t.open("GET",this.url,!0),this.xhrType===i.XHR_RESPONSE_TYPE.JSON||this.xhrType===i.XHR_RESPONSE_TYPE.DOCUMENT?t.responseType=i.XHR_RESPONSE_TYPE.TEXT:t.responseType=this.xhrType,t.addEventListener("error",this._boundXhrOnError,!1),t.addEventListener("abort",this._boundXhrOnAbort,!1),t.addEventListener("progress",this._boundOnProgress,!1),t.addEventListener("load",this._boundXhrOnLoad,!1),t.send()},i.prototype._loadXdr=function(){"string"!=typeof this.xhrType&&(this.xhrType=this._determineXhrType());var t=this.xhr=new XDomainRequest;t.timeout=5e3,t.onerror=this._boundXhrOnError,t.ontimeout=this._boundXdrOnTimeout,t.onprogress=this._boundOnProgress,t.onload=this._boundXhrOnLoad,t.open("GET",this.url,!0),setTimeout(function(){t.send()},0)},i.prototype._createSource=function(t,e,r){r||(r=t+"/"+e.substr(e.lastIndexOf(".")+1));var i=document.createElement("source");return i.src=e,i.type=r,i},i.prototype._onError=function(t){this.error=new Error("Failed to load element using "+t.target.nodeName),this.complete()},i.prototype._onProgress=function(t){t&&t.lengthComputable&&this.emit("progress",this,t.loaded/t.total)},i.prototype._xhrOnError=function(){this.error=new Error(n(this.xhr)+" Request failed. Status: "+this.xhr.status+', text: "'+this.xhr.statusText+'"'),this.complete()},i.prototype._xhrOnAbort=function(){this.error=new Error(n(this.xhr)+" Request was aborted by the user."),this.complete()},i.prototype._xdrOnTimeout=function(){this.error=new Error(n(this.xhr)+" Request timed out."),this.complete()},i.prototype._xhrOnLoad=function(){var t=this.xhr,e=void 0!==t.status?t.status:200;if(200===e||204===e||0===e&&t.responseText.length>0)if(this.xhrType===i.XHR_RESPONSE_TYPE.TEXT)this.data=t.responseText;else if(this.xhrType===i.XHR_RESPONSE_TYPE.JSON)try{this.data=JSON.parse(t.responseText),this.isJson=!0}catch(r){this.error=new Error("Error trying to parse loaded json:",r)}else if(this.xhrType===i.XHR_RESPONSE_TYPE.DOCUMENT)try{if(window.DOMParser){var n=new DOMParser;this.data=n.parseFromString(t.responseText,"text/xml")}else{var o=document.createElement("div");o.innerHTML=t.responseText,this.data=o}this.isXml=!0}catch(r){this.error=new Error("Error trying to parse loaded xml:",r)}else this.data=t.response||t.responseText;else this.error=new Error("["+t.status+"]"+t.statusText+":"+t.responseURL);this.complete()},i.prototype._determineCrossOrigin=function(t,e){if(0===t.indexOf("data:"))return"";e=e||window.location,l||(l=document.createElement("a")),l.href=t,t=a.parse(l.href);var r=!t.port&&""===e.port||t.port===e.port;return t.hostname===e.hostname&&r&&t.protocol===e.protocol?"":"anonymous"},i.prototype._determineXhrType=function(){return i._xhrTypeMap[this._getExtension()]||i.XHR_RESPONSE_TYPE.TEXT},i.prototype._determineLoadType=function(){return i._loadTypeMap[this._getExtension()]||i.LOAD_TYPE.XHR},i.prototype._getExtension=function(){var t,e=this.url;if(this.isDataUrl){var r=e.indexOf("/");t=e.substring(r+1,e.indexOf(";",r))}else{var i=e.indexOf("?");-1!==i&&(e=e.substring(0,i)),t=e.substring(e.lastIndexOf(".")+1)}return t},i.prototype._getMimeFromXhrType=function(t){switch(t){case i.XHR_RESPONSE_TYPE.BUFFER:return"application/octet-binary";case i.XHR_RESPONSE_TYPE.BLOB:return"application/blob";case i.XHR_RESPONSE_TYPE.DOCUMENT:return"application/xml";case i.XHR_RESPONSE_TYPE.JSON:return"application/json";case i.XHR_RESPONSE_TYPE.DEFAULT:case i.XHR_RESPONSE_TYPE.TEXT:default:return"text/plain"}},i.LOAD_TYPE={XHR:1,IMAGE:2,AUDIO:3,VIDEO:4},i.XHR_READY_STATE={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4},i.XHR_RESPONSE_TYPE={DEFAULT:"text",BUFFER:"arraybuffer",BLOB:"blob",DOCUMENT:"document",JSON:"json",TEXT:"text"},i._loadTypeMap={gif:i.LOAD_TYPE.IMAGE,png:i.LOAD_TYPE.IMAGE,bmp:i.LOAD_TYPE.IMAGE,jpg:i.LOAD_TYPE.IMAGE,jpeg:i.LOAD_TYPE.IMAGE,tif:i.LOAD_TYPE.IMAGE,tiff:i.LOAD_TYPE.IMAGE,webp:i.LOAD_TYPE.IMAGE,tga:i.LOAD_TYPE.IMAGE},i._xhrTypeMap={xhtml:i.XHR_RESPONSE_TYPE.DOCUMENT,html:i.XHR_RESPONSE_TYPE.DOCUMENT,htm:i.XHR_RESPONSE_TYPE.DOCUMENT,xml:i.XHR_RESPONSE_TYPE.DOCUMENT,tmx:i.XHR_RESPONSE_TYPE.DOCUMENT,tsx:i.XHR_RESPONSE_TYPE.DOCUMENT,svg:i.XHR_RESPONSE_TYPE.DOCUMENT,gif:i.XHR_RESPONSE_TYPE.BLOB,png:i.XHR_RESPONSE_TYPE.BLOB,bmp:i.XHR_RESPONSE_TYPE.BLOB,jpg:i.XHR_RESPONSE_TYPE.BLOB,jpeg:i.XHR_RESPONSE_TYPE.BLOB,tif:i.XHR_RESPONSE_TYPE.BLOB,tiff:i.XHR_RESPONSE_TYPE.BLOB,webp:i.XHR_RESPONSE_TYPE.BLOB,tga:i.XHR_RESPONSE_TYPE.BLOB,json:i.XHR_RESPONSE_TYPE.JSON,text:i.XHR_RESPONSE_TYPE.TEXT,txt:i.XHR_RESPONSE_TYPE.TEXT},i.setExtensionLoadType=function(t,e){o(i._loadTypeMap,t,e)},i.setExtensionXhrType=function(t,e){o(i._xhrTypeMap,t,e)}},{eventemitter3:10,url:8}],15:[function(t,e,r){e.exports={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encodeBinary:function(t){for(var e,r="",i=new Array(4),n=0,o=0,s=0;n<t.length;){for(e=new Array(3),o=0;o<e.length;o++)n<t.length?e[o]=255&t.charCodeAt(n++):e[o]=0;switch(i[0]=e[0]>>2,i[1]=(3&e[0])<<4|e[1]>>4,i[2]=(15&e[1])<<2|e[2]>>6,i[3]=63&e[2],s=n-(t.length-1)){case 2:i[3]=64,i[2]=64;break;case 1:i[3]=64}for(o=0;o<i.length;o++)r+=this._keyStr.charAt(i[o])}return r}}},{}],16:[function(t,e,r){e.exports=t("./Loader"),e.exports.Resource=t("./Resource"),e.exports.middleware={caching:{memory:t("./middlewares/caching/memory")},parsing:{blob:t("./middlewares/parsing/blob")}}},{"./Loader":13,"./Resource":14,"./middlewares/caching/memory":17,"./middlewares/parsing/blob":18}],17:[function(t,e,r){var i={};e.exports=function(){return function(t,e){i[t.url]?(t.data=i[t.url],t.complete()):t.once("complete",function(){i[this.url]=this.data}),e()}}},{}],18:[function(t,e,r){var i=t("../../Resource"),n=t("../../b64");window.URL=window.URL||window.webkitURL,e.exports=function(){return function(t,e){if(!t.data)return e();if(t.xhr&&t.xhrType===i.XHR_RESPONSE_TYPE.BLOB)if(window.Blob&&"string"!=typeof t.data){if(0===t.data.type.indexOf("image")){var r=URL.createObjectURL(t.data);t.blob=t.data,t.data=new Image,t.data.src=r,t.isImage=!0,t.data.onload=function(){URL.revokeObjectURL(r),t.data.onload=null,e()}}}else{var o=t.xhr.getResponseHeader("content-type");o&&0===o.indexOf("image")&&(t.data=new Image,t.data.src="data:"+o+";base64,"+n.encodeBinary(t.xhr.responseText),t.isImage=!0,t.data.onload=function(){t.data.onload=null,e()})}else e()}}},{"../../Resource":14,"../../b64":15}],19:[function(t,e,r){function i(t){var e=document.createElement("div");e.style.width="100px",e.style.height="100px",e.style.position="absolute",e.style.top=0,e.style.left=0,e.style.zIndex=2,this.div=e,this.pool=[],this.renderId=0,this.debug=!1,this.renderer=t,this.children=[],this._onKeyDown=this._onKeyDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),this.isActive=!1,window.addEventListener("keydown",this._onKeyDown,!1)}var n=t("../core");Object.assign(n.DisplayObject.prototype,t("./accessibleTarget")),i.prototype.constructor=i,e.exports=i,i.prototype.activate=function(){this.isActive||(this.isActive=!0,window.document.addEventListener("mousemove",this._onMouseMove,!0),window.removeEventListener("keydown",this._onKeyDown,!1),this.renderer.on("postrender",this.update,this),this.renderer.view.parentNode.appendChild(this.div))},i.prototype.deactivate=function(){this.isActive&&(this.isActive=!1,window.document.removeEventListener("mousemove",this._onMouseMove),window.addEventListener("keydown",this._onKeyDown,!1),this.renderer.off("postrender",this.update),this.div.parentNode.removeChild(this.div))},i.prototype.updateAccessibleObjects=function(t){if(t.visible&&(t.accessible&&t.interactive&&(t._accessibleActive||this.addChild(t),t.renderId=this.renderId),t.interactiveChildren))for(var e=t.children,r=e.length-1;r>=0;r--)this.updateAccessibleObjects(e[r])},i.prototype.update=function(){this.updateAccessibleObjects(this.renderer._lastObjectRendered);var t=this.renderer.view.getBoundingClientRect(),e=t.width/this.renderer.width,r=t.height/this.renderer.height,i=this.div;i.style.left=t.left+"px",i.style.top=t.top+"px",i.style.width=this.renderer.width+"px",i.style.height=this.renderer.height+"px";for(var o=0;o<this.children.length;o++){var s=this.children[o];if(s.renderId!==this.renderId)s._accessibleActive=!1,n.utils.removeItems(this.children,o,1),this.div.removeChild(s._accessibleDiv),this.pool.push(s._accessibleDiv),s._accessibleDiv=null,o--,0===this.children.length&&this.deactivate();else{i=s._accessibleDiv;var a=s.hitArea,h=s.worldTransform;s.hitArea?(i.style.left=(h.tx+a.x*h.a)*e+"px",i.style.top=(h.ty+a.y*h.d)*r+"px",i.style.width=a.width*h.a*e+"px",i.style.height=a.height*h.d*r+"px"):(a=s.getBounds(),this.capHitArea(a),i.style.left=a.x*e+"px",i.style.top=a.y*r+"px",i.style.width=a.width*e+"px",i.style.height=a.height*r+"px")}}this.renderId++},i.prototype.capHitArea=function(t){t.x<0&&(t.width+=t.x,t.x=0),t.y<0&&(t.height+=t.y,t.y=0),t.x+t.width>this.renderer.width&&(t.width=this.renderer.width-t.x),t.y+t.height>this.renderer.height&&(t.height=this.renderer.height-t.y)},i.prototype.addChild=function(t){var e=this.pool.pop();e||(e=document.createElement("button"),e.style.width="100px",e.style.height="100px",e.style.backgroundColor=this.debug?"rgba(255,0,0,0.5)":"transparent",e.style.position="absolute",e.style.zIndex=2,e.style.borderStyle="none",e.addEventListener("click",this._onClick.bind(this)),e.addEventListener("focus",this._onFocus.bind(this)),e.addEventListener("focusout",this._onFocusOut.bind(this))),e.title=t.accessibleTitle||"displayObject "+this.tabIndex,t._accessibleActive=!0,t._accessibleDiv=e,e.displayObject=t,this.children.push(t),this.div.appendChild(t._accessibleDiv),t._accessibleDiv.tabIndex=t.tabIndex},i.prototype._onClick=function(t){var e=this.renderer.plugins.interaction;e.dispatchEvent(t.target.displayObject,"click",e.eventData)},i.prototype._onFocus=function(t){var e=this.renderer.plugins.interaction;e.dispatchEvent(t.target.displayObject,"mouseover",e.eventData)},i.prototype._onFocusOut=function(t){var e=this.renderer.plugins.interaction;
e.dispatchEvent(t.target.displayObject,"mouseout",e.eventData)},i.prototype._onKeyDown=function(t){9===t.keyCode&&this.activate()},i.prototype._onMouseMove=function(){this.deactivate()},i.prototype.destroy=function(){this.div=null;for(var t=0;t<this.children.length;t++)this.children[t].div=null;window.document.removeEventListener("mousemove",this._onMouseMove),window.removeEventListener("keydown",this._onKeyDown),this.pool=null,this.children=null,this.renderer=null},n.WebGLRenderer.registerPlugin("accessibility",i),n.CanvasRenderer.registerPlugin("accessibility",i)},{"../core":29,"./accessibleTarget":20}],20:[function(t,e,r){var i={accessible:!1,accessibleTitle:null,tabIndex:0,_accessibleActive:!1,_accessibleDiv:!1};e.exports=i},{}],21:[function(t,e,r){e.exports={accessibleTarget:t("./accessibleTarget"),AccessibilityManager:t("./AccessibilityManager")}},{"./AccessibilityManager":19,"./accessibleTarget":20}],22:[function(t,e,r){var i={VERSION:"3.0.10",PI_2:2*Math.PI,RAD_TO_DEG:180/Math.PI,DEG_TO_RAD:Math.PI/180,TARGET_FPMS:.06,RENDERER_TYPE:{UNKNOWN:0,WEBGL:1,CANVAS:2},BLEND_MODES:{NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},DRAW_MODES:{POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},SCALE_MODES:{DEFAULT:0,LINEAR:0,NEAREST:1},RETINA_PREFIX:/@(.+)x/,RESOLUTION:1,FILTER_RESOLUTION:1,DEFAULT_RENDER_OPTIONS:{view:null,resolution:1,antialias:!1,forceFXAA:!1,autoResize:!1,transparent:!1,backgroundColor:0,clearBeforeRender:!0,preserveDrawingBuffer:!1,roundPixels:!1},SHAPES:{POLY:0,RECT:1,CIRC:2,ELIP:3,RREC:4},SPRITE_BATCH_SIZE:2e3};e.exports=i},{}],23:[function(t,e,r){function i(){s.call(this),this.children=[]}var n=t("../math"),o=t("../utils"),s=t("./DisplayObject"),a=t("../textures/RenderTexture"),h=new n.Matrix;i.prototype=Object.create(s.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{width:{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(t){var e=this.getLocalBounds().width;0!==e?this.scale.x=t/e:this.scale.x=1,this._width=t}},height:{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(t){var e=this.getLocalBounds().height;0!==e?this.scale.y=t/e:this.scale.y=1,this._height=t}}}),i.prototype.onChildrenChange=function(){},i.prototype.addChild=function(t){var e=arguments.length;if(e>1)for(var r=0;e>r;r++)this.addChild(arguments[r]);else t.parent&&t.parent.removeChild(t),t.parent=this,this.children.push(t),this.onChildrenChange(this.children.length-1),t.emit("added",this);return t},i.prototype.addChildAt=function(t,e){if(e>=0&&e<=this.children.length)return t.parent&&t.parent.removeChild(t),t.parent=this,this.children.splice(e,0,t),this.onChildrenChange(e),t.emit("added",this),t;throw new Error(t+"addChildAt: The index "+e+" supplied is out of bounds "+this.children.length)},i.prototype.swapChildren=function(t,e){if(t!==e){var r=this.getChildIndex(t),i=this.getChildIndex(e);if(0>r||0>i)throw new Error("swapChildren: Both the supplied DisplayObjects must be children of the caller.");this.children[r]=e,this.children[i]=t,this.onChildrenChange(i>r?r:i)}},i.prototype.getChildIndex=function(t){var e=this.children.indexOf(t);if(-1===e)throw new Error("The supplied DisplayObject must be a child of the caller");return e},i.prototype.setChildIndex=function(t,e){if(0>e||e>=this.children.length)throw new Error("The supplied index is out of bounds");var r=this.getChildIndex(t);o.removeItems(this.children,r,1),this.children.splice(e,0,t),this.onChildrenChange(e)},i.prototype.getChildAt=function(t){if(0>t||t>=this.children.length)throw new Error("getChildAt: Supplied index "+t+" does not exist in the child list, or the supplied DisplayObject is not a child of the caller");return this.children[t]},i.prototype.removeChild=function(t){var e=arguments.length;if(e>1)for(var r=0;e>r;r++)this.removeChild(arguments[r]);else{var i=this.children.indexOf(t);if(-1===i)return;t.parent=null,o.removeItems(this.children,i,1),this.onChildrenChange(i),t.emit("removed",this)}return t},i.prototype.removeChildAt=function(t){var e=this.getChildAt(t);return e.parent=null,o.removeItems(this.children,t,1),this.onChildrenChange(t),e.emit("removed",this),e},i.prototype.removeChildren=function(t,e){var r,i,n=t||0,o="number"==typeof e?e:this.children.length,s=o-n;if(s>0&&o>=s){for(r=this.children.splice(n,s),i=0;i<r.length;++i)r[i].parent=null;for(this.onChildrenChange(t),i=0;i<r.length;++i)r[i].emit("removed",this);return r}if(0===s&&0===this.children.length)return[];throw new RangeError("removeChildren: numeric values are outside the acceptable range.")},i.prototype.generateTexture=function(t,e,r){var i=this.getLocalBounds(),n=new a(t,0|i.width,0|i.height,r,e);return h.tx=-i.x,h.ty=-i.y,n.render(this,h),n},i.prototype.updateTransform=function(){if(this.visible){this.displayObjectUpdateTransform();for(var t=0,e=this.children.length;e>t;++t)this.children[t].updateTransform()}},i.prototype.containerUpdateTransform=i.prototype.updateTransform,i.prototype.getBounds=function(){if(!this._currentBounds){if(0===this.children.length)return n.Rectangle.EMPTY;for(var t,e,r,i=1/0,o=1/0,s=-(1/0),a=-(1/0),h=!1,l=0,u=this.children.length;u>l;++l){var c=this.children[l];c.visible&&(h=!0,t=this.children[l].getBounds(),i=i<t.x?i:t.x,o=o<t.y?o:t.y,e=t.width+t.x,r=t.height+t.y,s=s>e?s:e,a=a>r?a:r)}if(!h)return n.Rectangle.EMPTY;var p=this._bounds;p.x=i,p.y=o,p.width=s-i,p.height=a-o,this._currentBounds=p}return this._currentBounds},i.prototype.containerGetBounds=i.prototype.getBounds,i.prototype.getLocalBounds=function(){var t=this.worldTransform;this.worldTransform=n.Matrix.IDENTITY;for(var e=0,r=this.children.length;r>e;++e)this.children[e].updateTransform();return this.worldTransform=t,this._currentBounds=null,this.getBounds(n.Matrix.IDENTITY)},i.prototype.renderWebGL=function(t){if(this.visible&&!(this.worldAlpha<=0)&&this.renderable){var e,r;if(this._mask||this._filters){for(t.currentRenderer.flush(),this._filters&&this._filters.length&&t.filterManager.pushFilter(this,this._filters),this._mask&&t.maskManager.pushMask(this,this._mask),t.currentRenderer.start(),this._renderWebGL(t),e=0,r=this.children.length;r>e;e++)this.children[e].renderWebGL(t);t.currentRenderer.flush(),this._mask&&t.maskManager.popMask(this,this._mask),this._filters&&t.filterManager.popFilter(),t.currentRenderer.start()}else for(this._renderWebGL(t),e=0,r=this.children.length;r>e;++e)this.children[e].renderWebGL(t)}},i.prototype._renderWebGL=function(t){},i.prototype._renderCanvas=function(t){},i.prototype.renderCanvas=function(t){if(this.visible&&!(this.alpha<=0)&&this.renderable){this._mask&&t.maskManager.pushMask(this._mask,t),this._renderCanvas(t);for(var e=0,r=this.children.length;r>e;++e)this.children[e].renderCanvas(t);this._mask&&t.maskManager.popMask(t)}},i.prototype.destroy=function(t){if(s.prototype.destroy.call(this),t)for(var e=0,r=this.children.length;r>e;++e)this.children[e].destroy(t);this.removeChildren(),this.children=null}},{"../math":33,"../textures/RenderTexture":71,"../utils":77,"./DisplayObject":24}],24:[function(t,e,r){function i(){s.call(this),this.position=new n.Point,this.scale=new n.Point(1,1),this.pivot=new n.Point(0,0),this.skew=new n.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.renderable=!0,this.parent=null,this.worldAlpha=1,this.worldTransform=new n.Matrix,this.filterArea=null,this._sr=0,this._cr=1,this._bounds=new n.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null}var n=t("../math"),o=t("../textures/RenderTexture"),s=t("eventemitter3"),a=t("../const"),h=new n.Matrix,l={worldTransform:new n.Matrix,worldAlpha:1,children:[]};i.prototype=Object.create(s.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{x:{get:function(){return this.position.x},set:function(t){this.position.x=t}},y:{get:function(){return this.position.y},set:function(t){this.position.y=t}},worldVisible:{get:function(){var t=this;do{if(!t.visible)return!1;t=t.parent}while(t);return!0}},mask:{get:function(){return this._mask},set:function(t){this._mask&&(this._mask.renderable=!0),this._mask=t,this._mask&&(this._mask.renderable=!1)}},filters:{get:function(){return this._filters&&this._filters.slice()},set:function(t){this._filters=t&&t.slice()}}}),i.prototype.updateTransform=function(){var t,e,r,i,n,o,s=this.parent.worldTransform,l=this.worldTransform;this.skew.x||this.skew.y?(h.setTransform(this.position.x,this.position.y,this.pivot.x,this.pivot.y,this.scale.x,this.scale.y,this.rotation,this.skew.x,this.skew.y),l.a=h.a*s.a+h.b*s.c,l.b=h.a*s.b+h.b*s.d,l.c=h.c*s.a+h.d*s.c,l.d=h.c*s.b+h.d*s.d,l.tx=h.tx*s.a+h.ty*s.c+s.tx,l.ty=h.tx*s.b+h.ty*s.d+s.ty):this.rotation%a.PI_2?(this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation)),t=this._cr*this.scale.x,e=this._sr*this.scale.x,r=-this._sr*this.scale.y,i=this._cr*this.scale.y,n=this.position.x,o=this.position.y,(this.pivot.x||this.pivot.y)&&(n-=this.pivot.x*t+this.pivot.y*r,o-=this.pivot.x*e+this.pivot.y*i),l.a=t*s.a+e*s.c,l.b=t*s.b+e*s.d,l.c=r*s.a+i*s.c,l.d=r*s.b+i*s.d,l.tx=n*s.a+o*s.c+s.tx,l.ty=n*s.b+o*s.d+s.ty):(t=this.scale.x,i=this.scale.y,n=this.position.x-this.pivot.x*t,o=this.position.y-this.pivot.y*i,l.a=t*s.a,l.b=t*s.b,l.c=i*s.c,l.d=i*s.d,l.tx=n*s.a+o*s.c+s.tx,l.ty=n*s.b+o*s.d+s.ty),this.worldAlpha=this.alpha*this.parent.worldAlpha,this._currentBounds=null},i.prototype.displayObjectUpdateTransform=i.prototype.updateTransform,i.prototype.getBounds=function(t){return n.Rectangle.EMPTY},i.prototype.getLocalBounds=function(){return this.getBounds(n.Matrix.IDENTITY)},i.prototype.toGlobal=function(t){return this.parent?this.displayObjectUpdateTransform():(this.parent=l,this.displayObjectUpdateTransform(),this.parent=null),this.worldTransform.apply(t)},i.prototype.toLocal=function(t,e,r){return e&&(t=e.toGlobal(t)),this.parent?this.displayObjectUpdateTransform():(this.parent=l,this.displayObjectUpdateTransform(),this.parent=null),this.worldTransform.applyInverse(t,r)},i.prototype.renderWebGL=function(t){},i.prototype.renderCanvas=function(t){},i.prototype.generateTexture=function(t,e,r){var i=this.getLocalBounds(),n=new o(t,0|i.width,0|i.height,e,r);return h.tx=-i.x,h.ty=-i.y,n.render(this,h),n},i.prototype.setParent=function(t){if(!t||!t.addChild)throw new Error("setParent: Argument must be a Container");return t.addChild(this),t},i.prototype.setTransform=function(t,e,r,i,n,o,s,a,h){return this.position.x=t||0,this.position.y=e||0,this.scale.x=r?r:1,this.scale.y=i?i:1,this.rotation=n||0,this.skew.x=o||0,this.skew.y=s||0,this.pivot.x=a||0,this.pivot.y=h||0,this},i.prototype.destroy=function(){this.position=null,this.scale=null,this.pivot=null,this.skew=null,this.parent=null,this._bounds=null,this._currentBounds=null,this._mask=null,this.worldTransform=null,this.filterArea=null}},{"../const":22,"../math":33,"../textures/RenderTexture":71,eventemitter3:10}],25:[function(t,e,r){function i(){n.call(this),this.fillAlpha=1,this.lineWidth=0,this.lineColor=0,this.graphicsData=[],this.tint=16777215,this._prevTint=16777215,this.blendMode=u.BLEND_MODES.NORMAL,this.currentPath=null,this._webGL={},this.isMask=!1,this.boundsPadding=0,this._localBounds=new l.Rectangle(0,0,1,1),this.dirty=!0,this.glDirty=!1,this.boundsDirty=!0,this.cachedSpriteDirty=!1}var n=t("../display/Container"),o=t("../textures/Texture"),s=t("../renderers/canvas/utils/CanvasBuffer"),a=t("../renderers/canvas/utils/CanvasGraphics"),h=t("./GraphicsData"),l=t("../math"),u=t("../const"),c=new l.Point;i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){var t=new i;t.renderable=this.renderable,t.fillAlpha=this.fillAlpha,t.lineWidth=this.lineWidth,t.lineColor=this.lineColor,t.tint=this.tint,t.blendMode=this.blendMode,t.isMask=this.isMask,t.boundsPadding=this.boundsPadding,t.dirty=!0,t.glDirty=!0,t.cachedSpriteDirty=this.cachedSpriteDirty;for(var e=0;e<this.graphicsData.length;++e)t.graphicsData.push(this.graphicsData[e].clone());return t.currentPath=t.graphicsData[t.graphicsData.length-1],t.updateLocalBounds(),t},i.prototype.lineStyle=function(t,e,r){if(this.lineWidth=t||0,this.lineColor=e||0,this.lineAlpha=void 0===r?1:r,this.currentPath)if(this.currentPath.shape.points.length){var i=new l.Polygon(this.currentPath.shape.points.slice(-2));i.closed=!1,this.drawShape(i)}else this.currentPath.lineWidth=this.lineWidth,this.currentPath.lineColor=this.lineColor,this.currentPath.lineAlpha=this.lineAlpha;return this},i.prototype.moveTo=function(t,e){var r=new l.Polygon([t,e]);return r.closed=!1,this.drawShape(r),this},i.prototype.lineTo=function(t,e){return this.currentPath.shape.points.push(t,e),this.dirty=!0,this},i.prototype.quadraticCurveTo=function(t,e,r,i){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var n,o,s=20,a=this.currentPath.shape.points;0===a.length&&this.moveTo(0,0);for(var h=a[a.length-2],l=a[a.length-1],u=0,c=1;s>=c;++c)u=c/s,n=h+(t-h)*u,o=l+(e-l)*u,a.push(n+(t+(r-t)*u-n)*u,o+(e+(i-e)*u-o)*u);return this.dirty=this.boundsDirty=!0,this},i.prototype.bezierCurveTo=function(t,e,r,i,n,o){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);for(var s,a,h,l,u,c=20,p=this.currentPath.shape.points,d=p[p.length-2],f=p[p.length-1],v=0,g=1;c>=g;++g)v=g/c,s=1-v,a=s*s,h=a*s,l=v*v,u=l*v,p.push(h*d+3*a*v*t+3*s*l*r+u*n,h*f+3*a*v*e+3*s*l*i+u*o);return this.dirty=this.boundsDirty=!0,this},i.prototype.arcTo=function(t,e,r,i,n){this.currentPath?0===this.currentPath.shape.points.length&&this.currentPath.shape.points.push(t,e):this.moveTo(t,e);var o=this.currentPath.shape.points,s=o[o.length-2],a=o[o.length-1],h=a-e,l=s-t,u=i-e,c=r-t,p=Math.abs(h*c-l*u);if(1e-8>p||0===n)o[o.length-2]===t&&o[o.length-1]===e||o.push(t,e);else{var d=h*h+l*l,f=u*u+c*c,v=h*u+l*c,g=n*Math.sqrt(d)/p,y=n*Math.sqrt(f)/p,m=g*v/d,x=y*v/f,b=g*c+y*l,_=g*u+y*h,T=l*(y+m),E=h*(y+m),S=c*(g+x),w=u*(g+x),A=Math.atan2(E-_,T-b),C=Math.atan2(w-_,S-b);this.arc(b+t,_+e,n,A,C,l*u>c*h)}return this.dirty=this.boundsDirty=!0,this},i.prototype.arc=function(t,e,r,i,n,o){if(o=o||!1,i===n)return this;!o&&i>=n?n+=2*Math.PI:o&&n>=i&&(i+=2*Math.PI);var s=o?-1*(i-n):n-i,a=40*Math.ceil(Math.abs(s)/(2*Math.PI));if(0===s)return this;var h=t+Math.cos(i)*r,l=e+Math.sin(i)*r;this.currentPath?this.currentPath.shape.points.push(h,l):this.moveTo(h,l);for(var u=this.currentPath.shape.points,c=s/(2*a),p=2*c,d=Math.cos(c),f=Math.sin(c),v=a-1,g=v%1/v,y=0;v>=y;y++){var m=y+g*y,x=c+i+p*m,b=Math.cos(x),_=-Math.sin(x);u.push((d*b+f*_)*r+t,(d*-_+f*b)*r+e)}return this.dirty=this.boundsDirty=!0,this},i.prototype.beginFill=function(t,e){return this.filling=!0,this.fillColor=t||0,this.fillAlpha=void 0===e?1:e,this.currentPath&&this.currentPath.shape.points.length<=2&&(this.currentPath.fill=this.filling,this.currentPath.fillColor=this.fillColor,this.currentPath.fillAlpha=this.fillAlpha),this},i.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},i.prototype.drawRect=function(t,e,r,i){return this.drawShape(new l.Rectangle(t,e,r,i)),this},i.prototype.drawRoundedRect=function(t,e,r,i,n){return this.drawShape(new l.RoundedRectangle(t,e,r,i,n)),this},i.prototype.drawCircle=function(t,e,r){return this.drawShape(new l.Circle(t,e,r)),this},i.prototype.drawEllipse=function(t,e,r,i){return this.drawShape(new l.Ellipse(t,e,r,i)),this},i.prototype.drawPolygon=function(t){var e=t,r=!0;if(e instanceof l.Polygon&&(r=e.closed,e=e.points),!Array.isArray(e)){e=new Array(arguments.length);for(var i=0;i<e.length;++i)e[i]=arguments[i]}var n=new l.Polygon(e);return n.closed=r,this.drawShape(n),this},i.prototype.clear=function(){return this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this},i.prototype.generateTexture=function(t,e,r){e=e||1;var i=this.getLocalBounds(),n=new s(i.width*e,i.height*e),h=o.fromCanvas(n.canvas,r);return h.baseTexture.resolution=e,n.context.scale(e,e),n.context.translate(-i.x,-i.y),a.renderGraphics(this,n.context),h},i.prototype._renderWebGL=function(t){this.glDirty&&(this.dirty=!0,this.glDirty=!1),t.setObjectRenderer(t.plugins.graphics),t.plugins.graphics.render(this)},i.prototype._renderCanvas=function(t){if(this.isMask!==!0){this._prevTint!==this.tint&&(this.dirty=!0);var e=t.context,r=this.worldTransform,i=t.blendModes[this.blendMode];i!==e.globalCompositeOperation&&(e.globalCompositeOperation=i);var n=t.resolution;e.setTransform(r.a*n,r.b*n,r.c*n,r.d*n,r.tx*n,r.ty*n),a.renderGraphics(this,e)}},i.prototype.getBounds=function(t){if(!this._currentBounds){if(!this.renderable)return l.Rectangle.EMPTY;this.boundsDirty&&(this.updateLocalBounds(),this.glDirty=!0,this.cachedSpriteDirty=!0,this.boundsDirty=!1);var e=this._localBounds,r=e.x,i=e.width+e.x,n=e.y,o=e.height+e.y,s=t||this.worldTransform,a=s.a,h=s.b,u=s.c,c=s.d,p=s.tx,d=s.ty,f=a*i+u*o+p,v=c*o+h*i+d,g=a*r+u*o+p,y=c*o+h*r+d,m=a*r+u*n+p,x=c*n+h*r+d,b=a*i+u*n+p,_=c*n+h*i+d,T=f,E=v,S=f,w=v;S=S>g?g:S,S=S>m?m:S,S=S>b?b:S,w=w>y?y:w,w=w>x?x:w,w=w>_?_:w,T=g>T?g:T,T=m>T?m:T,T=b>T?b:T,E=y>E?y:E,E=x>E?x:E,E=_>E?_:E,this._bounds.x=S,this._bounds.width=T-S,this._bounds.y=w,this._bounds.height=E-w,this._currentBounds=this._bounds}return this._currentBounds},i.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,c);for(var e=this.graphicsData,r=0;r<e.length;r++){var i=e[r];if(i.fill&&i.shape&&i.shape.contains(c.x,c.y))return!0}return!1},i.prototype.updateLocalBounds=function(){var t=1/0,e=-(1/0),r=1/0,i=-(1/0);if(this.graphicsData.length)for(var n,o,s,a,h,l,c=0;c<this.graphicsData.length;c++){var p=this.graphicsData[c],d=p.type,f=p.lineWidth;if(n=p.shape,d===u.SHAPES.RECT||d===u.SHAPES.RREC)s=n.x-f/2,a=n.y-f/2,h=n.width+f,l=n.height+f,t=t>s?s:t,e=s+h>e?s+h:e,r=r>a?a:r,i=a+l>i?a+l:i;else if(d===u.SHAPES.CIRC)s=n.x,a=n.y,h=n.radius+f/2,l=n.radius+f/2,t=t>s-h?s-h:t,e=s+h>e?s+h:e,r=r>a-l?a-l:r,i=a+l>i?a+l:i;else if(d===u.SHAPES.ELIP)s=n.x,a=n.y,h=n.width+f/2,l=n.height+f/2,t=t>s-h?s-h:t,e=s+h>e?s+h:e,r=r>a-l?a-l:r,i=a+l>i?a+l:i;else{o=n.points;for(var v=0;v<o.length;v+=2)s=o[v],a=o[v+1],t=t>s-f?s-f:t,e=s+f>e?s+f:e,r=r>a-f?a-f:r,i=a+f>i?a+f:i}}else t=0,e=0,r=0,i=0;var g=this.boundsPadding;this._localBounds.x=t-g,this._localBounds.width=e-t+2*g,this._localBounds.y=r-g,this._localBounds.height=i-r+2*g},i.prototype.drawShape=function(t){this.currentPath&&this.currentPath.shape.points.length<=2&&this.graphicsData.pop(),this.currentPath=null;var e=new h(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.filling,t);return this.graphicsData.push(e),e.type===u.SHAPES.POLY&&(e.shape.closed=e.shape.closed||this.filling,this.currentPath=e),this.dirty=this.boundsDirty=!0,e},i.prototype.destroy=function(){n.prototype.destroy.apply(this,arguments);for(var t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();for(var e in this._webgl)for(var r=0;r<this._webgl[e].data.length;++r)this._webgl[e].data[r].destroy();this.graphicsData=null,this.currentPath=null,this._webgl=null,this._localBounds=null}},{"../const":22,"../display/Container":23,"../math":33,"../renderers/canvas/utils/CanvasBuffer":45,"../renderers/canvas/utils/CanvasGraphics":46,"../textures/Texture":72,"./GraphicsData":26}],26:[function(t,e,r){function i(t,e,r,i,n,o,s){this.lineWidth=t,this.lineColor=e,this.lineAlpha=r,this._lineTint=e,this.fillColor=i,this.fillAlpha=n,this._fillTint=i,this.fill=o,this.shape=s,this.type=s.type}i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.fill,this.shape)},i.prototype.destroy=function(){this.shape=null}},{}],27:[function(t,e,r){function i(t){a.call(this,t),this.graphicsDataPool=[],this.primitiveShader=null,this.complexPrimitiveShader=null,this.maximumSimplePolySize=200}var n=t("../../utils"),o=t("../../math"),s=t("../../const"),a=t("../../renderers/webgl/utils/ObjectRenderer"),h=t("../../renderers/webgl/WebGLRenderer"),l=t("./WebGLGraphicsData"),u=t("earcut");i.prototype=Object.create(a.prototype),i.prototype.constructor=i,e.exports=i,h.registerPlugin("graphics",i),i.prototype.onContextChange=function(){},i.prototype.destroy=function(){a.prototype.destroy.call(this);for(var t=0;t<this.graphicsDataPool.length;++t)this.graphicsDataPool[t].destroy();this.graphicsDataPool=null},i.prototype.render=function(t){var e,r=this.renderer,i=r.gl,o=r.shaderManager.plugins.primitiveShader;!t.dirty&&t._webGL[i.id]||this.updateGraphics(t);var s=t._webGL[i.id];r.blendModeManager.setBlendMode(t.blendMode);for(var a=0,h=s.data.length;h>a;a++)e=s.data[a],1===s.data[a].mode?(r.stencilManager.pushStencil(t,e),i.uniform1f(r.shaderManager.complexPrimitiveShader.uniforms.alpha._location,t.worldAlpha*e.alpha),i.drawElements(i.TRIANGLE_FAN,4,i.UNSIGNED_SHORT,2*(e.indices.length-4)),r.stencilManager.popStencil(t,e)):(o=r.shaderManager.primitiveShader,r.shaderManager.setShader(o),i.uniformMatrix3fv(o.uniforms.translationMatrix._location,!1,t.worldTransform.toArray(!0)),i.uniformMatrix3fv(o.uniforms.projectionMatrix._location,!1,r.currentRenderTarget.projectionMatrix.toArray(!0)),i.uniform3fv(o.uniforms.tint._location,n.hex2rgb(t.tint)),i.uniform1f(o.uniforms.alpha._location,t.worldAlpha),i.bindBuffer(i.ARRAY_BUFFER,e.buffer),i.vertexAttribPointer(o.attributes.aVertexPosition,2,i.FLOAT,!1,24,0),i.vertexAttribPointer(o.attributes.aColor,4,i.FLOAT,!1,24,8),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.indexBuffer),i.drawElements(i.TRIANGLE_STRIP,e.indices.length,i.UNSIGNED_SHORT,0)),r.drawCount++},i.prototype.updateGraphics=function(t){var e=this.renderer.gl,r=t._webGL[e.id];r||(r=t._webGL[e.id]={lastIndex:0,data:[],gl:e}),t.dirty=!1;var i;if(t.clearDirty){for(t.clearDirty=!1,i=0;i<r.data.length;i++){var n=r.data[i];n.reset(),this.graphicsDataPool.push(n)}r.data=[],r.lastIndex=0}var o;for(i=r.lastIndex;i<t.graphicsData.length;i++){var a=t.graphicsData[i];if(a.type===s.SHAPES.POLY){if(a.points=a.shape.points.slice(),a.shape.closed&&(a.points[0]===a.points[a.points.length-2]&&a.points[1]===a.points[a.points.length-1]||a.points.push(a.points[0],a.points[1])),a.fill&&a.points.length>=6)if(a.points.length<2*this.maximumSimplePolySize){o=this.switchMode(r,0);var h=this.buildPoly(a,o);h||(o=this.switchMode(r,1),this.buildComplexPoly(a,o))}else o=this.switchMode(r,1),this.buildComplexPoly(a,o);a.lineWidth>0&&(o=this.switchMode(r,0),this.buildLine(a,o))}else o=this.switchMode(r,0),a.type===s.SHAPES.RECT?this.buildRectangle(a,o):a.type===s.SHAPES.CIRC||a.type===s.SHAPES.ELIP?this.buildCircle(a,o):a.type===s.SHAPES.RREC&&this.buildRoundedRectangle(a,o);r.lastIndex++}for(i=0;i<r.data.length;i++)o=r.data[i],o.dirty&&o.upload()},i.prototype.switchMode=function(t,e){var r;return t.data.length?(r=t.data[t.data.length-1],(r.points.length>32e4||r.mode!==e||1===e)&&(r=this.graphicsDataPool.pop()||new l(t.gl),r.mode=e,t.data.push(r))):(r=this.graphicsDataPool.pop()||new l(t.gl),r.mode=e,t.data.push(r)),r.dirty=!0,r},i.prototype.buildRectangle=function(t,e){var r=t.shape,i=r.x,o=r.y,s=r.width,a=r.height;if(t.fill){var h=n.hex2rgb(t.fillColor),l=t.fillAlpha,u=h[0]*l,c=h[1]*l,p=h[2]*l,d=e.points,f=e.indices,v=d.length/6;d.push(i,o),d.push(u,c,p,l),d.push(i+s,o),d.push(u,c,p,l),d.push(i,o+a),d.push(u,c,p,l),d.push(i+s,o+a),d.push(u,c,p,l),f.push(v,v,v+1,v+2,v+3,v+3)}if(t.lineWidth){var g=t.points;t.points=[i,o,i+s,o,i+s,o+a,i,o+a,i,o],this.buildLine(t,e),t.points=g}},i.prototype.buildRoundedRectangle=function(t,e){var r=t.shape,i=r.x,o=r.y,s=r.width,a=r.height,h=r.radius,l=[];if(l.push(i,o+h),this.quadraticBezierCurve(i,o+a-h,i,o+a,i+h,o+a,l),this.quadraticBezierCurve(i+s-h,o+a,i+s,o+a,i+s,o+a-h,l),this.quadraticBezierCurve(i+s,o+h,i+s,o,i+s-h,o,l),this.quadraticBezierCurve(i+h,o,i,o,i,o+h+1e-10,l),t.fill){var c=n.hex2rgb(t.fillColor),p=t.fillAlpha,d=c[0]*p,f=c[1]*p,v=c[2]*p,g=e.points,y=e.indices,m=g.length/6,x=u(l,null,2),b=0;for(b=0;b<x.length;b+=3)y.push(x[b]+m),y.push(x[b]+m),y.push(x[b+1]+m),y.push(x[b+2]+m),y.push(x[b+2]+m);for(b=0;b<l.length;b++)g.push(l[b],l[++b],d,f,v,p)}if(t.lineWidth){var _=t.points;t.points=l,this.buildLine(t,e),t.points=_}},i.prototype.quadraticBezierCurve=function(t,e,r,i,n,o,s){function a(t,e,r){var i=e-t;return t+i*r}for(var h,l,u,c,p,d,f=20,v=s||[],g=0,y=0;f>=y;y++)g=y/f,h=a(t,r,g),l=a(e,i,g),u=a(r,n,g),c=a(i,o,g),p=a(h,u,g),d=a(l,c,g),v.push(p,d);return v},i.prototype.buildCircle=function(t,e){var r,i,o=t.shape,a=o.x,h=o.y;t.type===s.SHAPES.CIRC?(r=o.radius,i=o.radius):(r=o.width,i=o.height);var l=Math.floor(30*Math.sqrt(o.radius))||Math.floor(15*Math.sqrt(o.width+o.height)),u=2*Math.PI/l,c=0;if(t.fill){var p=n.hex2rgb(t.fillColor),d=t.fillAlpha,f=p[0]*d,v=p[1]*d,g=p[2]*d,y=e.points,m=e.indices,x=y.length/6;for(m.push(x),c=0;l+1>c;c++)y.push(a,h,f,v,g,d),y.push(a+Math.sin(u*c)*r,h+Math.cos(u*c)*i,f,v,g,d),m.push(x++,x++);m.push(x-1)}if(t.lineWidth){var b=t.points;for(t.points=[],c=0;l+1>c;c++)t.points.push(a+Math.sin(u*c)*r,h+Math.cos(u*c)*i);this.buildLine(t,e),t.points=b}},i.prototype.buildLine=function(t,e){var r=0,i=t.points;if(0!==i.length){var s=new o.Point(i[0],i[1]),a=new o.Point(i[i.length-2],i[i.length-1]);if(s.x===a.x&&s.y===a.y){i=i.slice(),i.pop(),i.pop(),a=new o.Point(i[i.length-2],i[i.length-1]);var h=a.x+.5*(s.x-a.x),l=a.y+.5*(s.y-a.y);i.unshift(h,l),i.push(h,l)}var u,c,p,d,f,v,g,y,m,x,b,_,T,E,S,w,A,C,M,R,O,P,F,D=e.points,B=e.indices,L=i.length/2,I=i.length,N=D.length/6,U=t.lineWidth/2,k=n.hex2rgb(t.lineColor),j=t.lineAlpha,X=k[0]*j,Y=k[1]*j,G=k[2]*j;for(p=i[0],d=i[1],f=i[2],v=i[3],m=-(d-v),x=p-f,F=Math.sqrt(m*m+x*x),m/=F,x/=F,m*=U,x*=U,D.push(p-m,d-x,X,Y,G,j),D.push(p+m,d+x,X,Y,G,j),r=1;L-1>r;r++)p=i[2*(r-1)],d=i[2*(r-1)+1],f=i[2*r],v=i[2*r+1],g=i[2*(r+1)],y=i[2*(r+1)+1],m=-(d-v),x=p-f,F=Math.sqrt(m*m+x*x),m/=F,x/=F,m*=U,x*=U,b=-(v-y),_=f-g,F=Math.sqrt(b*b+_*_),b/=F,_/=F,b*=U,_*=U,S=-x+d-(-x+v),w=-m+f-(-m+p),A=(-m+p)*(-x+v)-(-m+f)*(-x+d),C=-_+y-(-_+v),M=-b+f-(-b+g),R=(-b+g)*(-_+v)-(-b+f)*(-_+y),O=S*M-C*w,Math.abs(O)<.1?(O+=10.1,D.push(f-m,v-x,X,Y,G,j),D.push(f+m,v+x,X,Y,G,j)):(u=(w*R-M*A)/O,c=(C*A-S*R)/O,P=(u-f)*(u-f)+(c-v)*(c-v),P>19600?(T=m-b,E=x-_,F=Math.sqrt(T*T+E*E),T/=F,E/=F,T*=U,E*=U,D.push(f-T,v-E),D.push(X,Y,G,j),D.push(f+T,v+E),D.push(X,Y,G,j),D.push(f-T,v-E),D.push(X,Y,G,j),I++):(D.push(u,c),D.push(X,Y,G,j),D.push(f-(u-f),v-(c-v)),D.push(X,Y,G,j)));for(p=i[2*(L-2)],d=i[2*(L-2)+1],f=i[2*(L-1)],v=i[2*(L-1)+1],m=-(d-v),x=p-f,F=Math.sqrt(m*m+x*x),m/=F,x/=F,m*=U,x*=U,D.push(f-m,v-x),D.push(X,Y,G,j),D.push(f+m,v+x),D.push(X,Y,G,j),B.push(N),r=0;I>r;r++)B.push(N++);B.push(N-1)}},i.prototype.buildComplexPoly=function(t,e){var r=t.points.slice();if(!(r.length<6)){var i=e.indices;e.points=r,e.alpha=t.fillAlpha,e.color=n.hex2rgb(t.fillColor);for(var o,s,a=1/0,h=-(1/0),l=1/0,u=-(1/0),c=0;c<r.length;c+=2)o=r[c],s=r[c+1],a=a>o?o:a,h=o>h?o:h,l=l>s?s:l,u=s>u?s:u;r.push(a,l,h,l,h,u,a,u);var p=r.length/2;for(c=0;p>c;c++)i.push(c)}},i.prototype.buildPoly=function(t,e){var r=t.points;if(!(r.length<6)){var i=e.points,o=e.indices,s=r.length/2,a=n.hex2rgb(t.fillColor),h=t.fillAlpha,l=a[0]*h,c=a[1]*h,p=a[2]*h,d=u(r,null,2);if(!d)return!1;var f=i.length/6,v=0;for(v=0;v<d.length;v+=3)o.push(d[v]+f),o.push(d[v]+f),o.push(d[v+1]+f),o.push(d[v+2]+f),o.push(d[v+2]+f);for(v=0;s>v;v++)i.push(r[2*v],r[2*v+1],l,c,p,h);return!0}}},{"../../const":22,"../../math":33,"../../renderers/webgl/WebGLRenderer":49,"../../renderers/webgl/utils/ObjectRenderer":63,"../../utils":77,"./WebGLGraphicsData":28,earcut:9}],28:[function(t,e,r){function i(t){this.gl=t,this.color=[0,0,0],this.points=[],this.indices=[],this.buffer=t.createBuffer(),this.indexBuffer=t.createBuffer(),this.mode=1,this.alpha=1,this.dirty=!0,this.glPoints=null,this.glIndices=null}i.prototype.constructor=i,e.exports=i,i.prototype.reset=function(){this.points.length=0,this.indices.length=0},i.prototype.upload=function(){var t=this.gl;this.glPoints=new Float32Array(this.points),t.bindBuffer(t.ARRAY_BUFFER,this.buffer),t.bufferData(t.ARRAY_BUFFER,this.glPoints,t.STATIC_DRAW),this.glIndices=new Uint16Array(this.indices),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.glIndices,t.STATIC_DRAW),this.dirty=!1},i.prototype.destroy=function(){this.color=null,this.points=null,this.indices=null,this.gl.deleteBuffer(this.buffer),this.gl.deleteBuffer(this.indexBuffer),this.gl=null,this.buffer=null,this.indexBuffer=null,this.glPoints=null,this.glIndices=null}},{}],29:[function(t,e,r){var i=e.exports=Object.assign(t("./const"),t("./math"),{utils:t("./utils"),ticker:t("./ticker"),DisplayObject:t("./display/DisplayObject"),Container:t("./display/Container"),Sprite:t("./sprites/Sprite"),ParticleContainer:t("./particles/ParticleContainer"),SpriteRenderer:t("./sprites/webgl/SpriteRenderer"),ParticleRenderer:t("./particles/webgl/ParticleRenderer"),Text:t("./text/Text"),Graphics:t("./graphics/Graphics"),GraphicsData:t("./graphics/GraphicsData"),GraphicsRenderer:t("./graphics/webgl/GraphicsRenderer"),Texture:t("./textures/Texture"),BaseTexture:t("./textures/BaseTexture"),RenderTexture:t("./textures/RenderTexture"),VideoBaseTexture:t("./textures/VideoBaseTexture"),TextureUvs:t("./textures/TextureUvs"),CanvasRenderer:t("./renderers/canvas/CanvasRenderer"),CanvasGraphics:t("./renderers/canvas/utils/CanvasGraphics"),CanvasBuffer:t("./renderers/canvas/utils/CanvasBuffer"),WebGLRenderer:t("./renderers/webgl/WebGLRenderer"),WebGLManager:t("./renderers/webgl/managers/WebGLManager"),ShaderManager:t("./renderers/webgl/managers/ShaderManager"),Shader:t("./renderers/webgl/shaders/Shader"),TextureShader:t("./renderers/webgl/shaders/TextureShader"),PrimitiveShader:t("./renderers/webgl/shaders/PrimitiveShader"),ComplexPrimitiveShader:t("./renderers/webgl/shaders/ComplexPrimitiveShader"),ObjectRenderer:t("./renderers/webgl/utils/ObjectRenderer"),RenderTarget:t("./renderers/webgl/utils/RenderTarget"),AbstractFilter:t("./renderers/webgl/filters/AbstractFilter"),FXAAFilter:t("./renderers/webgl/filters/FXAAFilter"),SpriteMaskFilter:t("./renderers/webgl/filters/SpriteMaskFilter"),autoDetectRenderer:function(t,e,r,n){return t=t||800,e=e||600,!n&&i.utils.isWebGLSupported()?new i.WebGLRenderer(t,e,r):new i.CanvasRenderer(t,e,r)}})},{"./const":22,"./display/Container":23,"./display/DisplayObject":24,"./graphics/Graphics":25,"./graphics/GraphicsData":26,"./graphics/webgl/GraphicsRenderer":27,"./math":33,"./particles/ParticleContainer":39,"./particles/webgl/ParticleRenderer":41,"./renderers/canvas/CanvasRenderer":44,"./renderers/canvas/utils/CanvasBuffer":45,"./renderers/canvas/utils/CanvasGraphics":46,"./renderers/webgl/WebGLRenderer":49,"./renderers/webgl/filters/AbstractFilter":50,"./renderers/webgl/filters/FXAAFilter":51,"./renderers/webgl/filters/SpriteMaskFilter":52,"./renderers/webgl/managers/ShaderManager":56,"./renderers/webgl/managers/WebGLManager":58,"./renderers/webgl/shaders/ComplexPrimitiveShader":59,"./renderers/webgl/shaders/PrimitiveShader":60,"./renderers/webgl/shaders/Shader":61,"./renderers/webgl/shaders/TextureShader":62,"./renderers/webgl/utils/ObjectRenderer":63,"./renderers/webgl/utils/RenderTarget":65,"./sprites/Sprite":67,"./sprites/webgl/SpriteRenderer":68,"./text/Text":69,"./textures/BaseTexture":70,"./textures/RenderTexture":71,"./textures/Texture":72,"./textures/TextureUvs":73,"./textures/VideoBaseTexture":74,"./ticker":76,"./utils":77}],30:[function(t,e,r){function i(t){return 0>t?-1:t>0?1:0}function n(){for(var t=0;16>t;t++){var e=[];c.push(e);for(var r=0;16>r;r++)for(var n=i(o[t]*o[r]+a[t]*s[r]),p=i(s[t]*o[r]+h[t]*s[r]),d=i(o[t]*a[r]+a[t]*h[r]),f=i(s[t]*a[r]+h[t]*h[r]),v=0;16>v;v++)if(o[v]===n&&s[v]===p&&a[v]===d&&h[v]===f){e.push(v);break}}for(t=0;16>t;t++){var g=new u;g.set(o[t],s[t],a[t],h[t],0,0),
l.push(g)}}var o=[1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1,0,1],s=[0,1,1,1,0,-1,-1,-1,0,1,1,1,0,-1,-1,-1],a=[0,-1,-1,-1,0,1,1,1,0,1,1,1,0,-1,-1,-1],h=[1,1,0,-1,-1,-1,0,1,-1,-1,0,1,1,1,0,-1],l=[],u=t("./Matrix"),c=[];n();var p={E:0,SE:1,S:2,SW:3,W:4,NW:5,N:6,NE:7,MIRROR_VERTICAL:8,MIRROR_HORIZONTAL:12,uX:function(t){return o[t]},uY:function(t){return s[t]},vX:function(t){return a[t]},vY:function(t){return h[t]},inv:function(t){return 8&t?15&t:7&-t},add:function(t,e){return c[t][e]},sub:function(t,e){return c[t][p.inv(e)]},rotate180:function(t){return 4^t},isSwapWidthHeight:function(t){return 2===(3&t)},byDirection:function(t,e){return 2*Math.abs(t)<=Math.abs(e)?e>=0?p.S:p.N:2*Math.abs(e)<=Math.abs(t)?t>0?p.E:p.W:e>0?t>0?p.SE:p.SW:t>0?p.NE:p.NW},matrixAppendRotationInv:function(t,e,r,i){var n=l[p.inv(e)];r=r||0,i=i||0,n.tx=r,n.ty=i,t.append(n)}};e.exports=p},{"./Matrix":31}],31:[function(t,e,r){function i(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0}var n=t("./Point");i.prototype.constructor=i,e.exports=i,i.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},i.prototype.set=function(t,e,r,i,n,o){return this.a=t,this.b=e,this.c=r,this.d=i,this.tx=n,this.ty=o,this},i.prototype.toArray=function(t,e){this.array||(this.array=new Float32Array(9));var r=e||this.array;return t?(r[0]=this.a,r[1]=this.b,r[2]=0,r[3]=this.c,r[4]=this.d,r[5]=0,r[6]=this.tx,r[7]=this.ty,r[8]=1):(r[0]=this.a,r[1]=this.c,r[2]=this.tx,r[3]=this.b,r[4]=this.d,r[5]=this.ty,r[6]=0,r[7]=0,r[8]=1),r},i.prototype.apply=function(t,e){e=e||new n;var r=t.x,i=t.y;return e.x=this.a*r+this.c*i+this.tx,e.y=this.b*r+this.d*i+this.ty,e},i.prototype.applyInverse=function(t,e){e=e||new n;var r=1/(this.a*this.d+this.c*-this.b),i=t.x,o=t.y;return e.x=this.d*r*i+-this.c*r*o+(this.ty*this.c-this.tx*this.d)*r,e.y=this.a*r*o+-this.b*r*i+(-this.ty*this.a+this.tx*this.b)*r,e},i.prototype.translate=function(t,e){return this.tx+=t,this.ty+=e,this},i.prototype.scale=function(t,e){return this.a*=t,this.d*=e,this.c*=t,this.b*=e,this.tx*=t,this.ty*=e,this},i.prototype.rotate=function(t){var e=Math.cos(t),r=Math.sin(t),i=this.a,n=this.c,o=this.tx;return this.a=i*e-this.b*r,this.b=i*r+this.b*e,this.c=n*e-this.d*r,this.d=n*r+this.d*e,this.tx=o*e-this.ty*r,this.ty=o*r+this.ty*e,this},i.prototype.append=function(t){var e=this.a,r=this.b,i=this.c,n=this.d;return this.a=t.a*e+t.b*i,this.b=t.a*r+t.b*n,this.c=t.c*e+t.d*i,this.d=t.c*r+t.d*n,this.tx=t.tx*e+t.ty*i+this.tx,this.ty=t.tx*r+t.ty*n+this.ty,this},i.prototype.setTransform=function(t,e,r,i,n,o,s,a,h){var l,u,c,p,d,f,v,g,y,m;return d=Math.sin(s),f=Math.cos(s),v=Math.cos(h),g=Math.sin(h),y=-Math.sin(a),m=Math.cos(a),l=f*n,u=d*n,c=-d*o,p=f*o,this.a=v*l+g*c,this.b=v*u+g*p,this.c=y*l+m*c,this.d=y*u+m*p,this.tx=t+(r*l+i*c),this.ty=e+(r*u+i*p),this},i.prototype.prepend=function(t){var e=this.tx;if(1!==t.a||0!==t.b||0!==t.c||1!==t.d){var r=this.a,i=this.c;this.a=r*t.a+this.b*t.c,this.b=r*t.b+this.b*t.d,this.c=i*t.a+this.d*t.c,this.d=i*t.b+this.d*t.d}return this.tx=e*t.a+this.ty*t.c+t.tx,this.ty=e*t.b+this.ty*t.d+t.ty,this},i.prototype.invert=function(){var t=this.a,e=this.b,r=this.c,i=this.d,n=this.tx,o=t*i-e*r;return this.a=i/o,this.b=-e/o,this.c=-r/o,this.d=t/o,this.tx=(r*this.ty-i*n)/o,this.ty=-(t*this.ty-e*n)/o,this},i.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},i.prototype.clone=function(){var t=new i;return t.a=this.a,t.b=this.b,t.c=this.c,t.d=this.d,t.tx=this.tx,t.ty=this.ty,t},i.prototype.copy=function(t){return t.a=this.a,t.b=this.b,t.c=this.c,t.d=this.d,t.tx=this.tx,t.ty=this.ty,t},i.IDENTITY=new i,i.TEMP_MATRIX=new i},{"./Point":32}],32:[function(t,e,r){function i(t,e){this.x=t||0,this.y=e||0}i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.x,this.y)},i.prototype.copy=function(t){this.set(t.x,t.y)},i.prototype.equals=function(t){return t.x===this.x&&t.y===this.y},i.prototype.set=function(t,e){this.x=t||0,this.y=e||(0!==e?this.x:0)}},{}],33:[function(t,e,r){e.exports={Point:t("./Point"),Matrix:t("./Matrix"),GroupD8:t("./GroupD8"),Circle:t("./shapes/Circle"),Ellipse:t("./shapes/Ellipse"),Polygon:t("./shapes/Polygon"),Rectangle:t("./shapes/Rectangle"),RoundedRectangle:t("./shapes/RoundedRectangle")}},{"./GroupD8":30,"./Matrix":31,"./Point":32,"./shapes/Circle":34,"./shapes/Ellipse":35,"./shapes/Polygon":36,"./shapes/Rectangle":37,"./shapes/RoundedRectangle":38}],34:[function(t,e,r){function i(t,e,r){this.x=t||0,this.y=e||0,this.radius=r||0,this.type=o.SHAPES.CIRC}var n=t("./Rectangle"),o=t("../../const");i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.x,this.y,this.radius)},i.prototype.contains=function(t,e){if(this.radius<=0)return!1;var r=this.x-t,i=this.y-e,n=this.radius*this.radius;return r*=r,i*=i,n>=r+i},i.prototype.getBounds=function(){return new n(this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius)}},{"../../const":22,"./Rectangle":37}],35:[function(t,e,r){function i(t,e,r,i){this.x=t||0,this.y=e||0,this.width=r||0,this.height=i||0,this.type=o.SHAPES.ELIP}var n=t("./Rectangle"),o=t("../../const");i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.x,this.y,this.width,this.height)},i.prototype.contains=function(t,e){if(this.width<=0||this.height<=0)return!1;var r=(t-this.x)/this.width,i=(e-this.y)/this.height;return r*=r,i*=i,1>=r+i},i.prototype.getBounds=function(){return new n(this.x-this.width,this.y-this.height,this.width,this.height)}},{"../../const":22,"./Rectangle":37}],36:[function(t,e,r){function i(t){var e=t;if(!Array.isArray(e)){e=new Array(arguments.length);for(var r=0;r<e.length;++r)e[r]=arguments[r]}if(e[0]instanceof n){for(var i=[],s=0,a=e.length;a>s;s++)i.push(e[s].x,e[s].y);e=i}this.closed=!0,this.points=e,this.type=o.SHAPES.POLY}var n=t("../Point"),o=t("../../const");i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.points.slice())},i.prototype.contains=function(t,e){for(var r=!1,i=this.points.length/2,n=0,o=i-1;i>n;o=n++){var s=this.points[2*n],a=this.points[2*n+1],h=this.points[2*o],l=this.points[2*o+1],u=a>e!=l>e&&(h-s)*(e-a)/(l-a)+s>t;u&&(r=!r)}return r}},{"../../const":22,"../Point":32}],37:[function(t,e,r){function i(t,e,r,i){this.x=t||0,this.y=e||0,this.width=r||0,this.height=i||0,this.type=n.SHAPES.RECT}var n=t("../../const");i.prototype.constructor=i,e.exports=i,i.EMPTY=new i(0,0,0,0),i.prototype.clone=function(){return new i(this.x,this.y,this.width,this.height)},i.prototype.contains=function(t,e){return this.width<=0||this.height<=0?!1:t>=this.x&&t<this.x+this.width&&e>=this.y&&e<this.y+this.height}},{"../../const":22}],38:[function(t,e,r){function i(t,e,r,i,o){this.x=t||0,this.y=e||0,this.width=r||0,this.height=i||0,this.radius=o||20,this.type=n.SHAPES.RREC}var n=t("../../const");i.prototype.constructor=i,e.exports=i,i.prototype.clone=function(){return new i(this.x,this.y,this.width,this.height,this.radius)},i.prototype.contains=function(t,e){return this.width<=0||this.height<=0?!1:t>=this.x&&t<=this.x+this.width&&e>=this.y&&e<=this.y+this.height}},{"../../const":22}],39:[function(t,e,r){function i(t,e,r){n.call(this),r=r||15e3,t=t||15e3;var i=16384;r>i&&(r=i),r>t&&(r=t),this._properties=[!1,!0,!1,!1,!1],this._maxSize=t,this._batchSize=r,this._buffers=null,this._bufferToUpdate=0,this.interactiveChildren=!1,this.blendMode=o.BLEND_MODES.NORMAL,this.roundPixels=!0,this.setProperties(e)}var n=t("../display/Container"),o=t("../const");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.setProperties=function(t){t&&(this._properties[0]="scale"in t?!!t.scale:this._properties[0],this._properties[1]="position"in t?!!t.position:this._properties[1],this._properties[2]="rotation"in t?!!t.rotation:this._properties[2],this._properties[3]="uvs"in t?!!t.uvs:this._properties[3],this._properties[4]="alpha"in t?!!t.alpha:this._properties[4])},i.prototype.updateTransform=function(){this.displayObjectUpdateTransform()},i.prototype.renderWebGL=function(t){this.visible&&!(this.worldAlpha<=0)&&this.children.length&&this.renderable&&(t.setObjectRenderer(t.plugins.particle),t.plugins.particle.render(this))},i.prototype.onChildrenChange=function(t){var e=Math.floor(t/this._batchSize);e<this._bufferToUpdate&&(this._bufferToUpdate=e)},i.prototype.renderCanvas=function(t){if(this.visible&&!(this.worldAlpha<=0)&&this.children.length&&this.renderable){var e=t.context,r=this.worldTransform,i=!0,n=0,o=0,s=0,a=0,h=t.blendModes[this.blendMode];h!==e.globalCompositeOperation&&(e.globalCompositeOperation=h),e.globalAlpha=this.worldAlpha,this.displayObjectUpdateTransform();for(var l=0;l<this.children.length;++l){var u=this.children[l];if(u.visible){var c=u.texture.frame;if(e.globalAlpha=this.worldAlpha*u.alpha,u.rotation%(2*Math.PI)===0)i&&(e.setTransform(r.a,r.b,r.c,r.d,r.tx,r.ty),i=!1),n=u.anchor.x*(-c.width*u.scale.x)+u.position.x+.5,o=u.anchor.y*(-c.height*u.scale.y)+u.position.y+.5,s=c.width*u.scale.x,a=c.height*u.scale.y;else{i||(i=!0),u.displayObjectUpdateTransform();var p=u.worldTransform;t.roundPixels?e.setTransform(p.a,p.b,p.c,p.d,0|p.tx,0|p.ty):e.setTransform(p.a,p.b,p.c,p.d,p.tx,p.ty),n=u.anchor.x*-c.width+.5,o=u.anchor.y*-c.height+.5,s=c.width,a=c.height}e.drawImage(u.texture.baseTexture.source,c.x,c.y,c.width,c.height,n,o,s,a)}}}},i.prototype.destroy=function(){if(n.prototype.destroy.apply(this,arguments),this._buffers)for(var t=0;t<this._buffers.length;++t)this._buffers[t].destroy();this._properties=null,this._buffers=null}},{"../const":22,"../display/Container":23}],40:[function(t,e,r){function i(t,e,r,i){this.gl=t,this.vertSize=2,this.vertByteSize=4*this.vertSize,this.size=i,this.dynamicProperties=[],this.staticProperties=[];for(var n=0;n<e.length;n++){var o=e[n];r[n]?this.dynamicProperties.push(o):this.staticProperties.push(o)}this.staticStride=0,this.staticBuffer=null,this.staticData=null,this.dynamicStride=0,this.dynamicBuffer=null,this.dynamicData=null,this.initBuffers()}i.prototype.constructor=i,e.exports=i,i.prototype.initBuffers=function(){var t,e,r=this.gl,i=0;for(this.dynamicStride=0,t=0;t<this.dynamicProperties.length;t++)e=this.dynamicProperties[t],e.offset=i,i+=e.size,this.dynamicStride+=e.size;this.dynamicData=new Float32Array(this.size*this.dynamicStride*4),this.dynamicBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.dynamicBuffer),r.bufferData(r.ARRAY_BUFFER,this.dynamicData,r.DYNAMIC_DRAW);var n=0;for(this.staticStride=0,t=0;t<this.staticProperties.length;t++)e=this.staticProperties[t],e.offset=n,n+=e.size,this.staticStride+=e.size;this.staticData=new Float32Array(this.size*this.staticStride*4),this.staticBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.staticBuffer),r.bufferData(r.ARRAY_BUFFER,this.staticData,r.DYNAMIC_DRAW)},i.prototype.uploadDynamic=function(t,e,r){for(var i=this.gl,n=0;n<this.dynamicProperties.length;n++){var o=this.dynamicProperties[n];o.uploadFunction(t,e,r,this.dynamicData,this.dynamicStride,o.offset)}i.bindBuffer(i.ARRAY_BUFFER,this.dynamicBuffer),i.bufferSubData(i.ARRAY_BUFFER,0,this.dynamicData)},i.prototype.uploadStatic=function(t,e,r){for(var i=this.gl,n=0;n<this.staticProperties.length;n++){var o=this.staticProperties[n];o.uploadFunction(t,e,r,this.staticData,this.staticStride,o.offset)}i.bindBuffer(i.ARRAY_BUFFER,this.staticBuffer),i.bufferSubData(i.ARRAY_BUFFER,0,this.staticData)},i.prototype.bind=function(){var t,e,r=this.gl;for(r.bindBuffer(r.ARRAY_BUFFER,this.dynamicBuffer),t=0;t<this.dynamicProperties.length;t++)e=this.dynamicProperties[t],r.vertexAttribPointer(e.attribute,e.size,r.FLOAT,!1,4*this.dynamicStride,4*e.offset);for(r.bindBuffer(r.ARRAY_BUFFER,this.staticBuffer),t=0;t<this.staticProperties.length;t++)e=this.staticProperties[t],r.vertexAttribPointer(e.attribute,e.size,r.FLOAT,!1,4*this.staticStride,4*e.offset)},i.prototype.destroy=function(){this.dynamicProperties=null,this.dynamicData=null,this.gl.deleteBuffer(this.dynamicBuffer),this.staticProperties=null,this.staticData=null,this.gl.deleteBuffer(this.staticBuffer)}},{}],41:[function(t,e,r){function i(t){n.call(this,t);var e=98304;this.indices=new Uint16Array(e);for(var r=0,i=0;e>r;r+=6,i+=4)this.indices[r+0]=i+0,this.indices[r+1]=i+1,this.indices[r+2]=i+2,this.indices[r+3]=i+0,this.indices[r+4]=i+2,this.indices[r+5]=i+3;this.shader=null,this.indexBuffer=null,this.properties=null,this.tempMatrix=new h.Matrix}var n=t("../../renderers/webgl/utils/ObjectRenderer"),o=t("../../renderers/webgl/WebGLRenderer"),s=t("./ParticleShader"),a=t("./ParticleBuffer"),h=t("../../math");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,o.registerPlugin("particle",i),i.prototype.onContextChange=function(){var t=this.renderer.gl;this.shader=new s(this.renderer.shaderManager),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.indices,t.STATIC_DRAW),this.properties=[{attribute:this.shader.attributes.aVertexPosition,size:2,uploadFunction:this.uploadVertices,offset:0},{attribute:this.shader.attributes.aPositionCoord,size:2,uploadFunction:this.uploadPosition,offset:0},{attribute:this.shader.attributes.aRotation,size:1,uploadFunction:this.uploadRotation,offset:0},{attribute:this.shader.attributes.aTextureCoord,size:2,uploadFunction:this.uploadUvs,offset:0},{attribute:this.shader.attributes.aColor,size:1,uploadFunction:this.uploadAlpha,offset:0}]},i.prototype.start=function(){var t=this.renderer.gl;t.activeTexture(t.TEXTURE0),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var e=this.shader;this.renderer.shaderManager.setShader(e)},i.prototype.render=function(t){var e=t.children,r=e.length,i=t._maxSize,n=t._batchSize;if(0!==r){r>i&&(r=i),t._buffers||(t._buffers=this.generateBuffers(t)),this.renderer.blendModeManager.setBlendMode(t.blendMode);var o=this.renderer.gl,s=t.worldTransform.copy(this.tempMatrix);s.prepend(this.renderer.currentRenderTarget.projectionMatrix),o.uniformMatrix3fv(this.shader.uniforms.projectionMatrix._location,!1,s.toArray(!0)),o.uniform1f(this.shader.uniforms.uAlpha._location,t.worldAlpha);var a=e[0]._texture.baseTexture;if(a._glTextures[o.id])o.bindTexture(o.TEXTURE_2D,a._glTextures[o.id]);else{if(!this.renderer.updateTexture(a))return;t._properties[0]&&t._properties[3]||(t._bufferToUpdate=0)}for(var h=0,l=0;r>h;h+=n,l+=1){var u=r-h;u>n&&(u=n);var c=t._buffers[l];c.uploadDynamic(e,h,u),t._bufferToUpdate===l&&(c.uploadStatic(e,h,u),t._bufferToUpdate=l+1),c.bind(this.shader),o.drawElements(o.TRIANGLES,6*u,o.UNSIGNED_SHORT,0),this.renderer.drawCount++}}},i.prototype.generateBuffers=function(t){var e,r=this.renderer.gl,i=[],n=t._maxSize,o=t._batchSize,s=t._properties;for(e=0;n>e;e+=o)i.push(new a(r,this.properties,s,o));return i},i.prototype.uploadVertices=function(t,e,r,i,n,o){for(var s,a,h,l,u,c,p,d,f,v=0;r>v;v++)s=t[e+v],a=s._texture,l=s.scale.x,u=s.scale.y,a.trim?(h=a.trim,p=h.x-s.anchor.x*h.width,c=p+a.crop.width,f=h.y-s.anchor.y*h.height,d=f+a.crop.height):(c=a._frame.width*(1-s.anchor.x),p=a._frame.width*-s.anchor.x,d=a._frame.height*(1-s.anchor.y),f=a._frame.height*-s.anchor.y),i[o]=p*l,i[o+1]=f*u,i[o+n]=c*l,i[o+n+1]=f*u,i[o+2*n]=c*l,i[o+2*n+1]=d*u,i[o+3*n]=p*l,i[o+3*n+1]=d*u,o+=4*n},i.prototype.uploadPosition=function(t,e,r,i,n,o){for(var s=0;r>s;s++){var a=t[e+s].position;i[o]=a.x,i[o+1]=a.y,i[o+n]=a.x,i[o+n+1]=a.y,i[o+2*n]=a.x,i[o+2*n+1]=a.y,i[o+3*n]=a.x,i[o+3*n+1]=a.y,o+=4*n}},i.prototype.uploadRotation=function(t,e,r,i,n,o){for(var s=0;r>s;s++){var a=t[e+s].rotation;i[o]=a,i[o+n]=a,i[o+2*n]=a,i[o+3*n]=a,o+=4*n}},i.prototype.uploadUvs=function(t,e,r,i,n,o){for(var s=0;r>s;s++){var a=t[e+s]._texture._uvs;a?(i[o]=a.x0,i[o+1]=a.y0,i[o+n]=a.x1,i[o+n+1]=a.y1,i[o+2*n]=a.x2,i[o+2*n+1]=a.y2,i[o+3*n]=a.x3,i[o+3*n+1]=a.y3,o+=4*n):(i[o]=0,i[o+1]=0,i[o+n]=0,i[o+n+1]=0,i[o+2*n]=0,i[o+2*n+1]=0,i[o+3*n]=0,i[o+3*n+1]=0,o+=4*n)}},i.prototype.uploadAlpha=function(t,e,r,i,n,o){for(var s=0;r>s;s++){var a=t[e+s].alpha;i[o]=a,i[o+n]=a,i[o+2*n]=a,i[o+3*n]=a,o+=4*n}},i.prototype.destroy=function(){this.renderer.gl&&this.renderer.gl.deleteBuffer(this.indexBuffer),n.prototype.destroy.apply(this,arguments),this.shader.destroy(),this.indices=null,this.tempMatrix=null}},{"../../math":33,"../../renderers/webgl/WebGLRenderer":49,"../../renderers/webgl/utils/ObjectRenderer":63,"./ParticleBuffer":40,"./ParticleShader":42}],42:[function(t,e,r){function i(t){n.call(this,t,["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute float aColor;","attribute vec2 aPositionCoord;","attribute vec2 aScale;","attribute float aRotation;","uniform mat3 projectionMatrix;","varying vec2 vTextureCoord;","varying float vColor;","void main(void){","   vec2 v = aVertexPosition;","   v.x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);","   v.y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);","   v = v + aPositionCoord;","   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"].join("\n"),["precision lowp float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","uniform float uAlpha;","void main(void){","  vec4 color = texture2D(uSampler, vTextureCoord) * vColor * uAlpha;","  if (color.a == 0.0) discard;","  gl_FragColor = color;","}"].join("\n"),{uAlpha:{type:"1f",value:1}},{aPositionCoord:0,aRotation:0})}var n=t("../../renderers/webgl/shaders/TextureShader");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i},{"../../renderers/webgl/shaders/TextureShader":62}],43:[function(t,e,r){function i(t,e,r,i){if(a.call(this),n.sayHello(t),i)for(var h in s.DEFAULT_RENDER_OPTIONS)"undefined"==typeof i[h]&&(i[h]=s.DEFAULT_RENDER_OPTIONS[h]);else i=s.DEFAULT_RENDER_OPTIONS;this.type=s.RENDERER_TYPE.UNKNOWN,this.width=e||800,this.height=r||600,this.view=i.view||document.createElement("canvas"),this.resolution=i.resolution,this.transparent=i.transparent,this.autoResize=i.autoResize||!1,this.blendModes=null,this.preserveDrawingBuffer=i.preserveDrawingBuffer,this.clearBeforeRender=i.clearBeforeRender,this.roundPixels=i.roundPixels,this._backgroundColor=0,this._backgroundColorRgb=[0,0,0],this._backgroundColorString="#000000",this.backgroundColor=i.backgroundColor||this._backgroundColor,this._tempDisplayObjectParent={worldTransform:new o.Matrix,worldAlpha:1,children:[]},this._lastObjectRendered=this._tempDisplayObjectParent}var n=t("../utils"),o=t("../math"),s=t("../const"),a=t("eventemitter3");i.prototype=Object.create(a.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{backgroundColor:{get:function(){return this._backgroundColor},set:function(t){this._backgroundColor=t,this._backgroundColorString=n.hex2string(t),n.hex2rgb(t,this._backgroundColorRgb)}}}),i.prototype.resize=function(t,e){this.width=t*this.resolution,this.height=e*this.resolution,this.view.width=this.width,this.view.height=this.height,this.autoResize&&(this.view.style.width=this.width/this.resolution+"px",this.view.style.height=this.height/this.resolution+"px")},i.prototype.destroy=function(t){t&&this.view.parentNode&&this.view.parentNode.removeChild(this.view),this.type=s.RENDERER_TYPE.UNKNOWN,this.width=0,this.height=0,this.view=null,this.resolution=0,this.transparent=!1,this.autoResize=!1,this.blendModes=null,this.preserveDrawingBuffer=!1,this.clearBeforeRender=!1,this.roundPixels=!1,this._backgroundColor=0,this._backgroundColorRgb=null,this._backgroundColorString=null}},{"../const":22,"../math":33,"../utils":77,eventemitter3:10}],44:[function(t,e,r){function i(t,e,r){r=r||{},n.call(this,"Canvas",t,e,r),this.type=h.RENDERER_TYPE.CANVAS,this.context=this.view.getContext("2d",{alpha:this.transparent}),this.refresh=!0,this.maskManager=new o,this.smoothProperty="imageSmoothingEnabled",this.context.imageSmoothingEnabled||(this.context.webkitImageSmoothingEnabled?this.smoothProperty="webkitImageSmoothingEnabled":this.context.mozImageSmoothingEnabled?this.smoothProperty="mozImageSmoothingEnabled":this.context.oImageSmoothingEnabled?this.smoothProperty="oImageSmoothingEnabled":this.context.msImageSmoothingEnabled&&(this.smoothProperty="msImageSmoothingEnabled")),this.initPlugins(),this._mapBlendModes(),this._tempDisplayObjectParent={worldTransform:new a.Matrix,worldAlpha:1},this.resize(t,e)}var n=t("../SystemRenderer"),o=t("./utils/CanvasMaskManager"),s=t("../../utils"),a=t("../../math"),h=t("../../const");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,s.pluginTarget.mixin(i),i.prototype.render=function(t){this.emit("prerender");var e=t.parent;this._lastObjectRendered=t,t.parent=this._tempDisplayObjectParent,t.updateTransform(),t.parent=e,this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,this.context.globalCompositeOperation=this.blendModes[h.BLEND_MODES.NORMAL],navigator.isCocoonJS&&this.view.screencanvas&&(this.context.fillStyle="black",this.context.clear()),this.clearBeforeRender&&(this.transparent?this.context.clearRect(0,0,this.width,this.height):(this.context.fillStyle=this._backgroundColorString,this.context.fillRect(0,0,this.width,this.height))),this.renderDisplayObject(t,this.context),this.emit("postrender")},i.prototype.destroy=function(t){this.destroyPlugins(),n.prototype.destroy.call(this,t),this.context=null,this.refresh=!0,this.maskManager.destroy(),this.maskManager=null,this.smoothProperty=null},i.prototype.renderDisplayObject=function(t,e){var r=this.context;this.context=e,t.renderCanvas(this),this.context=r},i.prototype.resize=function(t,e){n.prototype.resize.call(this,t,e),this.smoothProperty&&(this.context[this.smoothProperty]=h.SCALE_MODES.DEFAULT===h.SCALE_MODES.LINEAR)},i.prototype._mapBlendModes=function(){this.blendModes||(this.blendModes={},s.canUseNewCanvasBlendModes()?(this.blendModes[h.BLEND_MODES.NORMAL]="source-over",this.blendModes[h.BLEND_MODES.ADD]="lighter",this.blendModes[h.BLEND_MODES.MULTIPLY]="multiply",this.blendModes[h.BLEND_MODES.SCREEN]="screen",this.blendModes[h.BLEND_MODES.OVERLAY]="overlay",this.blendModes[h.BLEND_MODES.DARKEN]="darken",this.blendModes[h.BLEND_MODES.LIGHTEN]="lighten",this.blendModes[h.BLEND_MODES.COLOR_DODGE]="color-dodge",this.blendModes[h.BLEND_MODES.COLOR_BURN]="color-burn",this.blendModes[h.BLEND_MODES.HARD_LIGHT]="hard-light",this.blendModes[h.BLEND_MODES.SOFT_LIGHT]="soft-light",this.blendModes[h.BLEND_MODES.DIFFERENCE]="difference",this.blendModes[h.BLEND_MODES.EXCLUSION]="exclusion",this.blendModes[h.BLEND_MODES.HUE]="hue",this.blendModes[h.BLEND_MODES.SATURATION]="saturate",this.blendModes[h.BLEND_MODES.COLOR]="color",this.blendModes[h.BLEND_MODES.LUMINOSITY]="luminosity"):(this.blendModes[h.BLEND_MODES.NORMAL]="source-over",this.blendModes[h.BLEND_MODES.ADD]="lighter",this.blendModes[h.BLEND_MODES.MULTIPLY]="source-over",this.blendModes[h.BLEND_MODES.SCREEN]="source-over",this.blendModes[h.BLEND_MODES.OVERLAY]="source-over",this.blendModes[h.BLEND_MODES.DARKEN]="source-over",this.blendModes[h.BLEND_MODES.LIGHTEN]="source-over",this.blendModes[h.BLEND_MODES.COLOR_DODGE]="source-over",this.blendModes[h.BLEND_MODES.COLOR_BURN]="source-over",this.blendModes[h.BLEND_MODES.HARD_LIGHT]="source-over",this.blendModes[h.BLEND_MODES.SOFT_LIGHT]="source-over",this.blendModes[h.BLEND_MODES.DIFFERENCE]="source-over",this.blendModes[h.BLEND_MODES.EXCLUSION]="source-over",this.blendModes[h.BLEND_MODES.HUE]="source-over",this.blendModes[h.BLEND_MODES.SATURATION]="source-over",this.blendModes[h.BLEND_MODES.COLOR]="source-over",this.blendModes[h.BLEND_MODES.LUMINOSITY]="source-over"))}},{"../../const":22,"../../math":33,"../../utils":77,"../SystemRenderer":43,"./utils/CanvasMaskManager":47}],45:[function(t,e,r){function i(t,e){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.width=t,this.canvas.height=e}i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{width:{get:function(){return this.canvas.width},set:function(t){this.canvas.width=t}},height:{get:function(){return this.canvas.height},set:function(t){this.canvas.height=t}}}),i.prototype.clear=function(){this.context.setTransform(1,0,0,1,0,0),this.context.clearRect(0,0,this.canvas.width,this.canvas.height)},i.prototype.resize=function(t,e){this.canvas.width=t,this.canvas.height=e},i.prototype.destroy=function(){this.context=null,this.canvas=null}},{}],46:[function(t,e,r){var i=t("../../../const"),n={};e.exports=n,n.renderGraphics=function(t,e){var r=t.worldAlpha;t.dirty&&(this.updateGraphicsTint(t),t.dirty=!1);for(var n=0;n<t.graphicsData.length;n++){var o=t.graphicsData[n],s=o.shape,a=o._fillTint,h=o._lineTint;if(e.lineWidth=o.lineWidth,o.type===i.SHAPES.POLY){e.beginPath();var l=s.points;e.moveTo(l[0],l[1]);for(var u=1;u<l.length/2;u++)e.lineTo(l[2*u],l[2*u+1]);s.closed&&e.lineTo(l[0],l[1]),l[0]===l[l.length-2]&&l[1]===l[l.length-1]&&e.closePath(),o.fill&&(e.globalAlpha=o.fillAlpha*r,e.fillStyle="#"+("00000"+(0|a).toString(16)).substr(-6),e.fill()),o.lineWidth&&(e.globalAlpha=o.lineAlpha*r,e.strokeStyle="#"+("00000"+(0|h).toString(16)).substr(-6),e.stroke())}else if(o.type===i.SHAPES.RECT)(o.fillColor||0===o.fillColor)&&(e.globalAlpha=o.fillAlpha*r,e.fillStyle="#"+("00000"+(0|a).toString(16)).substr(-6),e.fillRect(s.x,s.y,s.width,s.height)),o.lineWidth&&(e.globalAlpha=o.lineAlpha*r,e.strokeStyle="#"+("00000"+(0|h).toString(16)).substr(-6),e.strokeRect(s.x,s.y,s.width,s.height));else if(o.type===i.SHAPES.CIRC)e.beginPath(),e.arc(s.x,s.y,s.radius,0,2*Math.PI),e.closePath(),o.fill&&(e.globalAlpha=o.fillAlpha*r,e.fillStyle="#"+("00000"+(0|a).toString(16)).substr(-6),e.fill()),o.lineWidth&&(e.globalAlpha=o.lineAlpha*r,e.strokeStyle="#"+("00000"+(0|h).toString(16)).substr(-6),e.stroke());else if(o.type===i.SHAPES.ELIP){var c=2*s.width,p=2*s.height,d=s.x-c/2,f=s.y-p/2;e.beginPath();var v=.5522848,g=c/2*v,y=p/2*v,m=d+c,x=f+p,b=d+c/2,_=f+p/2;e.moveTo(d,_),e.bezierCurveTo(d,_-y,b-g,f,b,f),e.bezierCurveTo(b+g,f,m,_-y,m,_),e.bezierCurveTo(m,_+y,b+g,x,b,x),e.bezierCurveTo(b-g,x,d,_+y,d,_),e.closePath(),o.fill&&(e.globalAlpha=o.fillAlpha*r,e.fillStyle="#"+("00000"+(0|a).toString(16)).substr(-6),e.fill()),o.lineWidth&&(e.globalAlpha=o.lineAlpha*r,e.strokeStyle="#"+("00000"+(0|h).toString(16)).substr(-6),e.stroke())}else if(o.type===i.SHAPES.RREC){var T=s.x,E=s.y,S=s.width,w=s.height,A=s.radius,C=Math.min(S,w)/2|0;A=A>C?C:A,e.beginPath(),e.moveTo(T,E+A),e.lineTo(T,E+w-A),e.quadraticCurveTo(T,E+w,T+A,E+w),e.lineTo(T+S-A,E+w),e.quadraticCurveTo(T+S,E+w,T+S,E+w-A),e.lineTo(T+S,E+A),e.quadraticCurveTo(T+S,E,T+S-A,E),e.lineTo(T+A,E),e.quadraticCurveTo(T,E,T,E+A),e.closePath(),(o.fillColor||0===o.fillColor)&&(e.globalAlpha=o.fillAlpha*r,e.fillStyle="#"+("00000"+(0|a).toString(16)).substr(-6),e.fill()),o.lineWidth&&(e.globalAlpha=o.lineAlpha*r,e.strokeStyle="#"+("00000"+(0|h).toString(16)).substr(-6),e.stroke())}}},n.renderGraphicsMask=function(t,e){var r=t.graphicsData.length;if(0!==r){e.beginPath();for(var n=0;r>n;n++){var o=t.graphicsData[n],s=o.shape;if(o.type===i.SHAPES.POLY){var a=s.points;e.moveTo(a[0],a[1]);for(var h=1;h<a.length/2;h++)e.lineTo(a[2*h],a[2*h+1]);a[0]===a[a.length-2]&&a[1]===a[a.length-1]&&e.closePath()}else if(o.type===i.SHAPES.RECT)e.rect(s.x,s.y,s.width,s.height),e.closePath();else if(o.type===i.SHAPES.CIRC)e.arc(s.x,s.y,s.radius,0,2*Math.PI),e.closePath();else if(o.type===i.SHAPES.ELIP){var l=2*s.width,u=2*s.height,c=s.x-l/2,p=s.y-u/2,d=.5522848,f=l/2*d,v=u/2*d,g=c+l,y=p+u,m=c+l/2,x=p+u/2;e.moveTo(c,x),e.bezierCurveTo(c,x-v,m-f,p,m,p),e.bezierCurveTo(m+f,p,g,x-v,g,x),e.bezierCurveTo(g,x+v,m+f,y,m,y),e.bezierCurveTo(m-f,y,c,x+v,c,x),e.closePath()}else if(o.type===i.SHAPES.RREC){var b=s.x,_=s.y,T=s.width,E=s.height,S=s.radius,w=Math.min(T,E)/2|0;S=S>w?w:S,e.moveTo(b,_+S),e.lineTo(b,_+E-S),e.quadraticCurveTo(b,_+E,b+S,_+E),e.lineTo(b+T-S,_+E),e.quadraticCurveTo(b+T,_+E,b+T,_+E-S),e.lineTo(b+T,_+S),e.quadraticCurveTo(b+T,_,b+T-S,_),e.lineTo(b+S,_),e.quadraticCurveTo(b,_,b,_+S),e.closePath()}}}},n.updateGraphicsTint=function(t){if(16777215!==t.tint||t._prevTint!==t.tint){t._prevTint=t.tint;for(var e=(t.tint>>16&255)/255,r=(t.tint>>8&255)/255,i=(255&t.tint)/255,n=0;n<t.graphicsData.length;n++){var o=t.graphicsData[n],s=0|o.fillColor,a=0|o.lineColor;o._fillTint=((s>>16&255)/255*e*255<<16)+((s>>8&255)/255*r*255<<8)+(255&s)/255*i*255,o._lineTint=((a>>16&255)/255*e*255<<16)+((a>>8&255)/255*r*255<<8)+(255&a)/255*i*255}}}},{"../../../const":22}],47:[function(t,e,r){function i(){}var n=t("./CanvasGraphics");i.prototype.constructor=i,e.exports=i,i.prototype.pushMask=function(t,e){e.context.save();var r=t.alpha,i=t.worldTransform,o=e.resolution;e.context.setTransform(i.a*o,i.b*o,i.c*o,i.d*o,i.tx*o,i.ty*o),t.texture||(n.renderGraphicsMask(t,e.context),e.context.clip()),t.worldAlpha=r},i.prototype.popMask=function(t){t.context.restore()},i.prototype.destroy=function(){}},{"./CanvasGraphics":46}],48:[function(t,e,r){var i=t("../../../utils"),n={};e.exports=n,n.getTintedTexture=function(t,e){var r=t.texture;e=n.roundColor(e);var i="#"+("00000"+(0|e).toString(16)).substr(-6);if(r.tintCache=r.tintCache||{},r.tintCache[i])return r.tintCache[i];var o=n.canvas||document.createElement("canvas");if(n.tintMethod(r,e,o),n.convertTintToImage){var s=new Image;s.src=o.toDataURL(),r.tintCache[i]=s}else r.tintCache[i]=o,n.canvas=null;return o},n.tintWithMultiply=function(t,e,r){var i=r.getContext("2d"),n=t.baseTexture.resolution,o=t.crop.clone();o.x*=n,o.y*=n,o.width*=n,o.height*=n,r.width=o.width,r.height=o.height,i.fillStyle="#"+("00000"+(0|e).toString(16)).substr(-6),i.fillRect(0,0,o.width,o.height),i.globalCompositeOperation="multiply",i.drawImage(t.baseTexture.source,o.x,o.y,o.width,o.height,0,0,o.width,o.height),i.globalCompositeOperation="destination-atop",i.drawImage(t.baseTexture.source,o.x,o.y,o.width,o.height,0,0,o.width,o.height)},n.tintWithOverlay=function(t,e,r){var i=r.getContext("2d"),n=t.baseTexture.resolution,o=t.crop.clone();o.x*=n,o.y*=n,o.width*=n,o.height*=n,r.width=o.width,r.height=o.height,i.globalCompositeOperation="copy",i.fillStyle="#"+("00000"+(0|e).toString(16)).substr(-6),i.fillRect(0,0,o.width,o.height),i.globalCompositeOperation="destination-atop",i.drawImage(t.baseTexture.source,o.x,o.y,o.width,o.height,0,0,o.width,o.height)},n.tintWithPerPixel=function(t,e,r){var n=r.getContext("2d"),o=t.baseTexture.resolution,s=t.crop.clone();s.x*=o,s.y*=o,s.width*=o,s.height*=o,r.width=s.width,r.height=s.height,n.globalCompositeOperation="copy",n.drawImage(t.baseTexture.source,s.x,s.y,s.width,s.height,0,0,s.width,s.height);for(var a=i.hex2rgb(e),h=a[0],l=a[1],u=a[2],c=n.getImageData(0,0,s.width,s.height),p=c.data,d=0;d<p.length;d+=4)p[d+0]*=h,p[d+1]*=l,p[d+2]*=u;n.putImageData(c,0,0)},n.roundColor=function(t){var e=n.cacheStepsPerColorChannel,r=i.hex2rgb(t);return r[0]=Math.min(255,r[0]/e*e),r[1]=Math.min(255,r[1]/e*e),r[2]=Math.min(255,r[2]/e*e),i.rgb2hex(r)},n.cacheStepsPerColorChannel=8,n.convertTintToImage=!1,n.canUseMultiply=i.canUseNewCanvasBlendModes(),n.tintMethod=n.canUseMultiply?n.tintWithMultiply:n.tintWithPerPixel},{"../../../utils":77}],49:[function(t,e,r){function i(t,e,r){r=r||{},n.call(this,"WebGL",t,e,r),this.type=f.RENDERER_TYPE.WEBGL,this.handleContextLost=this.handleContextLost.bind(this),this.handleContextRestored=this.handleContextRestored.bind(this),this.view.addEventListener("webglcontextlost",this.handleContextLost,!1),this.view.addEventListener("webglcontextrestored",this.handleContextRestored,!1),this._useFXAA=!!r.forceFXAA&&r.antialias,this._FXAAFilter=null,this._contextOptions={alpha:this.transparent,antialias:r.antialias,premultipliedAlpha:this.transparent&&"notMultiplied"!==this.transparent,stencil:!0,preserveDrawingBuffer:r.preserveDrawingBuffer},this.drawCount=0,this.shaderManager=new o(this),this.maskManager=new s(this),this.stencilManager=new a(this),
this.filterManager=new h(this),this.blendModeManager=new l(this),this.currentRenderTarget=null,this.currentRenderer=new c(this),this.initPlugins(),this._createContext(),this._initContext(),this._mapGlModes(),this._managedTextures=[],this._renderTargetStack=[]}var n=t("../SystemRenderer"),o=t("./managers/ShaderManager"),s=t("./managers/MaskManager"),a=t("./managers/StencilManager"),h=t("./managers/FilterManager"),l=t("./managers/BlendModeManager"),u=t("./utils/RenderTarget"),c=t("./utils/ObjectRenderer"),p=t("./filters/FXAAFilter"),d=t("../../utils"),f=t("../../const");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,d.pluginTarget.mixin(i),i.glContextId=0,i.prototype._createContext=function(){var t=this.view.getContext("webgl",this._contextOptions)||this.view.getContext("experimental-webgl",this._contextOptions);if(this.gl=t,!t)throw new Error("This browser does not support webGL. Try using the canvas renderer");this.glContextId=i.glContextId++,t.id=this.glContextId,t.renderer=this},i.prototype._initContext=function(){var t=this.gl;t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.enable(t.BLEND),this.renderTarget=new u(t,this.width,this.height,null,this.resolution,!0),this.setRenderTarget(this.renderTarget),this.emit("context",t),this.resize(this.width,this.height),this._useFXAA||(this._useFXAA=this._contextOptions.antialias&&!t.getContextAttributes().antialias),this._useFXAA&&(window.console.warn("FXAA antialiasing being used instead of native antialiasing"),this._FXAAFilter=[new p])},i.prototype.render=function(t){if(this.emit("prerender"),!this.gl.isContextLost()){this.drawCount=0,this._lastObjectRendered=t,this._useFXAA&&(this._FXAAFilter[0].uniforms.resolution.value.x=this.width,this._FXAAFilter[0].uniforms.resolution.value.y=this.height,t.filterArea=this.renderTarget.size,t.filters=this._FXAAFilter);var e=t.parent;t.parent=this._tempDisplayObjectParent,t.updateTransform(),t.parent=e;var r=this.gl;this.setRenderTarget(this.renderTarget),this.clearBeforeRender&&(this.transparent?r.clearColor(0,0,0,0):r.clearColor(this._backgroundColorRgb[0],this._backgroundColorRgb[1],this._backgroundColorRgb[2],1),r.clear(r.COLOR_BUFFER_BIT)),this.renderDisplayObject(t,this.renderTarget),this.emit("postrender")}},i.prototype.renderDisplayObject=function(t,e,r){this.setRenderTarget(e),r&&e.clear(),this.filterManager.setFilterStack(e.filterStack),t.renderWebGL(this),this.currentRenderer.flush()},i.prototype.setObjectRenderer=function(t){this.currentRenderer!==t&&(this.currentRenderer.stop(),this.currentRenderer=t,this.currentRenderer.start())},i.prototype.setRenderTarget=function(t){this.currentRenderTarget!==t&&(this.currentRenderTarget=t,this.currentRenderTarget.activate(),this.stencilManager.setMaskStack(t.stencilMaskStack))},i.prototype.resize=function(t,e){n.prototype.resize.call(this,t,e),this.filterManager.resize(t,e),this.renderTarget.resize(t,e),this.currentRenderTarget===this.renderTarget&&(this.renderTarget.activate(),this.gl.viewport(0,0,this.width,this.height))},i.prototype.updateTexture=function(t){if(t=t.baseTexture||t,t.hasLoaded){var e=this.gl;return t._glTextures[e.id]||(t._glTextures[e.id]=e.createTexture(),t.on("update",this.updateTexture,this),t.on("dispose",this.destroyTexture,this),this._managedTextures.push(t)),e.bindTexture(e.TEXTURE_2D,t._glTextures[e.id]),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultipliedAlpha),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t.source),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,t.scaleMode===f.SCALE_MODES.LINEAR?e.LINEAR:e.NEAREST),t.mipmap&&t.isPowerOfTwo?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t.scaleMode===f.SCALE_MODES.LINEAR?e.LINEAR_MIPMAP_LINEAR:e.NEAREST_MIPMAP_NEAREST),e.generateMipmap(e.TEXTURE_2D)):e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t.scaleMode===f.SCALE_MODES.LINEAR?e.LINEAR:e.NEAREST),t.isPowerOfTwo?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT)):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)),t._glTextures[e.id]}},i.prototype.destroyTexture=function(t,e){if(t=t.baseTexture||t,t.hasLoaded&&t._glTextures[this.gl.id]&&(this.gl.deleteTexture(t._glTextures[this.gl.id]),delete t._glTextures[this.gl.id],!e)){var r=this._managedTextures.indexOf(t);-1!==r&&d.removeItems(this._managedTextures,r,1)}},i.prototype.handleContextLost=function(t){t.preventDefault()},i.prototype.handleContextRestored=function(){this._initContext();for(var t=0;t<this._managedTextures.length;++t){var e=this._managedTextures[t];e._glTextures[this.gl.id]&&delete e._glTextures[this.gl.id]}},i.prototype.destroy=function(t){this.destroyPlugins(),this.view.removeEventListener("webglcontextlost",this.handleContextLost),this.view.removeEventListener("webglcontextrestored",this.handleContextRestored);for(var e=0;e<this._managedTextures.length;++e){var r=this._managedTextures[e];this.destroyTexture(r,!0),r.off("update",this.updateTexture,this),r.off("dispose",this.destroyTexture,this)}n.prototype.destroy.call(this,t),this.uid=0,this.shaderManager.destroy(),this.maskManager.destroy(),this.stencilManager.destroy(),this.filterManager.destroy(),this.blendModeManager.destroy(),this.shaderManager=null,this.maskManager=null,this.filterManager=null,this.blendModeManager=null,this.currentRenderer=null,this.handleContextLost=null,this.handleContextRestored=null,this._contextOptions=null,this._managedTextures=null,this.drawCount=0,this.gl.useProgram(null),this.gl.flush(),this.gl=null},i.prototype._mapGlModes=function(){var t=this.gl;this.blendModes||(this.blendModes={},this.blendModes[f.BLEND_MODES.NORMAL]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.ADD]=[t.ONE,t.DST_ALPHA],this.blendModes[f.BLEND_MODES.MULTIPLY]=[t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.SCREEN]=[t.ONE,t.ONE_MINUS_SRC_COLOR],this.blendModes[f.BLEND_MODES.OVERLAY]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.DARKEN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.LIGHTEN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.COLOR_DODGE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.COLOR_BURN]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.HARD_LIGHT]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.SOFT_LIGHT]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.DIFFERENCE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.EXCLUSION]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.HUE]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.SATURATION]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.COLOR]=[t.ONE,t.ONE_MINUS_SRC_ALPHA],this.blendModes[f.BLEND_MODES.LUMINOSITY]=[t.ONE,t.ONE_MINUS_SRC_ALPHA]),this.drawModes||(this.drawModes={},this.drawModes[f.DRAW_MODES.POINTS]=t.POINTS,this.drawModes[f.DRAW_MODES.LINES]=t.LINES,this.drawModes[f.DRAW_MODES.LINE_LOOP]=t.LINE_LOOP,this.drawModes[f.DRAW_MODES.LINE_STRIP]=t.LINE_STRIP,this.drawModes[f.DRAW_MODES.TRIANGLES]=t.TRIANGLES,this.drawModes[f.DRAW_MODES.TRIANGLE_STRIP]=t.TRIANGLE_STRIP,this.drawModes[f.DRAW_MODES.TRIANGLE_FAN]=t.TRIANGLE_FAN)}},{"../../const":22,"../../utils":77,"../SystemRenderer":43,"./filters/FXAAFilter":51,"./managers/BlendModeManager":53,"./managers/FilterManager":54,"./managers/MaskManager":55,"./managers/ShaderManager":56,"./managers/StencilManager":57,"./utils/ObjectRenderer":63,"./utils/RenderTarget":65}],50:[function(t,e,r){function i(t,e,r){this.shaders=[],this.padding=0,this.uniforms=r||{},this.vertexSrc=t||n.defaultVertexSrc,this.fragmentSrc=e||n.defaultFragmentSrc}var n=t("../shaders/TextureShader");i.prototype.constructor=i,e.exports=i,i.prototype.getShader=function(t){var e=t.gl,r=this.shaders[e.id];return r||(r=new n(t.shaderManager,this.vertexSrc,this.fragmentSrc,this.uniforms,this.attributes),this.shaders[e.id]=r),r},i.prototype.applyFilter=function(t,e,r,i){var n=this.getShader(t);t.filterManager.applyFilter(n,e,r,i)},i.prototype.syncUniform=function(t){for(var e=0,r=this.shaders.length;r>e;++e)this.shaders[e].syncUniform(t)}},{"../shaders/TextureShader":62}],51:[function(t,e,r){function i(){n.call(this,"\nprecision mediump float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform vec2 resolution;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvarying vec2 vResolution;\n\n//texcoords computed in vertex step\n//to avoid dependent texture reads\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n            out vec2 v_rgbNW, out vec2 v_rgbNE,\n            out vec2 v_rgbSW, out vec2 v_rgbSE,\n            out vec2 v_rgbM) {\n    vec2 inverseVP = 1.0 / resolution.xy;\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n   vResolution = resolution;\n\n   //compute the texture coords and send them to varyings\n   texcoords(aTextureCoord * resolution, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n",'precision lowp float;\n\n\n/**\nBasic FXAA implementation based on the code on geeks3d.com with the\nmodification that the texture2DLod stuff was removed since it\'s\nunsupported by WebGL.\n\n--\n\nFrom:\nhttps://github.com/mitsuhiko/webgl-meincraft\n\nCopyright (c) 2011 by Armin Ronacher.\n\nSome rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are\nmet:\n\n    * Redistributions of source code must retain the above copyright\n      notice, this list of conditions and the following disclaimer.\n\n    * Redistributions in binary form must reproduce the above\n      copyright notice, this list of conditions and the following\n      disclaimer in the documentation and/or other materials provided\n      with the distribution.\n\n    * The names of the contributors may not be used to endorse or\n      promote products derived from this software without specific\n      prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\nLIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\nA PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\nOWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\nSPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\nLIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\nDATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\nTHEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n\n#ifndef FXAA_REDUCE_MIN\n    #define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n    #define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n    #define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n            vec2 v_rgbNW, vec2 v_rgbNE,\n            vec2 v_rgbSW, vec2 v_rgbSE,\n            vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec2 vResolution;\n\n//texcoords computed in vertex step\n//to avoid dependent texture reads\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform sampler2D uSampler;\n\n\nvoid main(void){\n\n    gl_FragColor = fxaa(uSampler, vTextureCoord * vResolution, vResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n}\n',{resolution:{type:"v2",value:{x:1,y:1}}})}var n=t("./AbstractFilter");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager,n=this.getShader(t);i.applyFilter(n,e,r)}},{"./AbstractFilter":50}],52:[function(t,e,r){function i(t){var e=new o.Matrix;n.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision lowp float;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform sampler2D mask;\n\nvoid main(void)\n{\n    // check clip! this will stop the mask bleeding out from the edges\n    vec2 text = abs( vMaskCoord - 0.5 );\n    text = step(0.5, text);\n    float clip = 1.0 - max(text.y, text.x);\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    original *= (masky.r * masky.a * alpha * clip);\n    gl_FragColor = original;\n}\n",{mask:{type:"sampler2D",value:t._texture},alpha:{type:"f",value:1},otherMatrix:{type:"mat3",value:e.toArray(!0)}}),this.maskSprite=t,this.maskMatrix=e}var n=t("./AbstractFilter"),o=t("../../../math");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager;this.uniforms.mask.value=this.maskSprite._texture,i.calculateMappedMatrix(e.frame,this.maskSprite,this.maskMatrix),this.uniforms.otherMatrix.value=this.maskMatrix.toArray(!0),this.uniforms.alpha.value=this.maskSprite.worldAlpha;var n=this.getShader(t);i.applyFilter(n,e,r)},Object.defineProperties(i.prototype,{map:{get:function(){return this.uniforms.mask.value},set:function(t){this.uniforms.mask.value=t}},offset:{get:function(){return this.uniforms.offset.value},set:function(t){this.uniforms.offset.value=t}}})},{"../../../math":33,"./AbstractFilter":50}],53:[function(t,e,r){function i(t){n.call(this,t),this.currentBlendMode=99999}var n=t("./WebGLManager");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.setBlendMode=function(t){if(this.currentBlendMode===t)return!1;this.currentBlendMode=t;var e=this.renderer.blendModes[this.currentBlendMode];return this.renderer.gl.blendFunc(e[0],e[1]),!0}},{"./WebGLManager":58}],54:[function(t,e,r){function i(t){n.call(this,t),this.filterStack=[],this.filterStack.push({renderTarget:t.currentRenderTarget,filter:[],bounds:null}),this.texturePool=[],this.textureSize=new h.Rectangle(0,0,t.width,t.height),this.currentFrame=null}var n=t("./WebGLManager"),o=t("../utils/RenderTarget"),s=t("../../../const"),a=t("../utils/Quad"),h=t("../../../math");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.onContextChange=function(){this.texturePool.length=0;var t=this.renderer.gl;this.quad=new a(t)},i.prototype.setFilterStack=function(t){this.filterStack=t},i.prototype.pushFilter=function(t,e){var r=t.filterArea?t.filterArea.clone():t.getBounds();r.x=0|r.x,r.y=0|r.y,r.width=0|r.width,r.height=0|r.height;var i=0|e[0].padding;if(r.x-=i,r.y-=i,r.width+=2*i,r.height+=2*i,this.renderer.currentRenderTarget.transform){var n=this.renderer.currentRenderTarget.transform;r.x+=n.tx,r.y+=n.ty,this.capFilterArea(r),r.x-=n.tx,r.y-=n.ty}else this.capFilterArea(r);if(r.width>0&&r.height>0){this.currentFrame=r;var o=this.getRenderTarget();this.renderer.setRenderTarget(o),o.clear(),this.filterStack.push({renderTarget:o,filter:e})}else this.filterStack.push({renderTarget:null,filter:e})},i.prototype.popFilter=function(){var t=this.filterStack.pop(),e=this.filterStack[this.filterStack.length-1],r=t.renderTarget;if(t.renderTarget){var i=e.renderTarget,n=this.renderer.gl;this.currentFrame=r.frame,this.quad.map(this.textureSize,r.frame),n.bindBuffer(n.ARRAY_BUFFER,this.quad.vertexBuffer),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this.quad.indexBuffer);var o=t.filter;if(n.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aVertexPosition,2,n.FLOAT,!1,0,0),n.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aTextureCoord,2,n.FLOAT,!1,0,32),n.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aColor,4,n.FLOAT,!1,0,64),this.renderer.blendModeManager.setBlendMode(s.BLEND_MODES.NORMAL),1===o.length)o[0].uniforms.dimensions&&(o[0].uniforms.dimensions.value[0]=this.renderer.width,o[0].uniforms.dimensions.value[1]=this.renderer.height,o[0].uniforms.dimensions.value[2]=this.quad.vertices[0],o[0].uniforms.dimensions.value[3]=this.quad.vertices[5]),o[0].applyFilter(this.renderer,r,i),this.returnRenderTarget(r);else{for(var a=r,h=this.getRenderTarget(!0),l=0;l<o.length-1;l++){var u=o[l];u.uniforms.dimensions&&(u.uniforms.dimensions.value[0]=this.renderer.width,u.uniforms.dimensions.value[1]=this.renderer.height,u.uniforms.dimensions.value[2]=this.quad.vertices[0],u.uniforms.dimensions.value[3]=this.quad.vertices[5]),u.applyFilter(this.renderer,a,h);var c=a;a=h,h=c}o[o.length-1].applyFilter(this.renderer,a,i),this.returnRenderTarget(a),this.returnRenderTarget(h)}return t.filter}},i.prototype.getRenderTarget=function(t){var e=this.texturePool.pop()||new o(this.renderer.gl,this.textureSize.width,this.textureSize.height,s.SCALE_MODES.LINEAR,this.renderer.resolution*s.FILTER_RESOLUTION);return e.frame=this.currentFrame,t&&e.clear(!0),e},i.prototype.returnRenderTarget=function(t){this.texturePool.push(t)},i.prototype.applyFilter=function(t,e,r,i){var n=this.renderer.gl;this.renderer.setRenderTarget(r),i&&r.clear(),this.renderer.shaderManager.setShader(t),t.uniforms.projectionMatrix.value=this.renderer.currentRenderTarget.projectionMatrix.toArray(!0),t.syncUniforms(),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,e.texture),n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0),this.renderer.drawCount++},i.prototype.calculateMappedMatrix=function(t,e,r){var i=e.worldTransform.copy(h.Matrix.TEMP_MATRIX),n=e._texture.baseTexture,o=r.identity(),s=this.textureSize.height/this.textureSize.width;o.translate(t.x/this.textureSize.width,t.y/this.textureSize.height),o.scale(1,s);var a=this.textureSize.width/n.width,l=this.textureSize.height/n.height;return i.tx/=n.width*a,i.ty/=n.width*a,i.invert(),o.prepend(i),o.scale(1,1/s),o.scale(a,l),o.translate(e.anchor.x,e.anchor.y),o},i.prototype.capFilterArea=function(t){t.x<0&&(t.width+=t.x,t.x=0),t.y<0&&(t.height+=t.y,t.y=0),t.x+t.width>this.textureSize.width&&(t.width=this.textureSize.width-t.x),t.y+t.height>this.textureSize.height&&(t.height=this.textureSize.height-t.y)},i.prototype.resize=function(t,e){this.textureSize.width=t,this.textureSize.height=e;for(var r=0;r<this.texturePool.length;r++)this.texturePool[r].resize(t,e)},i.prototype.destroy=function(){this.quad.destroy(),n.prototype.destroy.call(this),this.filterStack=null,this.offsetY=0;for(var t=0;t<this.texturePool.length;t++)this.texturePool[t].destroy();this.texturePool=null}},{"../../../const":22,"../../../math":33,"../utils/Quad":64,"../utils/RenderTarget":65,"./WebGLManager":58}],55:[function(t,e,r){function i(t){n.call(this,t),this.stencilStack=[],this.reverse=!0,this.count=0,this.alphaMaskPool=[]}var n=t("./WebGLManager"),o=t("../filters/SpriteMaskFilter");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.pushMask=function(t,e){e.texture?this.pushSpriteMask(t,e):this.pushStencilMask(t,e)},i.prototype.popMask=function(t,e){e.texture?this.popSpriteMask(t,e):this.popStencilMask(t,e)},i.prototype.pushSpriteMask=function(t,e){var r=this.alphaMaskPool.pop();r||(r=[new o(e)]),r[0].maskSprite=e,this.renderer.filterManager.pushFilter(t,r)},i.prototype.popSpriteMask=function(){var t=this.renderer.filterManager.popFilter();this.alphaMaskPool.push(t)},i.prototype.pushStencilMask=function(t,e){this.renderer.stencilManager.pushMask(e)},i.prototype.popStencilMask=function(t,e){this.renderer.stencilManager.popMask(e)}},{"../filters/SpriteMaskFilter":52,"./WebGLManager":58}],56:[function(t,e,r){function i(t){n.call(this,t),this.maxAttibs=10,this.attribState=[],this.tempAttribState=[];for(var e=0;e<this.maxAttibs;e++)this.attribState[e]=!1;this.stack=[],this._currentId=-1,this.currentShader=null}var n=t("./WebGLManager"),o=t("../shaders/TextureShader"),s=t("../shaders/ComplexPrimitiveShader"),a=t("../shaders/PrimitiveShader"),h=t("../../../utils");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,h.pluginTarget.mixin(i),e.exports=i,i.prototype.onContextChange=function(){this.initPlugins();var t=this.renderer.gl;this.maxAttibs=t.getParameter(t.MAX_VERTEX_ATTRIBS),this.attribState=[];for(var e=0;e<this.maxAttibs;e++)this.attribState[e]=!1;this.defaultShader=new o(this),this.primitiveShader=new a(this),this.complexPrimitiveShader=new s(this)},i.prototype.setAttribs=function(t){var e;for(e=0;e<this.tempAttribState.length;e++)this.tempAttribState[e]=!1;for(var r in t)this.tempAttribState[t[r]]=!0;var i=this.renderer.gl;for(e=0;e<this.attribState.length;e++)this.attribState[e]!==this.tempAttribState[e]&&(this.attribState[e]=this.tempAttribState[e],this.attribState[e]?i.enableVertexAttribArray(e):i.disableVertexAttribArray(e))},i.prototype.setShader=function(t){return this._currentId===t.uid?!1:(this._currentId=t.uid,this.currentShader=t,this.renderer.gl.useProgram(t.program),this.setAttribs(t.attributes),!0)},i.prototype.destroy=function(){this.primitiveShader.destroy(),this.complexPrimitiveShader.destroy(),n.prototype.destroy.call(this),this.destroyPlugins(),this.attribState=null,this.tempAttribState=null}},{"../../../utils":77,"../shaders/ComplexPrimitiveShader":59,"../shaders/PrimitiveShader":60,"../shaders/TextureShader":62,"./WebGLManager":58}],57:[function(t,e,r){function i(t){n.call(this,t),this.stencilMaskStack=null}var n=t("./WebGLManager"),o=t("../../../utils");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.setMaskStack=function(t){this.stencilMaskStack=t;var e=this.renderer.gl;0===t.stencilStack.length?e.disable(e.STENCIL_TEST):e.enable(e.STENCIL_TEST)},i.prototype.pushStencil=function(t,e){this.renderer.currentRenderTarget.attachStencilBuffer();var r=this.renderer.gl,i=this.stencilMaskStack;this.bindGraphics(t,e),0===i.stencilStack.length&&(r.enable(r.STENCIL_TEST),r.clear(r.STENCIL_BUFFER_BIT),i.reverse=!0,i.count=0),i.stencilStack.push(e);var n=i.count;r.colorMask(!1,!1,!1,!1),r.stencilFunc(r.ALWAYS,0,255),r.stencilOp(r.KEEP,r.KEEP,r.INVERT),1===e.mode?(r.drawElements(r.TRIANGLE_FAN,e.indices.length-4,r.UNSIGNED_SHORT,0),i.reverse?(r.stencilFunc(r.EQUAL,255-n,255),r.stencilOp(r.KEEP,r.KEEP,r.DECR)):(r.stencilFunc(r.EQUAL,n,255),r.stencilOp(r.KEEP,r.KEEP,r.INCR)),r.drawElements(r.TRIANGLE_FAN,4,r.UNSIGNED_SHORT,2*(e.indices.length-4)),i.reverse?r.stencilFunc(r.EQUAL,255-(n+1),255):r.stencilFunc(r.EQUAL,n+1,255),i.reverse=!i.reverse):(i.reverse?(r.stencilFunc(r.EQUAL,n,255),r.stencilOp(r.KEEP,r.KEEP,r.INCR)):(r.stencilFunc(r.EQUAL,255-n,255),r.stencilOp(r.KEEP,r.KEEP,r.DECR)),r.drawElements(r.TRIANGLE_STRIP,e.indices.length,r.UNSIGNED_SHORT,0),i.reverse?r.stencilFunc(r.EQUAL,n+1,255):r.stencilFunc(r.EQUAL,255-(n+1),255)),r.colorMask(!0,!0,!0,!0),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),i.count++},i.prototype.bindGraphics=function(t,e){var r,i=this.renderer.gl;1===e.mode?(r=this.renderer.shaderManager.complexPrimitiveShader,this.renderer.shaderManager.setShader(r),i.uniformMatrix3fv(r.uniforms.translationMatrix._location,!1,t.worldTransform.toArray(!0)),i.uniformMatrix3fv(r.uniforms.projectionMatrix._location,!1,this.renderer.currentRenderTarget.projectionMatrix.toArray(!0)),i.uniform3fv(r.uniforms.tint._location,o.hex2rgb(t.tint)),i.uniform3fv(r.uniforms.color._location,e.color),i.uniform1f(r.uniforms.alpha._location,t.worldAlpha),i.bindBuffer(i.ARRAY_BUFFER,e.buffer),i.vertexAttribPointer(r.attributes.aVertexPosition,2,i.FLOAT,!1,8,0),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.indexBuffer)):(r=this.renderer.shaderManager.primitiveShader,this.renderer.shaderManager.setShader(r),i.uniformMatrix3fv(r.uniforms.translationMatrix._location,!1,t.worldTransform.toArray(!0)),i.uniformMatrix3fv(r.uniforms.projectionMatrix._location,!1,this.renderer.currentRenderTarget.projectionMatrix.toArray(!0)),i.uniform3fv(r.uniforms.tint._location,o.hex2rgb(t.tint)),i.uniform1f(r.uniforms.alpha._location,t.worldAlpha),i.bindBuffer(i.ARRAY_BUFFER,e.buffer),i.vertexAttribPointer(r.attributes.aVertexPosition,2,i.FLOAT,!1,24,0),i.vertexAttribPointer(r.attributes.aColor,4,i.FLOAT,!1,24,8),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.indexBuffer))},i.prototype.popStencil=function(t,e){var r=this.renderer.gl,i=this.stencilMaskStack;if(i.stencilStack.pop(),i.count--,0===i.stencilStack.length)r.disable(r.STENCIL_TEST);else{var n=i.count;this.bindGraphics(t,e),r.colorMask(!1,!1,!1,!1),1===e.mode?(i.reverse=!i.reverse,i.reverse?(r.stencilFunc(r.EQUAL,255-(n+1),255),r.stencilOp(r.KEEP,r.KEEP,r.INCR)):(r.stencilFunc(r.EQUAL,n+1,255),r.stencilOp(r.KEEP,r.KEEP,r.DECR)),r.drawElements(r.TRIANGLE_FAN,4,r.UNSIGNED_SHORT,2*(e.indices.length-4)),r.stencilFunc(r.ALWAYS,0,255),r.stencilOp(r.KEEP,r.KEEP,r.INVERT),r.drawElements(r.TRIANGLE_FAN,e.indices.length-4,r.UNSIGNED_SHORT,0),this.renderer.drawCount+=2,i.reverse?r.stencilFunc(r.EQUAL,n,255):r.stencilFunc(r.EQUAL,255-n,255)):(i.reverse?(r.stencilFunc(r.EQUAL,n+1,255),r.stencilOp(r.KEEP,r.KEEP,r.DECR)):(r.stencilFunc(r.EQUAL,255-(n+1),255),r.stencilOp(r.KEEP,r.KEEP,r.INCR)),r.drawElements(r.TRIANGLE_STRIP,e.indices.length,r.UNSIGNED_SHORT,0),this.renderer.drawCount++,i.reverse?r.stencilFunc(r.EQUAL,n,255):r.stencilFunc(r.EQUAL,255-n,255)),r.colorMask(!0,!0,!0,!0),r.stencilOp(r.KEEP,r.KEEP,r.KEEP)}},i.prototype.destroy=function(){n.prototype.destroy.call(this),this.stencilMaskStack.stencilStack=null},i.prototype.pushMask=function(t){this.renderer.setObjectRenderer(this.renderer.plugins.graphics),t.dirty&&this.renderer.plugins.graphics.updateGraphics(t,this.renderer.gl),t._webGL[this.renderer.gl.id].data.length&&this.pushStencil(t,t._webGL[this.renderer.gl.id].data[0])},i.prototype.popMask=function(t){this.renderer.setObjectRenderer(this.renderer.plugins.graphics),this.popStencil(t,t._webGL[this.renderer.gl.id].data[0])}},{"../../../utils":77,"./WebGLManager":58}],58:[function(t,e,r){function i(t){this.renderer=t,this.renderer.on("context",this.onContextChange,this)}i.prototype.constructor=i,e.exports=i,i.prototype.onContextChange=function(){},i.prototype.destroy=function(){this.renderer.off("context",this.onContextChange,this),this.renderer=null}},{}],59:[function(t,e,r){function i(t){n.call(this,t,["attribute vec2 aVertexPosition;","uniform mat3 translationMatrix;","uniform mat3 projectionMatrix;","uniform vec3 tint;","uniform float alpha;","uniform vec3 color;","varying vec4 vColor;","void main(void){","   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","   vColor = vec4(color * alpha * tint, alpha);","}"].join("\n"),["precision mediump float;","varying vec4 vColor;","void main(void){","   gl_FragColor = vColor;","}"].join("\n"),{tint:{type:"3f",value:[0,0,0]},alpha:{type:"1f",value:0},color:{type:"3f",value:[0,0,0]},translationMatrix:{type:"mat3",value:new Float32Array(9)},projectionMatrix:{type:"mat3",value:new Float32Array(9)}},{aVertexPosition:0})}var n=t("./Shader");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i},{"./Shader":61}],60:[function(t,e,r){function i(t){n.call(this,t,["attribute vec2 aVertexPosition;","attribute vec4 aColor;","uniform mat3 translationMatrix;","uniform mat3 projectionMatrix;","uniform float alpha;","uniform float flipY;","uniform vec3 tint;","varying vec4 vColor;","void main(void){","   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","   vColor = aColor * vec4(tint * alpha, alpha);","}"].join("\n"),["precision mediump float;","varying vec4 vColor;","void main(void){","   gl_FragColor = vColor;","}"].join("\n"),{tint:{type:"3f",value:[0,0,0]},alpha:{type:"1f",value:0},translationMatrix:{type:"mat3",value:new Float32Array(9)},projectionMatrix:{type:"mat3",value:new Float32Array(9)}},{aVertexPosition:0,aColor:0})}var n=t("./Shader");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i},{"./Shader":61}],61:[function(t,e,r){function i(t,e,r,i,o){if(!e||!r)throw new Error("Pixi.js Error. Shader requires vertexSrc and fragmentSrc");this.uid=n.uid(),this.gl=t.renderer.gl,this.shaderManager=t,this.program=null,this.uniforms=i||{},this.attributes=o||{},this.textureCount=1,this.vertexSrc=e,this.fragmentSrc=r,this.init()}var n=t("../../../utils");i.prototype.constructor=i,e.exports=i,i.prototype.init=function(){this.compile(),this.gl.useProgram(this.program),this.cacheUniformLocations(Object.keys(this.uniforms)),this.cacheAttributeLocations(Object.keys(this.attributes))},i.prototype.cacheUniformLocations=function(t){for(var e=0;e<t.length;++e)this.uniforms[t[e]]._location=this.gl.getUniformLocation(this.program,t[e])},i.prototype.cacheAttributeLocations=function(t){for(var e=0;e<t.length;++e)this.attributes[t[e]]=this.gl.getAttribLocation(this.program,t[e])},i.prototype.compile=function(){var t=this.gl,e=this._glCompile(t.VERTEX_SHADER,this.vertexSrc),r=this._glCompile(t.FRAGMENT_SHADER,this.fragmentSrc),i=t.createProgram();return t.attachShader(i,e),t.attachShader(i,r),t.linkProgram(i),t.getProgramParameter(i,t.LINK_STATUS)||(console.error("Pixi.js Error: Could not initialize shader."),
console.error("gl.VALIDATE_STATUS",t.getProgramParameter(i,t.VALIDATE_STATUS)),console.error("gl.getError()",t.getError()),""!==t.getProgramInfoLog(i)&&console.warn("Pixi.js Warning: gl.getProgramInfoLog()",t.getProgramInfoLog(i)),t.deleteProgram(i),i=null),t.deleteShader(e),t.deleteShader(r),this.program=i},i.prototype.syncUniform=function(t){var e,r,i=t._location,o=t.value,s=this.gl;switch(t.type){case"b":case"bool":case"boolean":s.uniform1i(i,o?1:0);break;case"i":case"1i":s.uniform1i(i,o);break;case"f":case"1f":s.uniform1f(i,o);break;case"2f":s.uniform2f(i,o[0],o[1]);break;case"3f":s.uniform3f(i,o[0],o[1],o[2]);break;case"4f":s.uniform4f(i,o[0],o[1],o[2],o[3]);break;case"v2":s.uniform2f(i,o.x,o.y);break;case"v3":s.uniform3f(i,o.x,o.y,o.z);break;case"v4":s.uniform4f(i,o.x,o.y,o.z,o.w);break;case"1iv":s.uniform1iv(i,o);break;case"2iv":s.uniform2iv(i,o);break;case"3iv":s.uniform3iv(i,o);break;case"4iv":s.uniform4iv(i,o);break;case"1fv":s.uniform1fv(i,o);break;case"2fv":s.uniform2fv(i,o);break;case"3fv":s.uniform3fv(i,o);break;case"4fv":s.uniform4fv(i,o);break;case"m2":case"mat2":case"Matrix2fv":s.uniformMatrix2fv(i,t.transpose,o);break;case"m3":case"mat3":case"Matrix3fv":s.uniformMatrix3fv(i,t.transpose,o);break;case"m4":case"mat4":case"Matrix4fv":s.uniformMatrix4fv(i,t.transpose,o);break;case"c":"number"==typeof o&&(o=n.hex2rgb(o)),s.uniform3f(i,o[0],o[1],o[2]);break;case"iv1":s.uniform1iv(i,o);break;case"iv":s.uniform3iv(i,o);break;case"fv1":s.uniform1fv(i,o);break;case"fv":s.uniform3fv(i,o);break;case"v2v":for(t._array||(t._array=new Float32Array(2*o.length)),e=0,r=o.length;r>e;++e)t._array[2*e]=o[e].x,t._array[2*e+1]=o[e].y;s.uniform2fv(i,t._array);break;case"v3v":for(t._array||(t._array=new Float32Array(3*o.length)),e=0,r=o.length;r>e;++e)t._array[3*e]=o[e].x,t._array[3*e+1]=o[e].y,t._array[3*e+2]=o[e].z;s.uniform3fv(i,t._array);break;case"v4v":for(t._array||(t._array=new Float32Array(4*o.length)),e=0,r=o.length;r>e;++e)t._array[4*e]=o[e].x,t._array[4*e+1]=o[e].y,t._array[4*e+2]=o[e].z,t._array[4*e+3]=o[e].w;s.uniform4fv(i,t._array);break;case"t":case"sampler2D":if(!t.value||!t.value.baseTexture.hasLoaded)break;s.activeTexture(s["TEXTURE"+this.textureCount]);var a=t.value.baseTexture._glTextures[s.id];a||(this.initSampler2D(t),a=t.value.baseTexture._glTextures[s.id]),s.bindTexture(s.TEXTURE_2D,a),s.uniform1i(t._location,this.textureCount),this.textureCount++;break;default:console.warn("Pixi.js Shader Warning: Unknown uniform type: "+t.type)}},i.prototype.syncUniforms=function(){this.textureCount=1;for(var t in this.uniforms)this.syncUniform(this.uniforms[t])},i.prototype.initSampler2D=function(t){var e=this.gl,r=t.value.baseTexture;if(r.hasLoaded)if(t.textureData){var i=t.textureData;r._glTextures[e.id]=e.createTexture(),e.bindTexture(e.TEXTURE_2D,r._glTextures[e.id]),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultipliedAlpha),e.texImage2D(e.TEXTURE_2D,0,i.luminance?e.LUMINANCE:e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r.source),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,i.magFilter?i.magFilter:e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,i.wrapS?i.wrapS:e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,i.wrapS?i.wrapS:e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,i.wrapT?i.wrapT:e.CLAMP_TO_EDGE)}else this.shaderManager.renderer.updateTexture(r)},i.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.gl=null,this.uniforms=null,this.attributes=null,this.vertexSrc=null,this.fragmentSrc=null},i.prototype._glCompile=function(t,e){var r=this.gl.createShader(t);return this.gl.shaderSource(r,e),this.gl.compileShader(r),this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS)?r:(console.log(this.gl.getShaderInfoLog(r)),null)}},{"../../../utils":77}],62:[function(t,e,r){function i(t,e,r,o,s){var a={uSampler:{type:"sampler2D",value:0},projectionMatrix:{type:"mat3",value:new Float32Array([1,0,0,0,1,0,0,0,1])}};if(o)for(var h in o)a[h]=o[h];var l={aVertexPosition:0,aTextureCoord:0,aColor:0};if(s)for(var u in s)l[u]=s[u];e=e||i.defaultVertexSrc,r=r||i.defaultFragmentSrc,n.call(this,t,e,r,a,l)}var n=t("./Shader");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.defaultVertexSrc=["precision lowp float;","attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec4 aColor;","uniform mat3 projectionMatrix;","varying vec2 vTextureCoord;","varying vec4 vColor;","void main(void){","   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = vec4(aColor.rgb * aColor.a, aColor.a);","}"].join("\n"),i.defaultFragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","void main(void){","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"].join("\n")},{"./Shader":61}],63:[function(t,e,r){function i(t){n.call(this,t)}var n=t("../managers/WebGLManager");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.start=function(){},i.prototype.stop=function(){this.flush()},i.prototype.flush=function(){},i.prototype.render=function(t){}},{"../managers/WebGLManager":58}],64:[function(t,e,r){function i(t){this.gl=t,this.vertices=new Float32Array([0,0,200,0,200,200,0,200]),this.uvs=new Float32Array([0,0,1,0,1,1,0,1]),this.colors=new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]),this.indices=new Uint16Array([0,1,2,0,3,2]),this.vertexBuffer=t.createBuffer(),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,128,t.DYNAMIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.indices,t.STATIC_DRAW),this.upload()}i.prototype.constructor=i,i.prototype.map=function(t,e){var r=0,i=0;this.uvs[0]=r,this.uvs[1]=i,this.uvs[2]=r+e.width/t.width,this.uvs[3]=i,this.uvs[4]=r+e.width/t.width,this.uvs[5]=i+e.height/t.height,this.uvs[6]=r,this.uvs[7]=i+e.height/t.height,r=e.x,i=e.y,this.vertices[0]=r,this.vertices[1]=i,this.vertices[2]=r+e.width,this.vertices[3]=i,this.vertices[4]=r+e.width,this.vertices[5]=i+e.height,this.vertices[6]=r,this.vertices[7]=i+e.height,this.upload()},i.prototype.upload=function(){var t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferSubData(t.ARRAY_BUFFER,0,this.vertices),t.bufferSubData(t.ARRAY_BUFFER,32,this.uvs),t.bufferSubData(t.ARRAY_BUFFER,64,this.colors)},i.prototype.destroy=function(){var t=this.gl;t.deleteBuffer(this.vertexBuffer),t.deleteBuffer(this.indexBuffer)},e.exports=i},{}],65:[function(t,e,r){var i=t("../../../math"),n=t("../../../utils"),o=t("../../../const"),s=t("./StencilMaskStack"),a=function(t,e,r,a,h,l){if(this.gl=t,this.frameBuffer=null,this.texture=null,this.size=new i.Rectangle(0,0,1,1),this.resolution=h||o.RESOLUTION,this.projectionMatrix=new i.Matrix,this.transform=null,this.frame=null,this.stencilBuffer=null,this.stencilMaskStack=new s,this.filterStack=[{renderTarget:this,filter:[],bounds:this.size}],this.scaleMode=a||o.SCALE_MODES.DEFAULT,this.root=l,!this.root){this.frameBuffer=t.createFramebuffer(),this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a===o.SCALE_MODES.LINEAR?t.LINEAR:t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a===o.SCALE_MODES.LINEAR?t.LINEAR:t.NEAREST);var u=n.isPowerOfTwo(e,r);u?(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT)):(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)),t.bindFramebuffer(t.FRAMEBUFFER,this.frameBuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.texture,0)}this.resize(e,r)};a.prototype.constructor=a,e.exports=a,a.prototype.clear=function(t){var e=this.gl;t&&e.bindFramebuffer(e.FRAMEBUFFER,this.frameBuffer),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)},a.prototype.attachStencilBuffer=function(){if(!this.stencilBuffer&&!this.root){var t=this.gl;this.stencilBuffer=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,this.stencilBuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,this.stencilBuffer),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,this.size.width*this.resolution,this.size.height*this.resolution)}},a.prototype.activate=function(){var t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.frameBuffer);var e=this.frame||this.size;this.calculateProjection(e),this.transform&&this.projectionMatrix.append(this.transform),t.viewport(0,0,e.width*this.resolution,e.height*this.resolution)},a.prototype.calculateProjection=function(t){var e=this.projectionMatrix;e.identity(),this.root?(e.a=1/t.width*2,e.d=-1/t.height*2,e.tx=-1-t.x*e.a,e.ty=1-t.y*e.d):(e.a=1/t.width*2,e.d=1/t.height*2,e.tx=-1-t.x*e.a,e.ty=-1-t.y*e.d)},a.prototype.resize=function(t,e){if(t=0|t,e=0|e,this.size.width!==t||this.size.height!==e){if(this.size.width=t,this.size.height=e,!this.root){var r=this.gl;r.bindTexture(r.TEXTURE_2D,this.texture),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,t*this.resolution,e*this.resolution,0,r.RGBA,r.UNSIGNED_BYTE,null),this.stencilBuffer&&(r.bindRenderbuffer(r.RENDERBUFFER,this.stencilBuffer),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,t*this.resolution,e*this.resolution))}var i=this.frame||this.size;this.calculateProjection(i)}},a.prototype.destroy=function(){var t=this.gl;t.deleteRenderbuffer(this.stencilBuffer),t.deleteFramebuffer(this.frameBuffer),t.deleteTexture(this.texture),this.frameBuffer=null,this.texture=null}},{"../../../const":22,"../../../math":33,"../../../utils":77,"./StencilMaskStack":66}],66:[function(t,e,r){function i(){this.stencilStack=[],this.reverse=!0,this.count=0}i.prototype.constructor=i,e.exports=i},{}],67:[function(t,e,r){function i(t){s.call(this),this.anchor=new n.Point,this._texture=null,this._width=0,this._height=0,this.tint=16777215,this.blendMode=l.BLEND_MODES.NORMAL,this.shader=null,this.cachedTint=16777215,this.texture=t||o.EMPTY}var n=t("../math"),o=t("../textures/Texture"),s=t("../display/Container"),a=t("../renderers/canvas/utils/CanvasTinter"),h=t("../utils"),l=t("../const"),u=new n.Point,c=n.GroupD8,p=new n.Matrix;i.prototype=Object.create(s.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{width:{get:function(){return Math.abs(this.scale.x)*this.texture._frame.width},set:function(t){var e=h.sign(this.scale.x)||1;this.scale.x=e*t/this.texture._frame.width,this._width=t}},height:{get:function(){return Math.abs(this.scale.y)*this.texture._frame.height},set:function(t){var e=h.sign(this.scale.y)||1;this.scale.y=e*t/this.texture._frame.height,this._height=t}},texture:{get:function(){return this._texture},set:function(t){this._texture!==t&&(this._texture=t,this.cachedTint=16777215,t&&(t.baseTexture.hasLoaded?this._onTextureUpdate():t.once("update",this._onTextureUpdate,this)))}}}),i.prototype._onTextureUpdate=function(){this._width&&(this.scale.x=h.sign(this.scale.x)*this._width/this.texture.frame.width),this._height&&(this.scale.y=h.sign(this.scale.y)*this._height/this.texture.frame.height)},i.prototype._renderWebGL=function(t){t.setObjectRenderer(t.plugins.sprite),t.plugins.sprite.render(this)},i.prototype.getBounds=function(t){if(!this._currentBounds){var e,r,i,n,o=this._texture._frame.width,s=this._texture._frame.height,a=o*(1-this.anchor.x),h=o*-this.anchor.x,l=s*(1-this.anchor.y),u=s*-this.anchor.y,c=t||this.worldTransform,p=c.a,d=c.b,f=c.c,v=c.d,g=c.tx,y=c.ty,m=p*h+f*u+g,x=v*u+d*h+y,b=p*a+f*u+g,_=v*u+d*a+y,T=p*a+f*l+g,E=v*l+d*a+y,S=p*h+f*l+g,w=v*l+d*h+y;if(e=m,e=e>b?b:e,e=e>T?T:e,e=e>S?S:e,i=x,i=i>_?_:i,i=i>E?E:i,i=i>w?w:i,r=m,r=b>r?b:r,r=T>r?T:r,r=S>r?S:r,n=x,n=_>n?_:n,n=E>n?E:n,n=w>n?w:n,this.children.length){var A=this.containerGetBounds();a=A.x,h=A.x+A.width,l=A.y,u=A.y+A.height,e=a>e?e:a,i=l>i?i:l,r=r>h?r:h,n=n>u?n:u}var C=this._bounds;C.x=e,C.width=r-e,C.y=i,C.height=n-i,this._currentBounds=C}return this._currentBounds},i.prototype.getLocalBounds=function(){return this._bounds.x=-this._texture._frame.width*this.anchor.x,this._bounds.y=-this._texture._frame.height*this.anchor.y,this._bounds.width=this._texture._frame.width,this._bounds.height=this._texture._frame.height,this._bounds},i.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,u);var e,r=this._texture._frame.width,i=this._texture._frame.height,n=-r*this.anchor.x;return u.x>n&&u.x<n+r&&(e=-i*this.anchor.y,u.y>e&&u.y<e+i)},i.prototype._renderCanvas=function(t){if(!(this.texture.crop.width<=0||this.texture.crop.height<=0)){var e=t.blendModes[this.blendMode];if(e!==t.context.globalCompositeOperation&&(t.context.globalCompositeOperation=e),this.texture.valid){var r,i,n=this._texture,o=this.worldTransform,s=n.crop.width,h=n.crop.height;t.context.globalAlpha=this.worldAlpha;var u=n.baseTexture.scaleMode===l.SCALE_MODES.LINEAR;t.smoothProperty&&t.context[t.smoothProperty]!==u&&(t.context[t.smoothProperty]=u),2===(3&n.rotate)&&(s=n.crop.height,h=n.crop.width),n.trim?(r=n.crop.width/2+n.trim.x-this.anchor.x*n.trim.width,i=n.crop.height/2+n.trim.y-this.anchor.y*n.trim.height):(r=(.5-this.anchor.x)*n._frame.width,i=(.5-this.anchor.y)*n._frame.height),n.rotate&&(o.copy(p),o=p,c.matrixAppendRotationInv(o,n.rotate,r,i),r=0,i=0),r-=s/2,i-=h/2,t.roundPixels?(t.context.setTransform(o.a,o.b,o.c,o.d,o.tx*t.resolution|0,o.ty*t.resolution|0),r=0|r,i=0|i):t.context.setTransform(o.a,o.b,o.c,o.d,o.tx*t.resolution,o.ty*t.resolution);var d=n.baseTexture.resolution;16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=a.getTintedTexture(this,this.tint)),t.context.drawImage(this.tintedTexture,0,0,s*d,h*d,r*t.resolution,i*t.resolution,s*t.resolution,h*t.resolution)):t.context.drawImage(n.baseTexture.source,n.crop.x*d,n.crop.y*d,s*d,h*d,r*t.resolution,i*t.resolution,s*t.resolution,h*t.resolution)}}},i.prototype.destroy=function(t,e){s.prototype.destroy.call(this),this.anchor=null,t&&this._texture.destroy(e),this._texture=null,this.shader=null},i.fromFrame=function(t){var e=h.TextureCache[t];if(!e)throw new Error('The frameId "'+t+'" does not exist in the texture cache');return new i(e)},i.fromImage=function(t,e,r){return new i(o.fromImage(t,e,r))}},{"../const":22,"../display/Container":23,"../math":33,"../renderers/canvas/utils/CanvasTinter":48,"../textures/Texture":72,"../utils":77}],68:[function(t,e,r){function i(t){n.call(this,t),this.vertSize=5,this.vertByteSize=4*this.vertSize,this.size=s.SPRITE_BATCH_SIZE;var e=4*this.size*this.vertByteSize,r=6*this.size;this.vertices=new ArrayBuffer(e),this.positions=new Float32Array(this.vertices),this.colors=new Uint32Array(this.vertices),this.indices=new Uint16Array(r);for(var i=0,o=0;r>i;i+=6,o+=4)this.indices[i+0]=o+0,this.indices[i+1]=o+1,this.indices[i+2]=o+2,this.indices[i+3]=o+0,this.indices[i+4]=o+2,this.indices[i+5]=o+3;this.currentBatchSize=0,this.sprites=[],this.shader=null}var n=t("../../renderers/webgl/utils/ObjectRenderer"),o=t("../../renderers/webgl/WebGLRenderer"),s=t("../../const");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,o.registerPlugin("sprite",i),i.prototype.onContextChange=function(){var t=this.renderer.gl;this.shader=this.renderer.shaderManager.defaultShader,this.vertexBuffer=t.createBuffer(),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,this.indices,t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,this.vertices,t.DYNAMIC_DRAW),this.currentBlendMode=99999},i.prototype.render=function(t){var e=t._texture;this.currentBatchSize>=this.size&&this.flush();var r=e._uvs;if(r){var i,n,o,s,a=t.anchor.x,h=t.anchor.y;if(e.trim&&void 0===t.tileScale){var l=e.trim;n=l.x-a*l.width,i=n+e.crop.width,s=l.y-h*l.height,o=s+e.crop.height}else i=e._frame.width*(1-a),n=e._frame.width*-a,o=e._frame.height*(1-h),s=e._frame.height*-h;var u=this.currentBatchSize*this.vertByteSize,c=t.worldTransform,p=c.a,d=c.b,f=c.c,v=c.d,g=c.tx,y=c.ty,m=this.colors,x=this.positions;if(this.renderer.roundPixels){var b=this.renderer.resolution;x[u]=((p*n+f*s+g)*b|0)/b,x[u+1]=((v*s+d*n+y)*b|0)/b,x[u+5]=((p*i+f*s+g)*b|0)/b,x[u+6]=((v*s+d*i+y)*b|0)/b,x[u+10]=((p*i+f*o+g)*b|0)/b,x[u+11]=((v*o+d*i+y)*b|0)/b,x[u+15]=((p*n+f*o+g)*b|0)/b,x[u+16]=((v*o+d*n+y)*b|0)/b}else x[u]=p*n+f*s+g,x[u+1]=v*s+d*n+y,x[u+5]=p*i+f*s+g,x[u+6]=v*s+d*i+y,x[u+10]=p*i+f*o+g,x[u+11]=v*o+d*i+y,x[u+15]=p*n+f*o+g,x[u+16]=v*o+d*n+y;x[u+2]=r.x0,x[u+3]=r.y0,x[u+7]=r.x1,x[u+8]=r.y1,x[u+12]=r.x2,x[u+13]=r.y2,x[u+17]=r.x3,x[u+18]=r.y3;var _=t.tint;m[u+4]=m[u+9]=m[u+14]=m[u+19]=(_>>16)+(65280&_)+((255&_)<<16)+(255*t.worldAlpha<<24),this.sprites[this.currentBatchSize++]=t}},i.prototype.flush=function(){if(0!==this.currentBatchSize){var t,e=this.renderer.gl;if(this.currentBatchSize>.5*this.size)e.bufferSubData(e.ARRAY_BUFFER,0,this.vertices);else{var r=this.positions.subarray(0,this.currentBatchSize*this.vertByteSize);e.bufferSubData(e.ARRAY_BUFFER,0,r)}for(var i,n,o,s,a=0,h=0,l=null,u=this.renderer.blendModeManager.currentBlendMode,c=null,p=!1,d=!1,f=0,v=this.currentBatchSize;v>f;f++)s=this.sprites[f],i=s._texture.baseTexture,n=s.blendMode,o=s.shader||this.shader,p=u!==n,d=c!==o,(l!==i||p||d)&&(this.renderBatch(l,a,h),h=f,a=0,l=i,p&&(u=n,this.renderer.blendModeManager.setBlendMode(u)),d&&(c=o,t=c.shaders?c.shaders[e.id]:c,t||(t=c.getShader(this.renderer)),this.renderer.shaderManager.setShader(t),t.uniforms.projectionMatrix.value=this.renderer.currentRenderTarget.projectionMatrix.toArray(!0),t.syncUniforms(),e.activeTexture(e.TEXTURE0))),a++;this.renderBatch(l,a,h),this.currentBatchSize=0}},i.prototype.renderBatch=function(t,e,r){if(0!==e){var i=this.renderer.gl;t._glTextures[i.id]?i.bindTexture(i.TEXTURE_2D,t._glTextures[i.id]):this.renderer.updateTexture(t),i.drawElements(i.TRIANGLES,6*e,i.UNSIGNED_SHORT,6*r*2),this.renderer.drawCount++}},i.prototype.start=function(){var t=this.renderer.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var e=this.vertByteSize;t.vertexAttribPointer(this.shader.attributes.aVertexPosition,2,t.FLOAT,!1,e,0),t.vertexAttribPointer(this.shader.attributes.aTextureCoord,2,t.FLOAT,!1,e,8),t.vertexAttribPointer(this.shader.attributes.aColor,4,t.UNSIGNED_BYTE,!0,e,16)},i.prototype.destroy=function(){this.renderer.gl.deleteBuffer(this.vertexBuffer),this.renderer.gl.deleteBuffer(this.indexBuffer),n.prototype.destroy.call(this),this.shader.destroy(),this.renderer=null,this.vertices=null,this.positions=null,this.colors=null,this.indices=null,this.vertexBuffer=null,this.indexBuffer=null,this.sprites=null,this.shader=null}},{"../../const":22,"../../renderers/webgl/WebGLRenderer":49,"../../renderers/webgl/utils/ObjectRenderer":63}],69:[function(t,e,r){function i(t,e,r){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.resolution=r||h.RESOLUTION,this._text=null,this._style=null;var i=o.fromCanvas(this.canvas);i.trim=new s.Rectangle,n.call(this,i),this.text=t,this.style=e}var n=t("../sprites/Sprite"),o=t("../textures/Texture"),s=t("../math"),a=t("../utils"),h=t("../const");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.fontPropertiesCache={},i.fontPropertiesCanvas=document.createElement("canvas"),i.fontPropertiesContext=i.fontPropertiesCanvas.getContext("2d"),Object.defineProperties(i.prototype,{width:{get:function(){return this.dirty&&this.updateText(),this.scale.x*this._texture._frame.width},set:function(t){this.scale.x=t/this._texture._frame.width,this._width=t}},height:{get:function(){return this.dirty&&this.updateText(),this.scale.y*this._texture._frame.height},set:function(t){this.scale.y=t/this._texture._frame.height,this._height=t}},style:{get:function(){return this._style},set:function(t){t=t||{},"number"==typeof t.fill&&(t.fill=a.hex2string(t.fill)),"number"==typeof t.stroke&&(t.stroke=a.hex2string(t.stroke)),"number"==typeof t.dropShadowColor&&(t.dropShadowColor=a.hex2string(t.dropShadowColor)),t.font=t.font||"bold 20pt Arial",t.fill=t.fill||"black",t.align=t.align||"left",t.stroke=t.stroke||"black",t.strokeThickness=t.strokeThickness||0,t.wordWrap=t.wordWrap||!1,t.wordWrapWidth=t.wordWrapWidth||100,t.breakWords=t.breakWords||!1,t.letterSpacing=t.letterSpacing||0,t.dropShadow=t.dropShadow||!1,t.dropShadowColor=t.dropShadowColor||"#000000",t.dropShadowAngle=void 0!==t.dropShadowAngle?t.dropShadowAngle:Math.PI/6,t.dropShadowDistance=void 0!==t.dropShadowDistance?t.dropShadowDistance:5,t.dropShadowBlur=void 0!==t.dropShadowBlur?t.dropShadowBlur:0,t.padding=t.padding||0,t.textBaseline=t.textBaseline||"alphabetic",t.lineJoin=t.lineJoin||"miter",t.miterLimit=t.miterLimit||10,this._style=t,this.dirty=!0}},text:{get:function(){return this._text},set:function(t){t=t.toString()||" ",this._text!==t&&(this._text=t,this.dirty=!0)}}}),i.prototype.updateText=function(){var t=this._style;this.context.font=t.font;for(var e=t.wordWrap?this.wordWrap(this._text):this._text,r=e.split(/(?:\r\n|\r|\n)/),i=new Array(r.length),n=0,o=this.determineFontProperties(t.font),s=0;s<r.length;s++){var a=this.context.measureText(r[s]).width+(r[s].length-1)*t.letterSpacing;i[s]=a,n=Math.max(n,a)}var h=n+t.strokeThickness;t.dropShadow&&(h+=t.dropShadowDistance),this.canvas.width=Math.ceil((h+this.context.lineWidth)*this.resolution);var l=this.style.lineHeight||o.fontSize+t.strokeThickness,u=l*r.length;t.dropShadow&&(u+=t.dropShadowDistance),this.canvas.height=Math.ceil((u+2*this._style.padding)*this.resolution),this.context.scale(this.resolution,this.resolution),navigator.isCocoonJS&&this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=t.font,this.context.strokeStyle=t.stroke,this.context.lineWidth=t.strokeThickness,this.context.textBaseline=t.textBaseline,this.context.lineJoin=t.lineJoin,this.context.miterLimit=t.miterLimit;var c,p;if(t.dropShadow){t.dropShadowBlur>0?(this.context.shadowColor=t.dropShadowColor,this.context.shadowBlur=t.dropShadowBlur):this.context.fillStyle=t.dropShadowColor;var d=Math.cos(t.dropShadowAngle)*t.dropShadowDistance,f=Math.sin(t.dropShadowAngle)*t.dropShadowDistance;for(s=0;s<r.length;s++)c=t.strokeThickness/2,p=t.strokeThickness/2+s*l+o.ascent,"right"===t.align?c+=n-i[s]:"center"===t.align&&(c+=(n-i[s])/2),t.fill&&this.drawLetterSpacing(r[s],c+d,p+f+t.padding)}for(this.context.fillStyle=t.fill,s=0;s<r.length;s++)c=t.strokeThickness/2,p=t.strokeThickness/2+s*l+o.ascent,"right"===t.align?c+=n-i[s]:"center"===t.align&&(c+=(n-i[s])/2),t.stroke&&t.strokeThickness&&this.drawLetterSpacing(r[s],c,p+t.padding,!0),t.fill&&this.drawLetterSpacing(r[s],c,p+t.padding);this.updateTexture()},i.prototype.drawLetterSpacing=function(t,e,r,i){var n=this._style,o=n.letterSpacing;if(0===o)return void(i?this.context.strokeText(t,e,r):this.context.fillText(t,e,r));for(var s,a=String.prototype.split.call(t,""),h=0,l=e;h<t.length;)s=a[h++],i?this.context.strokeText(s,l,r):this.context.fillText(s,l,r),l+=this.context.measureText(s).width+o},i.prototype.updateTexture=function(){var t=this._texture,e=this._style;t.baseTexture.hasLoaded=!0,t.baseTexture.resolution=this.resolution,t.baseTexture.width=this.canvas.width/this.resolution,t.baseTexture.height=this.canvas.height/this.resolution,t.crop.width=t._frame.width=this.canvas.width/this.resolution,t.crop.height=t._frame.height=this.canvas.height/this.resolution,t.trim.x=0,t.trim.y=-e.padding,t.trim.width=t._frame.width,t.trim.height=t._frame.height-2*e.padding,this._width=this.canvas.width/this.resolution,this._height=this.canvas.height/this.resolution,t.baseTexture.emit("update",t.baseTexture),this.dirty=!1},i.prototype.renderWebGL=function(t){this.dirty&&this.updateText(),n.prototype.renderWebGL.call(this,t)},i.prototype._renderCanvas=function(t){this.dirty&&this.updateText(),n.prototype._renderCanvas.call(this,t)},i.prototype.determineFontProperties=function(t){var e=i.fontPropertiesCache[t];if(!e){e={};var r=i.fontPropertiesCanvas,n=i.fontPropertiesContext;n.font=t;var o=Math.ceil(n.measureText("|MÉq").width),s=Math.ceil(n.measureText("M").width),a=2*s;s=1.4*s|0,r.width=o,r.height=a,n.fillStyle="#f00",n.fillRect(0,0,o,a),n.font=t,n.textBaseline="alphabetic",n.fillStyle="#000",n.fillText("|MÉq",0,s);var h,l,u=n.getImageData(0,0,o,a).data,c=u.length,p=4*o,d=0,f=!1;for(h=0;s>h;h++){for(l=0;p>l;l+=4)if(255!==u[d+l]){f=!0;break}if(f)break;d+=p}for(e.ascent=s-h,d=c-p,f=!1,h=a;h>s;h--){for(l=0;p>l;l+=4)if(255!==u[d+l]){f=!0;break}if(f)break;d-=p}e.descent=h-s,e.fontSize=e.ascent+e.descent,i.fontPropertiesCache[t]=e}return e},i.prototype.wordWrap=function(t){for(var e="",r=t.split("\n"),i=this._style.wordWrapWidth,n=0;n<r.length;n++){for(var o=i,s=r[n].split(" "),a=0;a<s.length;a++){var h=this.context.measureText(s[a]).width;if(this._style.breakWords&&h>i)for(var l=s[a].split(""),u=0;u<l.length;u++){var c=this.context.measureText(l[u]).width;c>o?(e+="\n"+l[u],o=i-c):(0===u&&(e+=" "),e+=l[u],o-=c)}else{var p=h+this.context.measureText(" ").width;0===a||p>o?(a>0&&(e+="\n"),e+=s[a],o=i-h):(o-=p,e+=" "+s[a])}}n<r.length-1&&(e+="\n")}return e},i.prototype.getBounds=function(t){return this.dirty&&this.updateText(),n.prototype.getBounds.call(this,t)},i.prototype.destroy=function(t){this.context=null,this.canvas=null,this._style=null,this._texture.destroy(void 0===t?!0:t)}},{"../const":22,"../math":33,"../sprites/Sprite":67,"../textures/Texture":72,"../utils":77}],70:[function(t,e,r){function i(t,e,r){s.call(this),this.uid=n.uid(),this.resolution=r||1,this.width=100,this.height=100,this.realWidth=100,this.realHeight=100,this.scaleMode=e||o.SCALE_MODES.DEFAULT,this.hasLoaded=!1,this.isLoading=!1,this.source=null,this.premultipliedAlpha=!0,this.imageUrl=null,this.isPowerOfTwo=!1,this.mipmap=!1,this._glTextures={},t&&this.loadSource(t)}var n=t("../utils"),o=t("../const"),s=t("eventemitter3");i.prototype=Object.create(s.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.update=function(){this.realWidth=this.source.naturalWidth||this.source.width,this.realHeight=this.source.naturalHeight||this.source.height,this.width=this.realWidth/this.resolution,this.height=this.realHeight/this.resolution,this.isPowerOfTwo=n.isPowerOfTwo(this.realWidth,this.realHeight),this.emit("update",this)},i.prototype.loadSource=function(t){var e=this.isLoading;if(this.hasLoaded=!1,this.isLoading=!1,e&&this.source&&(this.source.onload=null,this.source.onerror=null),this.source=t,(this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)this._sourceLoaded();else if(!t.getContext){this.isLoading=!0;var r=this;t.onload=function(){t.onload=null,t.onerror=null,r.isLoading&&(r.isLoading=!1,r._sourceLoaded(),r.emit("loaded",r))},t.onerror=function(){t.onload=null,t.onerror=null,r.isLoading&&(r.isLoading=!1,r.emit("error",r))},t.complete&&t.src&&(this.isLoading=!1,t.onload=null,t.onerror=null,t.width&&t.height?(this._sourceLoaded(),e&&this.emit("loaded",this)):e&&this.emit("error",this))}},i.prototype._sourceLoaded=function(){this.hasLoaded=!0,this.update()},i.prototype.destroy=function(){this.imageUrl?(delete n.BaseTextureCache[this.imageUrl],delete n.TextureCache[this.imageUrl],this.imageUrl=null,navigator.isCocoonJS||(this.source.src="")):this.source&&this.source._pixiId&&delete n.BaseTextureCache[this.source._pixiId],this.source=null,this.dispose()},i.prototype.dispose=function(){this.emit("dispose",this)},i.prototype.updateSourceImage=function(t){this.source.src=t,this.loadSource(this.source)},i.fromImage=function(t,e,r){var o=n.BaseTextureCache[t];if(void 0===e&&0!==t.indexOf("data:")&&(e=!0),!o){var s=new Image;e&&(s.crossOrigin=""),o=new i(s,r),o.imageUrl=t,s.src=t,n.BaseTextureCache[t]=o,o.resolution=n.getResolutionOfUrl(t)}return o},i.fromCanvas=function(t,e){t._pixiId||(t._pixiId="canvas_"+n.uid());var r=n.BaseTextureCache[t._pixiId];return r||(r=new i(t,e),n.BaseTextureCache[t._pixiId]=r),r}},{"../const":22,"../utils":77,eventemitter3:10}],71:[function(t,e,r){function i(t,e,r,i,c){if(!t)throw new Error("Unable to create RenderTexture, you must pass a renderer into the constructor.");e=e||100,r=r||100,c=c||u.RESOLUTION;var p=new n;if(p.width=e,p.height=r,p.resolution=c,p.scaleMode=i||u.SCALE_MODES.DEFAULT,p.hasLoaded=!0,o.call(this,p,new l.Rectangle(0,0,e,r)),this.width=e,this.height=r,this.resolution=c,this.render=null,this.renderer=t,this.renderer.type===u.RENDERER_TYPE.WEBGL){var d=this.renderer.gl;this.textureBuffer=new s(d,this.width,this.height,p.scaleMode,this.resolution),this.baseTexture._glTextures[d.id]=this.textureBuffer.texture,this.filterManager=new a(this.renderer),this.filterManager.onContextChange(),this.filterManager.resize(e,r),this.render=this.renderWebGL,this.renderer.currentRenderer.start(),this.renderer.currentRenderTarget.activate()}else this.render=this.renderCanvas,this.textureBuffer=new h(this.width*this.resolution,this.height*this.resolution),this.baseTexture.source=this.textureBuffer.canvas;this.valid=!0,this._updateUvs()}var n=t("./BaseTexture"),o=t("./Texture"),s=t("../renderers/webgl/utils/RenderTarget"),a=t("../renderers/webgl/managers/FilterManager"),h=t("../renderers/canvas/utils/CanvasBuffer"),l=t("../math"),u=t("../const"),c=new l.Matrix;i.prototype=Object.create(o.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.resize=function(t,e,r){t===this.width&&e===this.height||(this.valid=t>0&&e>0,this.width=this._frame.width=this.crop.width=t,this.height=this._frame.height=this.crop.height=e,r&&(this.baseTexture.width=this.width,this.baseTexture.height=this.height),this.valid&&(this.textureBuffer.resize(this.width,this.height),this.filterManager&&this.filterManager.resize(this.width,this.height)))},i.prototype.clear=function(){this.valid&&(this.renderer.type===u.RENDERER_TYPE.WEBGL&&this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER,this.textureBuffer.frameBuffer),this.textureBuffer.clear())},i.prototype.renderWebGL=function(t,e,r,i){if(this.valid){if(i=void 0!==i?i:!0,this.textureBuffer.transform=e,this.textureBuffer.activate(),t.worldAlpha=1,i){t.worldTransform.identity(),t.currentBounds=null;var n,o,s=t.children;for(n=0,o=s.length;o>n;++n)s[n].updateTransform()}var a=this.renderer.filterManager;this.renderer.filterManager=this.filterManager,this.renderer.renderDisplayObject(t,this.textureBuffer,r),this.renderer.filterManager=a}},i.prototype.renderCanvas=function(t,e,r,i){if(this.valid){i=!!i;var n=c;n.identity(),e&&n.append(e);var o=t.worldTransform;t.worldTransform=n,t.worldAlpha=1;var s,a,h=t.children;for(s=0,a=h.length;a>s;++s)h[s].updateTransform();r&&this.textureBuffer.clear();var l=this.textureBuffer.context,u=this.renderer.resolution;this.renderer.resolution=this.resolution,this.renderer.renderDisplayObject(t,l),this.renderer.resolution=u,t.worldTransform===n&&(t.worldTransform=o)}},i.prototype.destroy=function(){o.prototype.destroy.call(this,!0),this.textureBuffer.destroy(),this.filterManager&&this.filterManager.destroy(),this.renderer=null},i.prototype.getImage=function(){var t=new Image;return t.src=this.getBase64(),t},i.prototype.getBase64=function(){return this.getCanvas().toDataURL()},i.prototype.getCanvas=function(){if(this.renderer.type===u.RENDERER_TYPE.WEBGL){var t=this.renderer.gl,e=this.textureBuffer.size.width,r=this.textureBuffer.size.height,i=new Uint8Array(4*e*r);t.bindFramebuffer(t.FRAMEBUFFER,this.textureBuffer.frameBuffer),t.readPixels(0,0,e,r,t.RGBA,t.UNSIGNED_BYTE,i),t.bindFramebuffer(t.FRAMEBUFFER,null);var n=new h(e,r),o=n.context.getImageData(0,0,e,r);return o.data.set(i),n.context.putImageData(o,0,0),n.canvas}return this.textureBuffer.canvas},i.prototype.getPixels=function(){var t,e;if(this.renderer.type===u.RENDERER_TYPE.WEBGL){var r=this.renderer.gl;t=this.textureBuffer.size.width,e=this.textureBuffer.size.height;var i=new Uint8Array(4*t*e);
return r.bindFramebuffer(r.FRAMEBUFFER,this.textureBuffer.frameBuffer),r.readPixels(0,0,t,e,r.RGBA,r.UNSIGNED_BYTE,i),r.bindFramebuffer(r.FRAMEBUFFER,null),i}return t=this.textureBuffer.canvas.width,e=this.textureBuffer.canvas.height,this.textureBuffer.canvas.getContext("2d").getImageData(0,0,t,e).data},i.prototype.getPixel=function(t,e){if(this.renderer.type===u.RENDERER_TYPE.WEBGL){var r=this.renderer.gl,i=new Uint8Array(4);return r.bindFramebuffer(r.FRAMEBUFFER,this.textureBuffer.frameBuffer),r.readPixels(t,e,1,1,r.RGBA,r.UNSIGNED_BYTE,i),r.bindFramebuffer(r.FRAMEBUFFER,null),i}return this.textureBuffer.canvas.getContext("2d").getImageData(t,e,1,1).data}},{"../const":22,"../math":33,"../renderers/canvas/utils/CanvasBuffer":45,"../renderers/webgl/managers/FilterManager":54,"../renderers/webgl/utils/RenderTarget":65,"./BaseTexture":70,"./Texture":72}],72:[function(t,e,r){function i(t,e,r,n,o){if(a.call(this),this.noFrame=!1,e||(this.noFrame=!0,e=new h.Rectangle(0,0,1,1)),t instanceof i&&(t=t.baseTexture),this.baseTexture=t,this._frame=e,this.trim=n,this.valid=!1,this.requiresUpdate=!1,this._uvs=null,this.width=0,this.height=0,this.crop=r||e,this._rotate=+(o||0),o===!0)this._rotate=2;else if(this._rotate%2!==0)throw"attempt to use diamond-shaped UVs. If you are sure, set rotation manually";t.hasLoaded?(this.noFrame&&(e=new h.Rectangle(0,0,t.width,t.height),t.on("update",this.onBaseTextureUpdated,this)),this.frame=e):t.once("loaded",this.onBaseTextureLoaded,this)}var n=t("./BaseTexture"),o=t("./VideoBaseTexture"),s=t("./TextureUvs"),a=t("eventemitter3"),h=t("../math"),l=t("../utils");i.prototype=Object.create(a.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{frame:{get:function(){return this._frame},set:function(t){if(this._frame=t,this.noFrame=!1,this.width=t.width,this.height=t.height,!this.trim&&!this.rotate&&(t.x+t.width>this.baseTexture.width||t.y+t.height>this.baseTexture.height))throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);this.valid=t&&t.width&&t.height&&this.baseTexture.hasLoaded,this.trim?(this.width=this.trim.width,this.height=this.trim.height,this._frame.width=this.trim.width,this._frame.height=this.trim.height):this.crop=t,this.valid&&this._updateUvs()}},rotate:{get:function(){return this._rotate},set:function(t){this._rotate=t,this.valid&&this._updateUvs()}}}),i.prototype.update=function(){this.baseTexture.update()},i.prototype.onBaseTextureLoaded=function(t){this.noFrame?this.frame=new h.Rectangle(0,0,t.width,t.height):this.frame=this._frame,this.emit("update",this)},i.prototype.onBaseTextureUpdated=function(t){this._frame.width=t.width,this._frame.height=t.height,this.emit("update",this)},i.prototype.destroy=function(t){this.baseTexture&&(t&&this.baseTexture.destroy(),this.baseTexture.off("update",this.onBaseTextureUpdated,this),this.baseTexture.off("loaded",this.onBaseTextureLoaded,this),this.baseTexture=null),this._frame=null,this._uvs=null,this.trim=null,this.crop=null,this.valid=!1,this.off("dispose",this.dispose,this),this.off("update",this.update,this)},i.prototype.clone=function(){return new i(this.baseTexture,this.frame,this.crop,this.trim,this.rotate)},i.prototype._updateUvs=function(){this._uvs||(this._uvs=new s),this._uvs.set(this.crop,this.baseTexture,this.rotate)},i.fromImage=function(t,e,r){var o=l.TextureCache[t];return o||(o=new i(n.fromImage(t,e,r)),l.TextureCache[t]=o),o},i.fromFrame=function(t){var e=l.TextureCache[t];if(!e)throw new Error('The frameId "'+t+'" does not exist in the texture cache');return e},i.fromCanvas=function(t,e){return new i(n.fromCanvas(t,e))},i.fromVideo=function(t,e){return"string"==typeof t?i.fromVideoUrl(t,e):new i(o.fromVideo(t,e))},i.fromVideoUrl=function(t,e){return new i(o.fromUrl(t,e))},i.addTextureToCache=function(t,e){l.TextureCache[e]=t},i.removeTextureFromCache=function(t){var e=l.TextureCache[t];return delete l.TextureCache[t],delete l.BaseTextureCache[t],e},i.EMPTY=new i(new n)},{"../math":33,"../utils":77,"./BaseTexture":70,"./TextureUvs":73,"./VideoBaseTexture":74,eventemitter3:10}],73:[function(t,e,r){function i(){this.x0=0,this.y0=0,this.x1=1,this.y1=0,this.x2=1,this.y2=1,this.x3=0,this.y3=1}e.exports=i;var n=t("../math/GroupD8");i.prototype.set=function(t,e,r){var i=e.width,o=e.height;if(r){var s=n.isSwapWidthHeight(r),a=(s?t.height:t.width)/2/i,h=(s?t.width:t.height)/2/o,l=t.x/i+a,u=t.y/o+h;r=n.add(r,n.NW),this.x0=l+a*n.uX(r),this.y0=u+h*n.uY(r),r=n.add(r,2),this.x1=l+a*n.uX(r),this.y1=u+h*n.uY(r),r=n.add(r,2),this.x2=l+a*n.uX(r),this.y2=u+h*n.uY(r),r=n.add(r,2),this.x3=l+a*n.uX(r),this.y3=u+h*n.uY(r)}else this.x0=t.x/i,this.y0=t.y/o,this.x1=(t.x+t.width)/i,this.y1=t.y/o,this.x2=(t.x+t.width)/i,this.y2=(t.y+t.height)/o,this.x3=t.x/i,this.y3=(t.y+t.height)/o}},{"../math/GroupD8":30}],74:[function(t,e,r){function i(t,e){if(!t)throw new Error("No video source element specified.");(t.readyState===t.HAVE_ENOUGH_DATA||t.readyState===t.HAVE_FUTURE_DATA)&&t.width&&t.height&&(t.complete=!0),o.call(this,t,e),this.autoUpdate=!1,this._onUpdate=this._onUpdate.bind(this),this._onCanPlay=this._onCanPlay.bind(this),t.complete||(t.addEventListener("canplay",this._onCanPlay),t.addEventListener("canplaythrough",this._onCanPlay),t.addEventListener("play",this._onPlayStart.bind(this)),t.addEventListener("pause",this._onPlayStop.bind(this))),this.__loaded=!1}function n(t,e){e||(e="video/"+t.substr(t.lastIndexOf(".")+1));var r=document.createElement("source");return r.src=t,r.type=e,r}var o=t("./BaseTexture"),s=t("../utils");i.prototype=Object.create(o.prototype),i.prototype.constructor=i,e.exports=i,i.prototype._onUpdate=function(){this.autoUpdate&&(window.requestAnimationFrame(this._onUpdate),this.update())},i.prototype._onPlayStart=function(){this.autoUpdate||(window.requestAnimationFrame(this._onUpdate),this.autoUpdate=!0)},i.prototype._onPlayStop=function(){this.autoUpdate=!1},i.prototype._onCanPlay=function(){this.hasLoaded=!0,this.source&&(this.source.removeEventListener("canplay",this._onCanPlay),this.source.removeEventListener("canplaythrough",this._onCanPlay),this.width=this.source.videoWidth,this.height=this.source.videoHeight,this.source.play(),this.__loaded||(this.__loaded=!0,this.emit("loaded",this)))},i.prototype.destroy=function(){this.source&&this.source._pixiId&&(delete s.BaseTextureCache[this.source._pixiId],delete this.source._pixiId),o.prototype.destroy.call(this)},i.fromVideo=function(t,e){t._pixiId||(t._pixiId="video_"+s.uid());var r=s.BaseTextureCache[t._pixiId];return r||(r=new i(t,e),s.BaseTextureCache[t._pixiId]=r),r},i.fromUrl=function(t,e){var r=document.createElement("video");if(Array.isArray(t))for(var o=0;o<t.length;++o)r.appendChild(n(t[o].src||t[o],t[o].mime));else r.appendChild(n(t.src||t,t.mime));return r.load(),r.play(),i.fromVideo(r,e)},i.fromUrls=i.fromUrl},{"../utils":77,"./BaseTexture":70}],75:[function(t,e,r){function i(){var t=this;this._tick=function(e){t._requestId=null,t.started&&(t.update(e),t.started&&null===t._requestId&&t._emitter.listeners(s,!0)&&(t._requestId=requestAnimationFrame(t._tick)))},this._emitter=new o,this._requestId=null,this._maxElapsedMS=100,this.autoStart=!1,this.deltaTime=1,this.elapsedMS=1/n.TARGET_FPMS,this.lastTime=0,this.speed=1,this.started=!1}var n=t("../const"),o=t("eventemitter3"),s="tick";Object.defineProperties(i.prototype,{FPS:{get:function(){return 1e3/this.elapsedMS}},minFPS:{get:function(){return 1e3/this._maxElapsedMS},set:function(t){var e=Math.min(Math.max(0,t)/1e3,n.TARGET_FPMS);this._maxElapsedMS=1/e}}}),i.prototype._requestIfNeeded=function(){null===this._requestId&&this._emitter.listeners(s,!0)&&(this.lastTime=performance.now(),this._requestId=requestAnimationFrame(this._tick))},i.prototype._cancelIfNeeded=function(){null!==this._requestId&&(cancelAnimationFrame(this._requestId),this._requestId=null)},i.prototype._startIfPossible=function(){this.started?this._requestIfNeeded():this.autoStart&&this.start()},i.prototype.add=function(t,e){return this._emitter.on(s,t,e),this._startIfPossible(),this},i.prototype.addOnce=function(t,e){return this._emitter.once(s,t,e),this._startIfPossible(),this},i.prototype.remove=function(t,e){return this._emitter.off(s,t,e),this._emitter.listeners(s,!0)||this._cancelIfNeeded(),this},i.prototype.start=function(){this.started||(this.started=!0,this._requestIfNeeded())},i.prototype.stop=function(){this.started&&(this.started=!1,this._cancelIfNeeded())},i.prototype.update=function(t){var e;t=t||performance.now(),e=this.elapsedMS=t-this.lastTime,e>this._maxElapsedMS&&(e=this._maxElapsedMS),this.deltaTime=e*n.TARGET_FPMS*this.speed,this._emitter.emit(s,this.deltaTime),this.lastTime=t},e.exports=i},{"../const":22,eventemitter3:10}],76:[function(t,e,r){var i=t("./Ticker"),n=new i;n.autoStart=!0,e.exports={shared:n,Ticker:i}},{"./Ticker":75}],77:[function(t,e,r){var i=t("../const"),n=e.exports={_uid:0,_saidHello:!1,EventEmitter:t("eventemitter3"),pluginTarget:t("./pluginTarget"),async:t("async"),uid:function(){return++n._uid},hex2rgb:function(t,e){return e=e||[],e[0]=(t>>16&255)/255,e[1]=(t>>8&255)/255,e[2]=(255&t)/255,e},hex2string:function(t){return t=t.toString(16),t="000000".substr(0,6-t.length)+t,"#"+t},rgb2hex:function(t){return(255*t[0]<<16)+(255*t[1]<<8)+255*t[2]},canUseNewCanvasBlendModes:function(){if("undefined"==typeof document)return!1;var t="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/",e="AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",r=new Image;r.src=t+"AP804Oa6"+e;var i=new Image;i.src=t+"/wCKxvRF"+e;var n=document.createElement("canvas");n.width=6,n.height=1;var o=n.getContext("2d");o.globalCompositeOperation="multiply",o.drawImage(r,0,0),o.drawImage(i,2,0);var s=o.getImageData(2,0,1,1).data;return 255===s[0]&&0===s[1]&&0===s[2]},getNextPowerOfTwo:function(t){if(t>0&&0===(t&t-1))return t;for(var e=1;t>e;)e<<=1;return e},isPowerOfTwo:function(t,e){return t>0&&0===(t&t-1)&&e>0&&0===(e&e-1)},getResolutionOfUrl:function(t){var e=i.RETINA_PREFIX.exec(t);return e?parseFloat(e[1]):1},sayHello:function(t){if(!n._saidHello){if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){var e=["\n %c %c %c Pixi.js "+i.VERSION+" - ✰ "+t+" ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n","background: #ff66a5; padding:5px 0;","background: #ff66a5; padding:5px 0;","color: #ff66a5; background: #030307; padding:5px 0;","background: #ff66a5; padding:5px 0;","background: #ffc3dc; padding:5px 0;","background: #ff66a5; padding:5px 0;","color: #ff2424; background: #fff; padding:5px 0;","color: #ff2424; background: #fff; padding:5px 0;","color: #ff2424; background: #fff; padding:5px 0;"];window.console.log.apply(console,e)}else window.console&&window.console.log("Pixi.js "+i.VERSION+" - "+t+" - http://www.pixijs.com/");n._saidHello=!0}},isWebGLSupported:function(){var t={stencil:!0};try{if(!window.WebGLRenderingContext)return!1;var e=document.createElement("canvas"),r=e.getContext("webgl",t)||e.getContext("experimental-webgl",t);return!(!r||!r.getContextAttributes().stencil)}catch(i){return!1}},sign:function(t){return t?0>t?-1:1:0},removeItems:function(t,e,r){var i=t.length;if(!(e>=i||0===r)){r=e+r>i?i-e:r;for(var n=e,o=i-r;o>n;++n)t[n]=t[n+r];t.length=o}},TextureCache:{},BaseTextureCache:{}}},{"../const":22,"./pluginTarget":78,async:1,eventemitter3:10}],78:[function(t,e,r){function i(t){t.__plugins={},t.registerPlugin=function(e,r){t.__plugins[e]=r},t.prototype.initPlugins=function(){this.plugins=this.plugins||{};for(var e in t.__plugins)this.plugins[e]=new t.__plugins[e](this)},t.prototype.destroyPlugins=function(){for(var t in this.plugins)this.plugins[t].destroy(),this.plugins[t]=null;this.plugins=null}}e.exports={mixin:function(t){i(t)}}},{}],79:[function(t,e,r){var i=t("./core"),n=t("./mesh"),o=t("./extras"),s=t("./filters");i.SpriteBatch=function(){throw new ReferenceError("SpriteBatch does not exist any more, please use the new ParticleContainer instead.")},i.AssetLoader=function(){throw new ReferenceError("The loader system was overhauled in pixi v3, please see the new PIXI.loaders.Loader class.")},Object.defineProperties(i,{Stage:{get:function(){return console.warn("You do not need to use a PIXI Stage any more, you can simply render any container."),i.Container}},DisplayObjectContainer:{get:function(){return console.warn("DisplayObjectContainer has been shortened to Container, please use Container from now on."),i.Container}},Strip:{get:function(){return console.warn("The Strip class has been renamed to Mesh and moved to mesh.Mesh, please use mesh.Mesh from now on."),n.Mesh}},Rope:{get:function(){return console.warn("The Rope class has been moved to mesh.Rope, please use mesh.Rope from now on."),n.Rope}},MovieClip:{get:function(){return console.warn("The MovieClip class has been moved to extras.MovieClip, please use extras.MovieClip from now on."),o.MovieClip}},TilingSprite:{get:function(){return console.warn("The TilingSprite class has been moved to extras.TilingSprite, please use extras.TilingSprite from now on."),o.TilingSprite}},BitmapText:{get:function(){return console.warn("The BitmapText class has been moved to extras.BitmapText, please use extras.BitmapText from now on."),o.BitmapText}},blendModes:{get:function(){return console.warn("The blendModes has been moved to BLEND_MODES, please use BLEND_MODES from now on."),i.BLEND_MODES}},scaleModes:{get:function(){return console.warn("The scaleModes has been moved to SCALE_MODES, please use SCALE_MODES from now on."),i.SCALE_MODES}},BaseTextureCache:{get:function(){return console.warn("The BaseTextureCache class has been moved to utils.BaseTextureCache, please use utils.BaseTextureCache from now on."),i.utils.BaseTextureCache}},TextureCache:{get:function(){return console.warn("The TextureCache class has been moved to utils.TextureCache, please use utils.TextureCache from now on."),i.utils.TextureCache}},math:{get:function(){return console.warn("The math namespace is deprecated, please access members already accessible on PIXI."),i}}}),i.Sprite.prototype.setTexture=function(t){this.texture=t,console.warn("setTexture is now deprecated, please use the texture property, e.g : sprite.texture = texture;")},o.BitmapText.prototype.setText=function(t){this.text=t,console.warn("setText is now deprecated, please use the text property, e.g : myBitmapText.text = 'my text';")},i.Text.prototype.setText=function(t){this.text=t,console.warn("setText is now deprecated, please use the text property, e.g : myText.text = 'my text';")},i.Text.prototype.setStyle=function(t){this.style=t,console.warn("setStyle is now deprecated, please use the style property, e.g : myText.style = style;")},i.Texture.prototype.setFrame=function(t){this.frame=t,console.warn("setFrame is now deprecated, please use the frame property, e.g : myTexture.frame = frame;")},Object.defineProperties(s,{AbstractFilter:{get:function(){return console.warn("filters.AbstractFilter is an undocumented alias, please use AbstractFilter from now on."),i.AbstractFilter}},FXAAFilter:{get:function(){return console.warn("filters.FXAAFilter is an undocumented alias, please use FXAAFilter from now on."),i.FXAAFilter}},SpriteMaskFilter:{get:function(){return console.warn("filters.SpriteMaskFilter is an undocumented alias, please use SpriteMaskFilter from now on."),i.SpriteMaskFilter}}}),i.utils.uuid=function(){return console.warn("utils.uuid() is deprecated, please use utils.uid() from now on."),i.utils.uid()}},{"./core":29,"./extras":86,"./filters":103,"./mesh":128}],80:[function(t,e,r){function i(t,e){n.Container.call(this),e=e||{},this.textWidth=0,this.textHeight=0,this._glyphs=[],this._font={tint:void 0!==e.tint?e.tint:16777215,align:e.align||"left",name:null,size:0},this.font=e.font,this._text=t,this.maxWidth=0,this.maxLineHeight=0,this.dirty=!1,this.updateText()}var n=t("../core");i.prototype=Object.create(n.Container.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{tint:{get:function(){return this._font.tint},set:function(t){this._font.tint="number"==typeof t&&t>=0?t:16777215,this.dirty=!0}},align:{get:function(){return this._font.align},set:function(t){this._font.align=t||"left",this.dirty=!0}},font:{get:function(){return this._font},set:function(t){t&&("string"==typeof t?(t=t.split(" "),this._font.name=1===t.length?t[0]:t.slice(1).join(" "),this._font.size=t.length>=2?parseInt(t[0],10):i.fonts[this._font.name].size):(this._font.name=t.name,this._font.size="number"==typeof t.size?t.size:parseInt(t.size,10)),this.dirty=!0)}},text:{get:function(){return this._text},set:function(t){t=t.toString()||" ",this._text!==t&&(this._text=t,this.dirty=!0)}}}),i.prototype.updateText=function(){for(var t=i.fonts[this._font.name],e=new n.Point,r=null,o=[],s=0,a=0,h=[],l=0,u=this._font.size/t.size,c=-1,p=0,d=0;d<this.text.length;d++){var f=this.text.charCodeAt(d);if(c=/(\s)/.test(this.text.charAt(d))?d:c,/(?:\r\n|\r|\n)/.test(this.text.charAt(d)))h.push(s),a=Math.max(a,s),l++,e.x=0,e.y+=t.lineHeight,r=null;else if(-1!==c&&this.maxWidth>0&&e.x*u>this.maxWidth)n.utils.removeItems(o,c,d-c),d=c,c=-1,h.push(s),a=Math.max(a,s),l++,e.x=0,e.y+=t.lineHeight,r=null;else{var v=t.chars[f];v&&(r&&v.kerning[r]&&(e.x+=v.kerning[r]),o.push({texture:v.texture,line:l,charCode:f,position:new n.Point(e.x+v.xOffset,e.y+v.yOffset)}),s=e.x+(v.texture.width+v.xOffset),e.x+=v.xAdvance,p=Math.max(p,v.yOffset+v.texture.height),r=f)}}h.push(s),a=Math.max(a,s);var g=[];for(d=0;l>=d;d++){var y=0;"right"===this._font.align?y=a-h[d]:"center"===this._font.align&&(y=(a-h[d])/2),g.push(y)}var m=o.length,x=this.tint;for(d=0;m>d;d++){var b=this._glyphs[d];b?b.texture=o[d].texture:(b=new n.Sprite(o[d].texture),this._glyphs.push(b)),b.position.x=(o[d].position.x+g[o[d].line])*u,b.position.y=o[d].position.y*u,b.scale.x=b.scale.y=u,b.tint=x,b.parent||this.addChild(b)}for(d=m;d<this._glyphs.length;++d)this.removeChild(this._glyphs[d]);this.textWidth=a*u,this.textHeight=(e.y+t.lineHeight)*u,this.maxLineHeight=p*u},i.prototype.updateTransform=function(){this.validate(),this.containerUpdateTransform()},i.prototype.getLocalBounds=function(){return this.validate(),n.Container.prototype.getLocalBounds.call(this)},i.prototype.validate=function(){this.dirty&&(this.updateText(),this.dirty=!1)},i.fonts={}},{"../core":29}],81:[function(t,e,r){function i(t){n.Sprite.call(this,t[0]instanceof n.Texture?t[0]:t[0].texture),this._textures=null,this._durations=null,this.textures=t,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this._currentTime=0,this.playing=!1}var n=t("../core");i.prototype=Object.create(n.Sprite.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{totalFrames:{get:function(){return this._textures.length}},textures:{get:function(){return this._textures},set:function(t){if(t[0]instanceof n.Texture)this._textures=t,this._durations=null;else{this._textures=[],this._durations=[];for(var e=0;e<t.length;e++)this._textures.push(t[e].texture),this._durations.push(t[e].time)}}},currentFrame:{get:function(){var t=Math.floor(this._currentTime)%this._textures.length;return 0>t&&(t+=this._textures.length),t}}}),i.prototype.stop=function(){this.playing&&(this.playing=!1,n.ticker.shared.remove(this.update,this))},i.prototype.play=function(){this.playing||(this.playing=!0,n.ticker.shared.add(this.update,this))},i.prototype.gotoAndStop=function(t){this.stop(),this._currentTime=t,this._texture=this._textures[this.currentFrame]},i.prototype.gotoAndPlay=function(t){this._currentTime=t,this.play()},i.prototype.update=function(t){var e=this.animationSpeed*t;if(null!==this._durations){var r=this._currentTime%1*this._durations[this.currentFrame];for(r+=e/60*1e3;0>r;)this._currentTime--,r+=this._durations[this.currentFrame];var i=Math.sign(this.animationSpeed*t);for(this._currentTime=Math.floor(this._currentTime);r>=this._durations[this.currentFrame];)r-=this._durations[this.currentFrame]*i,this._currentTime+=i;this._currentTime+=r/this._durations[this.currentFrame]}else this._currentTime+=e;this._currentTime<0&&!this.loop?(this.gotoAndStop(0),this.onComplete&&this.onComplete()):this._currentTime>=this._textures.length&&!this.loop?(this.gotoAndStop(this._textures.length-1),this.onComplete&&this.onComplete()):this._texture=this._textures[this.currentFrame]},i.prototype.destroy=function(){this.stop(),n.Sprite.prototype.destroy.call(this)},i.fromFrames=function(t){for(var e=[],r=0;r<t.length;++r)e.push(new n.Texture.fromFrame(t[r]));return new i(e)},i.fromImages=function(t){for(var e=[],r=0;r<t.length;++r)e.push(new n.Texture.fromImage(t[r]));return new i(e)}},{"../core":29}],82:[function(t,e,r){function i(t,e,r){n.Sprite.call(this,t),this.tileScale=new n.Point(1,1),this.tilePosition=new n.Point(0,0),this._width=e||100,this._height=r||100,this._uvs=new n.TextureUvs,this._canvasPattern=null,this.shader=new n.AbstractFilter(["precision lowp float;","attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec4 aColor;","uniform mat3 projectionMatrix;","uniform vec4 uFrame;","uniform vec4 uTransform;","varying vec2 vTextureCoord;","varying vec4 vColor;","void main(void){","   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","   vec2 coord = aTextureCoord;","   coord -= uTransform.xy;","   coord /= uTransform.zw;","   vTextureCoord = coord;","   vColor = vec4(aColor.rgb * aColor.a, aColor.a);","}"].join("\n"),["precision lowp float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform vec4 uFrame;","uniform vec2 uPixelSize;","void main(void){","   vec2 coord = mod(vTextureCoord, uFrame.zw);","   coord = clamp(coord, uPixelSize, uFrame.zw - uPixelSize);","   coord += uFrame.xy;","   gl_FragColor =  texture2D(uSampler, coord) * vColor ;","}"].join("\n"),{uFrame:{type:"4fv",value:[0,0,1,1]},uTransform:{type:"4fv",value:[0,0,1,1]},uPixelSize:{type:"2fv",value:[1,1]}})}var n=t("../core"),o=new n.Point,s=t("../core/renderers/canvas/utils/CanvasTinter");i.prototype=Object.create(n.Sprite.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{width:{get:function(){return this._width},set:function(t){this._width=t}},height:{get:function(){return this._height},set:function(t){this._height=t}}}),i.prototype._onTextureUpdate=function(){},i.prototype._renderWebGL=function(t){var e=this._texture;if(e&&e._uvs){var r=e._uvs,i=e._frame.width,n=e._frame.height,o=e.baseTexture.width,s=e.baseTexture.height;e._uvs=this._uvs,e._frame.width=this.width,e._frame.height=this.height,this.shader.uniforms.uPixelSize.value[0]=1/o,this.shader.uniforms.uPixelSize.value[1]=1/s,this.shader.uniforms.uFrame.value[0]=r.x0,this.shader.uniforms.uFrame.value[1]=r.y0,this.shader.uniforms.uFrame.value[2]=r.x1-r.x0,this.shader.uniforms.uFrame.value[3]=r.y2-r.y0,this.shader.uniforms.uTransform.value[0]=this.tilePosition.x%(i*this.tileScale.x)/this._width,this.shader.uniforms.uTransform.value[1]=this.tilePosition.y%(n*this.tileScale.y)/this._height,this.shader.uniforms.uTransform.value[2]=o/this._width*this.tileScale.x,this.shader.uniforms.uTransform.value[3]=s/this._height*this.tileScale.y,t.setObjectRenderer(t.plugins.sprite),t.plugins.sprite.render(this),e._uvs=r,e._frame.width=i,e._frame.height=n}},i.prototype._renderCanvas=function(t){var e=this._texture;if(e.baseTexture.hasLoaded){var r=t.context,i=this.worldTransform,o=t.resolution,a=e.baseTexture,h=this.tilePosition.x/this.tileScale.x%e._frame.width,l=this.tilePosition.y/this.tileScale.y%e._frame.height;if(!this._canvasPattern){var u=new n.CanvasBuffer(e._frame.width*o,e._frame.height*o);16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=s.getTintedTexture(this,this.tint)),u.context.drawImage(this.tintedTexture,0,0)):u.context.drawImage(a.source,-e._frame.x*o,-e._frame.y*o),this._canvasPattern=u.context.createPattern(u.canvas,"repeat")}r.globalAlpha=this.worldAlpha,r.setTransform(i.a*o,i.b*o,i.c*o,i.d*o,i.tx*o,i.ty*o),r.scale(this.tileScale.x/o,this.tileScale.y/o),r.translate(h+this.anchor.x*-this._width,l+this.anchor.y*-this._height);var c=t.blendModes[this.blendMode];c!==t.context.globalCompositeOperation&&(r.globalCompositeOperation=c),r.fillStyle=this._canvasPattern,r.fillRect(-h,-l,this._width*o/this.tileScale.x,this._height*o/this.tileScale.y)}},i.prototype.getBounds=function(){var t,e,r,i,n=this._width,o=this._height,s=n*(1-this.anchor.x),a=n*-this.anchor.x,h=o*(1-this.anchor.y),l=o*-this.anchor.y,u=this.worldTransform,c=u.a,p=u.b,d=u.c,f=u.d,v=u.tx,g=u.ty,y=c*a+d*l+v,m=f*l+p*a+g,x=c*s+d*l+v,b=f*l+p*s+g,_=c*s+d*h+v,T=f*h+p*s+g,E=c*a+d*h+v,S=f*h+p*a+g;t=y,t=t>x?x:t,t=t>_?_:t,t=t>E?E:t,r=m,r=r>b?b:r,r=r>T?T:r,r=r>S?S:r,e=y,e=x>e?x:e,e=_>e?_:e,e=E>e?E:e,i=m,i=b>i?b:i,i=T>i?T:i,i=S>i?S:i;var w=this._bounds;return w.x=t,w.width=e-t,w.y=r,w.height=i-r,this._currentBounds=w,w},i.prototype.containsPoint=function(t){this.worldTransform.applyInverse(t,o);var e,r=this._width,i=this._height,n=-r*this.anchor.x;return o.x>n&&o.x<n+r&&(e=-i*this.anchor.y,o.y>e&&o.y<e+i)},i.prototype.destroy=function(){n.Sprite.prototype.destroy.call(this),this.tileScale=null,this._tileScaleOffset=null,this.tilePosition=null,this._uvs=null},i.fromFrame=function(t,e,r){var o=n.utils.TextureCache[t];if(!o)throw new Error('The frameId "'+t+'" does not exist in the texture cache '+this);return new i(o,e,r)},i.fromImage=function(t,e,r,o,s){return new i(n.Texture.fromImage(t,o,s),e,r)}},{"../core":29,"../core/renderers/canvas/utils/CanvasTinter":48}],83:[function(t,e,r){var i=t("../core"),n=i.DisplayObject,o=new i.Matrix;n.prototype._cacheAsBitmap=!1,n.prototype._originalRenderWebGL=null,n.prototype._originalRenderCanvas=null,n.prototype._originalUpdateTransform=null,n.prototype._originalHitTest=null,n.prototype._originalDestroy=null,n.prototype._cachedSprite=null,Object.defineProperties(n.prototype,{cacheAsBitmap:{get:function(){return this._cacheAsBitmap},set:function(t){this._cacheAsBitmap!==t&&(this._cacheAsBitmap=t,t?(this._originalRenderWebGL=this.renderWebGL,this._originalRenderCanvas=this.renderCanvas,this._originalUpdateTransform=this.updateTransform,this._originalGetBounds=this.getBounds,this._originalDestroy=this.destroy,this._originalContainsPoint=this.containsPoint,this.renderWebGL=this._renderCachedWebGL,this.renderCanvas=this._renderCachedCanvas,this.destroy=this._cacheAsBitmapDestroy):(this._cachedSprite&&this._destroyCachedDisplayObject(),this.renderWebGL=this._originalRenderWebGL,this.renderCanvas=this._originalRenderCanvas,this.getBounds=this._originalGetBounds,this.destroy=this._originalDestroy,this.updateTransform=this._originalUpdateTransform,this.containsPoint=this._originalContainsPoint))}}}),n.prototype._renderCachedWebGL=function(t){!this.visible||this.worldAlpha<=0||!this.renderable||(this._initCachedDisplayObject(t),this._cachedSprite.worldAlpha=this.worldAlpha,t.setObjectRenderer(t.plugins.sprite),t.plugins.sprite.render(this._cachedSprite))},n.prototype._initCachedDisplayObject=function(t){if(!this._cachedSprite){t.currentRenderer.flush();var e=this.getLocalBounds().clone();if(this._filters){var r=this._filters[0].padding;e.x-=r,e.y-=r,e.width+=2*r,e.height+=2*r}var n=t.currentRenderTarget,s=t.filterManager.filterStack,a=new i.RenderTexture(t,0|e.width,0|e.height),h=o;h.tx=-e.x,h.ty=-e.y,this.renderWebGL=this._originalRenderWebGL,a.render(this,h,!0,!0),t.setRenderTarget(n),t.filterManager.filterStack=s,this.renderWebGL=this._renderCachedWebGL,this.updateTransform=this.displayObjectUpdateTransform,this.getBounds=this._getCachedBounds,this._cachedSprite=new i.Sprite(a),this._cachedSprite.worldTransform=this.worldTransform,this._cachedSprite.anchor.x=-(e.x/e.width),this._cachedSprite.anchor.y=-(e.y/e.height),this.updateTransform(),this.containsPoint=this._cachedSprite.containsPoint.bind(this._cachedSprite)}},n.prototype._renderCachedCanvas=function(t){!this.visible||this.worldAlpha<=0||!this.renderable||(this._initCachedDisplayObjectCanvas(t),this._cachedSprite.worldAlpha=this.worldAlpha,this._cachedSprite.renderCanvas(t))},n.prototype._initCachedDisplayObjectCanvas=function(t){if(!this._cachedSprite){var e=this.getLocalBounds(),r=t.context,n=new i.RenderTexture(t,0|e.width,0|e.height),s=o;s.tx=-e.x,s.ty=-e.y,this.renderCanvas=this._originalRenderCanvas,n.render(this,s,!0),t.context=r,this.renderCanvas=this._renderCachedCanvas,this.updateTransform=this.displayObjectUpdateTransform,this.getBounds=this._getCachedBounds,this._cachedSprite=new i.Sprite(n),this._cachedSprite.worldTransform=this.worldTransform,this._cachedSprite.anchor.x=-(e.x/e.width),this._cachedSprite.anchor.y=-(e.y/e.height),this.updateTransform(),this.containsPoint=this._cachedSprite.containsPoint.bind(this._cachedSprite)}},n.prototype._getCachedBounds=function(){return this._cachedSprite._currentBounds=null,this._cachedSprite.getBounds()},n.prototype._destroyCachedDisplayObject=function(){this._cachedSprite._texture.destroy(),this._cachedSprite=null},n.prototype._cacheAsBitmapDestroy=function(){this.cacheAsBitmap=!1,this._originalDestroy()}},{"../core":29}],84:[function(t,e,r){var i=t("../core");i.DisplayObject.prototype.name=null,i.Container.prototype.getChildByName=function(t){for(var e=0;e<this.children.length;e++)if(this.children[e].name===t)return this.children[e];return null}},{"../core":29}],85:[function(t,e,r){var i=t("../core");i.DisplayObject.prototype.getGlobalPosition=function(t){return t=t||new i.Point,this.parent?(this.displayObjectUpdateTransform(),t.x=this.worldTransform.tx,t.y=this.worldTransform.ty):(t.x=this.position.x,t.y=this.position.y),t}},{"../core":29}],86:[function(t,e,r){t("./cacheAsBitmap"),t("./getChildByName"),t("./getGlobalPosition"),e.exports={MovieClip:t("./MovieClip"),TilingSprite:t("./TilingSprite"),BitmapText:t("./BitmapText")}},{"./BitmapText":80,"./MovieClip":81,"./TilingSprite":82,"./cacheAsBitmap":83,"./getChildByName":84,"./getGlobalPosition":85}],87:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nuniform vec4 dimensions;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 uv = gl_FragCoord.xy;\n\n    vec3 col = texture2D(uSampler, floor( uv / pixelSize ) * pixelSize / dimensions.xy).rgb;\n\n    float gray = (col.r + col.g + col.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    vec2 p = mod( uv / ( pixelSize * 0.5 ), 2.0) - vec2(1.0);\n    col = col * character(n, p);\n\n    gl_FragColor = vec4(col, 1.0);\n}\n",{dimensions:{type:"4fv",value:new Float32Array([0,0,0,0])},pixelSize:{type:"1f",value:8}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{size:{get:function(){return this.uniforms.pixelSize.value},set:function(t){this.uniforms.pixelSize.value=t}}})},{"../../core":29}],88:[function(t,e,r){function i(){n.AbstractFilter.call(this),this.blurXFilter=new o,this.blurYFilter=new s,this.defaultFilter=new n.AbstractFilter}var n=t("../../core"),o=t("../blur/BlurXFilter"),s=t("../blur/BlurYFilter");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager.getRenderTarget(!0);this.defaultFilter.applyFilter(t,e,r),this.blurXFilter.applyFilter(t,e,i),t.blendModeManager.setBlendMode(n.BLEND_MODES.SCREEN),this.blurYFilter.applyFilter(t,i,r),
t.blendModeManager.setBlendMode(n.BLEND_MODES.NORMAL),t.filterManager.returnRenderTarget(i)},Object.defineProperties(i.prototype,{blur:{get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=this.blurYFilter.blur=t}},blurX:{get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=t}},blurY:{get:function(){return this.blurYFilter.blur},set:function(t){this.blurYFilter.blur=t}}})},{"../../core":29,"../blur/BlurXFilter":91,"../blur/BlurYFilter":92}],89:[function(t,e,r){function i(t,e){n.AbstractFilter.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform float strength;\nuniform float dirX;\nuniform float dirY;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec2 vBlurTexCoords[3];\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    vBlurTexCoords[0] = aTextureCoord + vec2( (0.004 * strength) * dirX, (0.004 * strength) * dirY );\n    vBlurTexCoords[1] = aTextureCoord + vec2( (0.008 * strength) * dirX, (0.008 * strength) * dirY );\n    vBlurTexCoords[2] = aTextureCoord + vec2( (0.012 * strength) * dirX, (0.012 * strength) * dirY );\n\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision lowp float;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vBlurTexCoords[3];\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = vec4(0.0);\n\n    gl_FragColor += texture2D(uSampler, vTextureCoord     ) * 0.3989422804014327;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 0]) * 0.2419707245191454;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 1]) * 0.05399096651318985;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 2]) * 0.004431848411938341;\n}\n",{strength:{type:"1f",value:1},dirX:{type:"1f",value:t||0},dirY:{type:"1f",value:e||0}}),this.defaultFilter=new n.AbstractFilter,this.passes=1,this.dirX=t||0,this.dirY=e||0,this.strength=4}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r,i){var n=this.getShader(t);if(this.uniforms.strength.value=this.strength/4/this.passes*(e.frame.width/e.size.width),1===this.passes)t.filterManager.applyFilter(n,e,r,i);else{var o=t.filterManager.getRenderTarget(!0);t.filterManager.applyFilter(n,e,o,i);for(var s=0;s<this.passes-2;s++)t.filterManager.applyFilter(n,o,o,i);t.filterManager.applyFilter(n,o,r,i),t.filterManager.returnRenderTarget(o)}},Object.defineProperties(i.prototype,{blur:{get:function(){return this.strength},set:function(t){this.padding=.5*t,this.strength=t}},dirX:{get:function(){return this.dirX},set:function(t){this.uniforms.dirX.value=t}},dirY:{get:function(){return this.dirY},set:function(t){this.uniforms.dirY.value=t}}})},{"../../core":29}],90:[function(t,e,r){function i(){n.AbstractFilter.call(this),this.blurXFilter=new o,this.blurYFilter=new s}var n=t("../../core"),o=t("./BlurXFilter"),s=t("./BlurYFilter");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager.getRenderTarget(!0);this.blurXFilter.applyFilter(t,e,i),this.blurYFilter.applyFilter(t,i,r),t.filterManager.returnRenderTarget(i)},Object.defineProperties(i.prototype,{blur:{get:function(){return this.blurXFilter.blur},set:function(t){this.padding=.5*Math.abs(t),this.blurXFilter.blur=this.blurYFilter.blur=t}},passes:{get:function(){return this.blurXFilter.passes},set:function(t){this.blurXFilter.passes=this.blurYFilter.passes=t}},blurX:{get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=t}},blurY:{get:function(){return this.blurYFilter.blur},set:function(t){this.blurYFilter.blur=t}}})},{"../../core":29,"./BlurXFilter":91,"./BlurYFilter":92}],91:[function(t,e,r){function i(){n.AbstractFilter.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform float strength;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec2 vBlurTexCoords[6];\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    vBlurTexCoords[ 0] = aTextureCoord + vec2(-0.012 * strength, 0.0);\n    vBlurTexCoords[ 1] = aTextureCoord + vec2(-0.008 * strength, 0.0);\n    vBlurTexCoords[ 2] = aTextureCoord + vec2(-0.004 * strength, 0.0);\n    vBlurTexCoords[ 3] = aTextureCoord + vec2( 0.004 * strength, 0.0);\n    vBlurTexCoords[ 4] = aTextureCoord + vec2( 0.008 * strength, 0.0);\n    vBlurTexCoords[ 5] = aTextureCoord + vec2( 0.012 * strength, 0.0);\n\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision lowp float;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vBlurTexCoords[6];\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = vec4(0.0);\n\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 0])*0.004431848411938341;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 1])*0.05399096651318985;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 2])*0.2419707245191454;\n    gl_FragColor += texture2D(uSampler, vTextureCoord     )*0.3989422804014327;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 3])*0.2419707245191454;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 4])*0.05399096651318985;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 5])*0.004431848411938341;\n}\n",{strength:{type:"1f",value:1}}),this.passes=1,this.strength=4}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r,i){var n=this.getShader(t);if(this.uniforms.strength.value=this.strength/4/this.passes*(e.frame.width/e.size.width),1===this.passes)t.filterManager.applyFilter(n,e,r,i);else{for(var o=t.filterManager.getRenderTarget(!0),s=e,a=o,h=0;h<this.passes-1;h++){t.filterManager.applyFilter(n,s,a,!0);var l=a;a=s,s=l}t.filterManager.applyFilter(n,s,r,i),t.filterManager.returnRenderTarget(o)}},Object.defineProperties(i.prototype,{blur:{get:function(){return this.strength},set:function(t){this.padding=.5*Math.abs(t),this.strength=t}}})},{"../../core":29}],92:[function(t,e,r){function i(){n.AbstractFilter.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform float strength;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec2 vBlurTexCoords[6];\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    vBlurTexCoords[ 0] = aTextureCoord + vec2(0.0, -0.012 * strength);\n    vBlurTexCoords[ 1] = aTextureCoord + vec2(0.0, -0.008 * strength);\n    vBlurTexCoords[ 2] = aTextureCoord + vec2(0.0, -0.004 * strength);\n    vBlurTexCoords[ 3] = aTextureCoord + vec2(0.0,  0.004 * strength);\n    vBlurTexCoords[ 4] = aTextureCoord + vec2(0.0,  0.008 * strength);\n    vBlurTexCoords[ 5] = aTextureCoord + vec2(0.0,  0.012 * strength);\n\n   vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision lowp float;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vBlurTexCoords[6];\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = vec4(0.0);\n\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 0])*0.004431848411938341;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 1])*0.05399096651318985;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 2])*0.2419707245191454;\n    gl_FragColor += texture2D(uSampler, vTextureCoord     )*0.3989422804014327;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 3])*0.2419707245191454;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 4])*0.05399096651318985;\n    gl_FragColor += texture2D(uSampler, vBlurTexCoords[ 5])*0.004431848411938341;\n}\n",{strength:{type:"1f",value:1}}),this.passes=1,this.strength=4}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r,i){var n=this.getShader(t);if(this.uniforms.strength.value=Math.abs(this.strength)/4/this.passes*(e.frame.height/e.size.height),1===this.passes)t.filterManager.applyFilter(n,e,r,i);else{for(var o=t.filterManager.getRenderTarget(!0),s=e,a=o,h=0;h<this.passes-1;h++){t.filterManager.applyFilter(n,s,a,!0);var l=a;a=s,s=l}t.filterManager.applyFilter(n,s,r,i),t.filterManager.returnRenderTarget(o)}},Object.defineProperties(i.prototype,{blur:{get:function(){return this.strength},set:function(t){this.padding=.5*Math.abs(t),this.strength=t}}})},{"../../core":29}],93:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 delta;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta * percent);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n",{delta:{type:"v2",value:{x:.1,y:0}}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i},{"../../core":29}],94:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[25];\n\nvoid main(void)\n{\n\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    gl_FragColor.r = (m[0] * c.r);\n        gl_FragColor.r += (m[1] * c.g);\n        gl_FragColor.r += (m[2] * c.b);\n        gl_FragColor.r += (m[3] * c.a);\n        gl_FragColor.r += m[4] * c.a;\n\n    gl_FragColor.g = (m[5] * c.r);\n        gl_FragColor.g += (m[6] * c.g);\n        gl_FragColor.g += (m[7] * c.b);\n        gl_FragColor.g += (m[8] * c.a);\n        gl_FragColor.g += m[9] * c.a;\n\n     gl_FragColor.b = (m[10] * c.r);\n        gl_FragColor.b += (m[11] * c.g);\n        gl_FragColor.b += (m[12] * c.b);\n        gl_FragColor.b += (m[13] * c.a);\n        gl_FragColor.b += m[14] * c.a;\n\n     gl_FragColor.a = (m[15] * c.r);\n        gl_FragColor.a += (m[16] * c.g);\n        gl_FragColor.a += (m[17] * c.b);\n        gl_FragColor.a += (m[18] * c.a);\n        gl_FragColor.a += m[19] * c.a;\n\n}\n",{m:{type:"1fv",value:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype._loadMatrix=function(t,e){e=!!e;var r=t;e&&(this._multiply(r,this.uniforms.m.value,t),r=this._colorMatrix(r)),this.uniforms.m.value=r},i.prototype._multiply=function(t,e,r){return t[0]=e[0]*r[0]+e[1]*r[5]+e[2]*r[10]+e[3]*r[15],t[1]=e[0]*r[1]+e[1]*r[6]+e[2]*r[11]+e[3]*r[16],t[2]=e[0]*r[2]+e[1]*r[7]+e[2]*r[12]+e[3]*r[17],t[3]=e[0]*r[3]+e[1]*r[8]+e[2]*r[13]+e[3]*r[18],t[4]=e[0]*r[4]+e[1]*r[9]+e[2]*r[14]+e[3]*r[19],t[5]=e[5]*r[0]+e[6]*r[5]+e[7]*r[10]+e[8]*r[15],t[6]=e[5]*r[1]+e[6]*r[6]+e[7]*r[11]+e[8]*r[16],t[7]=e[5]*r[2]+e[6]*r[7]+e[7]*r[12]+e[8]*r[17],t[8]=e[5]*r[3]+e[6]*r[8]+e[7]*r[13]+e[8]*r[18],t[9]=e[5]*r[4]+e[6]*r[9]+e[7]*r[14]+e[8]*r[19],t[10]=e[10]*r[0]+e[11]*r[5]+e[12]*r[10]+e[13]*r[15],t[11]=e[10]*r[1]+e[11]*r[6]+e[12]*r[11]+e[13]*r[16],t[12]=e[10]*r[2]+e[11]*r[7]+e[12]*r[12]+e[13]*r[17],t[13]=e[10]*r[3]+e[11]*r[8]+e[12]*r[13]+e[13]*r[18],t[14]=e[10]*r[4]+e[11]*r[9]+e[12]*r[14]+e[13]*r[19],t[15]=e[15]*r[0]+e[16]*r[5]+e[17]*r[10]+e[18]*r[15],t[16]=e[15]*r[1]+e[16]*r[6]+e[17]*r[11]+e[18]*r[16],t[17]=e[15]*r[2]+e[16]*r[7]+e[17]*r[12]+e[18]*r[17],t[18]=e[15]*r[3]+e[16]*r[8]+e[17]*r[13]+e[18]*r[18],t[19]=e[15]*r[4]+e[16]*r[9]+e[17]*r[14]+e[18]*r[19],t},i.prototype._colorMatrix=function(t){var e=new Float32Array(t);return e[4]/=255,e[9]/=255,e[14]/=255,e[19]/=255,e},i.prototype.brightness=function(t,e){var r=[t,0,0,0,0,0,t,0,0,0,0,0,t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},i.prototype.greyscale=function(t,e){var r=[t,t,t,0,0,t,t,t,0,0,t,t,t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},i.prototype.grayscale=i.prototype.greyscale,i.prototype.blackAndWhite=function(t){var e=[.3,.6,.1,0,0,.3,.6,.1,0,0,.3,.6,.1,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.hue=function(t,e){t=(t||0)/180*Math.PI;var r=Math.cos(t),i=Math.sin(t),n=.213,o=.715,s=.072,a=[n+r*(1-n)+i*-n,o+r*-o+i*-o,s+r*-s+i*(1-s),0,0,n+r*-n+.143*i,o+r*(1-o)+.14*i,s+r*-s+i*-.283,0,0,n+r*-n+i*-(1-n),o+r*-o+i*o,s+r*(1-s)+i*s,0,0,0,0,0,1,0];this._loadMatrix(a,e)},i.prototype.contrast=function(t,e){var r=(t||0)+1,i=-128*(r-1),n=[r,0,0,0,i,0,r,0,0,i,0,0,r,0,i,0,0,0,1,0];this._loadMatrix(n,e)},i.prototype.saturate=function(t,e){var r=2*(t||0)/3+1,i=(r-1)*-.5,n=[r,i,i,0,0,i,r,i,0,0,i,i,r,0,0,0,0,0,1,0];this._loadMatrix(n,e)},i.prototype.desaturate=function(t){this.saturate(-1)},i.prototype.negative=function(t){var e=[0,1,1,0,0,1,0,1,0,0,1,1,0,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.sepia=function(t){var e=[.393,.7689999,.18899999,0,0,.349,.6859999,.16799999,0,0,.272,.5339999,.13099999,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.technicolor=function(t){var e=[1.9125277891456083,-.8545344976951645,-.09155508482755585,0,11.793603434377337,-.3087833385928097,1.7658908555458428,-.10601743074722245,0,-70.35205161461398,-.231103377548616,-.7501899197440212,1.847597816108189,0,30.950940869491138,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.polaroid=function(t){var e=[1.438,-.062,-.062,0,0,-.122,1.378,-.122,0,0,-.016,-.016,1.483,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.toBGR=function(t){var e=[0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.kodachrome=function(t){var e=[1.1285582396593525,-.3967382283601348,-.03992559172921793,0,63.72958762196502,-.16404339962244616,1.0835251566291304,-.05498805115633132,0,24.732407896706203,-.16786010706155763,-.5603416277695248,1.6014850761964943,0,35.62982807460946,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.browni=function(t){var e=[.5997023498159715,.34553243048391263,-.2708298674538042,0,47.43192855600873,-.037703249837783157,.8609577587992641,.15059552388459913,0,-36.96841498319127,.24113635128153335,-.07441037908422492,.44972182064877153,0,-7.562075277591283,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.vintage=function(t){var e=[.6279345635605994,.3202183420819367,-.03965408211312453,0,9.651285835294123,.02578397704808868,.6441188644374771,.03259127616149294,0,7.462829176470591,.0466055556782719,-.0851232987247891,.5241648018700465,0,5.159190588235296,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.colorTone=function(t,e,r,i,n){t=t||.2,e=e||.15,r=r||16770432,i=i||3375104;var o=(r>>16&255)/255,s=(r>>8&255)/255,a=(255&r)/255,h=(i>>16&255)/255,l=(i>>8&255)/255,u=(255&i)/255,c=[.3,.59,.11,0,0,o,s,a,t,0,h,l,u,e,0,o-h,s-l,a-u,0,0];this._loadMatrix(c,n)},i.prototype.night=function(t,e){t=t||.1;var r=[-2*t,-t,0,0,0,-t,0,t,0,0,0,t,2*t,0,0,0,0,0,1,0];this._loadMatrix(r,e)},i.prototype.predator=function(t,e){var r=[11.224130630493164*t,-4.794486999511719*t,-2.8746118545532227*t,0*t,.40342438220977783*t,-3.6330697536468506*t,9.193157196044922*t,-2.951810836791992*t,0*t,-1.316135048866272*t,-3.2184197902679443*t,-4.2375030517578125*t,7.476448059082031*t,0*t,.8044459223747253*t,0,0,0,1,0];this._loadMatrix(r,e)},i.prototype.lsd=function(t){var e=[2,-.4,.5,0,0,-.5,2,-.4,0,0,-.4,-.5,3,0,0,0,0,0,1,0];this._loadMatrix(e,t)},i.prototype.reset=function(){var t=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];this._loadMatrix(t,!1)},Object.defineProperties(i.prototype,{matrix:{get:function(){return this.uniforms.m.value},set:function(t){this.uniforms.m.value=t}}})},{"../../core":29}],95:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float step;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    color = floor(color * step) / step;\n\n    gl_FragColor = color;\n}\n",{step:{type:"1f",value:5}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{step:{get:function(){return this.uniforms.step.value},set:function(t){this.uniforms.step.value=t}}})},{"../../core":29}],96:[function(t,e,r){function i(t,e,r){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",{matrix:{type:"1fv",value:new Float32Array(t)},texelSize:{type:"v2",value:{x:1/e,y:1/r}}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{matrix:{get:function(){return this.uniforms.matrix.value},set:function(t){this.uniforms.matrix.value=new Float32Array(t)}},width:{get:function(){return 1/this.uniforms.texelSize.value.x},set:function(t){this.uniforms.texelSize.value.x=1/t}},height:{get:function(){return 1/this.uniforms.texelSize.value.y},set:function(t){this.uniforms.texelSize.value.y=1/t}}})},{"../../core":29}],97:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n")}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i},{"../../core":29}],98:[function(t,e,r){function i(t,e){var r=new n.Matrix;t.renderable=!1,n.AbstractFilter.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMapCoord;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vMapCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision mediump float;\n\nvarying vec2 vMapCoord;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec2 scale;\n\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nvoid main(void)\n{\n   vec4 map =  texture2D(mapSampler, vMapCoord);\n\n   map -= 0.5;\n   map.xy *= scale;\n\n   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y));\n}\n",{mapSampler:{type:"sampler2D",value:t.texture},otherMatrix:{type:"mat3",value:r.toArray(!0)},scale:{type:"v2",value:{x:1,y:1}}}),this.maskSprite=t,this.maskMatrix=r,null!==e&&void 0!==e||(e=20),this.scale=new n.Point(e,e)}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager;i.calculateMappedMatrix(e.frame,this.maskSprite,this.maskMatrix),this.uniforms.otherMatrix.value=this.maskMatrix.toArray(!0),this.uniforms.scale.value.x=this.scale.x*(1/e.frame.width),this.uniforms.scale.value.y=this.scale.y*(1/e.frame.height);var n=this.getShader(t);i.applyFilter(n,e,r)},Object.defineProperties(i.prototype,{map:{get:function(){return this.uniforms.mapSampler.value},set:function(t){this.uniforms.mapSampler.value=t}}})},{"../../core":29}],99:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 dimensions;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * dimensions.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",{scale:{type:"1f",value:1},angle:{type:"1f",value:5},dimensions:{type:"4fv",value:[0,0,0,0]}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{scale:{get:function(){return this.uniforms.scale.value},set:function(t){this.uniforms.scale.value=t}},angle:{get:function(){return this.uniforms.angle.value},set:function(t){this.uniforms.angle.value=t}}})},{"../../core":29}],100:[function(t,e,r){function i(){n.AbstractFilter.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform float strength;\nuniform vec2 offset;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec2 vBlurTexCoords[6];\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3((aVertexPosition+offset), 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    vBlurTexCoords[ 0] = aTextureCoord + vec2(0.0, -0.012 * strength);\n    vBlurTexCoords[ 1] = aTextureCoord + vec2(0.0, -0.008 * strength);\n    vBlurTexCoords[ 2] = aTextureCoord + vec2(0.0, -0.004 * strength);\n    vBlurTexCoords[ 3] = aTextureCoord + vec2(0.0,  0.004 * strength);\n    vBlurTexCoords[ 4] = aTextureCoord + vec2(0.0,  0.008 * strength);\n    vBlurTexCoords[ 5] = aTextureCoord + vec2(0.0,  0.012 * strength);\n\n   vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n","precision lowp float;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vBlurTexCoords[6];\nvarying vec4 vColor;\n\nuniform vec3 color;\nuniform float alpha;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec4 sum = vec4(0.0);\n\n    sum += texture2D(uSampler, vBlurTexCoords[ 0])*0.004431848411938341;\n    sum += texture2D(uSampler, vBlurTexCoords[ 1])*0.05399096651318985;\n    sum += texture2D(uSampler, vBlurTexCoords[ 2])*0.2419707245191454;\n    sum += texture2D(uSampler, vTextureCoord     )*0.3989422804014327;\n    sum += texture2D(uSampler, vBlurTexCoords[ 3])*0.2419707245191454;\n    sum += texture2D(uSampler, vBlurTexCoords[ 4])*0.05399096651318985;\n    sum += texture2D(uSampler, vBlurTexCoords[ 5])*0.004431848411938341;\n\n    gl_FragColor = vec4( color.rgb * sum.a * alpha, sum.a * alpha );\n}\n",{blur:{type:"1f",value:1/512},color:{type:"c",value:[0,0,0]},alpha:{type:"1f",value:.7},offset:{type:"2f",value:[5,5]},strength:{type:"1f",value:1}}),this.passes=1,this.strength=4}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r,i){var n=this.getShader(t);if(this.uniforms.strength.value=this.strength/4/this.passes*(e.frame.height/e.size.height),1===this.passes)t.filterManager.applyFilter(n,e,r,i);else{for(var o=t.filterManager.getRenderTarget(!0),s=e,a=o,h=0;h<this.passes-1;h++){t.filterManager.applyFilter(n,s,a,i);var l=a;a=s,s=l}t.filterManager.applyFilter(n,s,r,i),t.filterManager.returnRenderTarget(o)}},Object.defineProperties(i.prototype,{blur:{get:function(){return this.strength},set:function(t){this.padding=.5*t,this.strength=t}}})},{"../../core":29}],101:[function(t,e,r){function i(){n.AbstractFilter.call(this),this.blurXFilter=new o,this.blurYTintFilter=new s,this.defaultFilter=new n.AbstractFilter,this.padding=30,this._dirtyPosition=!0,this._angle=45*Math.PI/180,this._distance=10,this.alpha=.75,this.hideObject=!1,this.blendMode=n.BLEND_MODES.MULTIPLY}var n=t("../../core"),o=t("../blur/BlurXFilter"),s=t("./BlurYTintFilter");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager.getRenderTarget(!0);this._dirtyPosition&&(this._dirtyPosition=!1,this.blurYTintFilter.uniforms.offset.value[0]=Math.sin(this._angle)*this._distance,this.blurYTintFilter.uniforms.offset.value[1]=Math.cos(this._angle)*this._distance),this.blurXFilter.applyFilter(t,e,i),t.blendModeManager.setBlendMode(this.blendMode),this.blurYTintFilter.applyFilter(t,i,r),t.blendModeManager.setBlendMode(n.BLEND_MODES.NORMAL),this.hideObject||this.defaultFilter.applyFilter(t,e,r),t.filterManager.returnRenderTarget(i)},Object.defineProperties(i.prototype,{blur:{get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=this.blurYTintFilter.blur=t}},blurX:{get:function(){return this.blurXFilter.blur},set:function(t){this.blurXFilter.blur=t}},blurY:{get:function(){return this.blurYTintFilter.blur},set:function(t){this.blurYTintFilter.blur=t}},color:{get:function(){return n.utils.rgb2hex(this.blurYTintFilter.uniforms.color.value)},set:function(t){this.blurYTintFilter.uniforms.color.value=n.utils.hex2rgb(t)}},alpha:{get:function(){return this.blurYTintFilter.uniforms.alpha.value},set:function(t){this.blurYTintFilter.uniforms.alpha.value=t}},distance:{get:function(){return this._distance},set:function(t){this._dirtyPosition=!0,this._distance=t}},angle:{get:function(){return this._angle},set:function(t){this._dirtyPosition=!0,this._angle=t}}})},{"../../core":29,"../blur/BlurXFilter":91,"./BlurYTintFilter":100}],102:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\nuniform float gray;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);\n}\n",{gray:{type:"1f",value:1}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{gray:{get:function(){return this.uniforms.gray.value},set:function(t){this.uniforms.gray.value=t}}})},{"../../core":29}],103:[function(t,e,r){e.exports={AsciiFilter:t("./ascii/AsciiFilter"),BloomFilter:t("./bloom/BloomFilter"),BlurFilter:t("./blur/BlurFilter"),BlurXFilter:t("./blur/BlurXFilter"),BlurYFilter:t("./blur/BlurYFilter"),BlurDirFilter:t("./blur/BlurDirFilter"),ColorMatrixFilter:t("./color/ColorMatrixFilter"),ColorStepFilter:t("./color/ColorStepFilter"),ConvolutionFilter:t("./convolution/ConvolutionFilter"),CrossHatchFilter:t("./crosshatch/CrossHatchFilter"),DisplacementFilter:t("./displacement/DisplacementFilter"),DotScreenFilter:t("./dot/DotScreenFilter"),GrayFilter:t("./gray/GrayFilter"),DropShadowFilter:t("./dropshadow/DropShadowFilter"),InvertFilter:t("./invert/InvertFilter"),NoiseFilter:t("./noise/NoiseFilter"),PixelateFilter:t("./pixelate/PixelateFilter"),RGBSplitFilter:t("./rgb/RGBSplitFilter"),ShockwaveFilter:t("./shockwave/ShockwaveFilter"),SepiaFilter:t("./sepia/SepiaFilter"),SmartBlurFilter:t("./blur/SmartBlurFilter"),TiltShiftFilter:t("./tiltshift/TiltShiftFilter"),TiltShiftXFilter:t("./tiltshift/TiltShiftXFilter"),TiltShiftYFilter:t("./tiltshift/TiltShiftYFilter"),TwistFilter:t("./twist/TwistFilter")}},{"./ascii/AsciiFilter":87,"./bloom/BloomFilter":88,"./blur/BlurDirFilter":89,"./blur/BlurFilter":90,"./blur/BlurXFilter":91,"./blur/BlurYFilter":92,"./blur/SmartBlurFilter":93,"./color/ColorMatrixFilter":94,"./color/ColorStepFilter":95,"./convolution/ConvolutionFilter":96,"./crosshatch/CrossHatchFilter":97,"./displacement/DisplacementFilter":98,"./dot/DotScreenFilter":99,"./dropshadow/DropShadowFilter":101,"./gray/GrayFilter":102,"./invert/InvertFilter":104,"./noise/NoiseFilter":105,"./pixelate/PixelateFilter":106,"./rgb/RGBSplitFilter":107,"./sepia/SepiaFilter":108,"./shockwave/ShockwaveFilter":109,"./tiltshift/TiltShiftFilter":111,"./tiltshift/TiltShiftXFilter":112,"./tiltshift/TiltShiftYFilter":113,"./twist/TwistFilter":114}],104:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform float invert;\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);\n}\n",{invert:{type:"1f",value:1}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{invert:{get:function(){return this.uniforms.invert.value},set:function(t){this.uniforms.invert.value=t}}})},{"../../core":29}],105:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float noise;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    float diff = (rand(vTextureCoord) - 0.5) * noise;\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    gl_FragColor = color;\n}\n",{noise:{type:"1f",value:.5}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{noise:{get:function(){return this.uniforms.noise.value},set:function(t){this.uniforms.noise.value=t}}})},{"../../core":29}],106:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 dimensions;\nuniform vec2 pixelSize;\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord;\n\n    vec2 size = dimensions.xy / pixelSize;\n\n    vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;\n\n    gl_FragColor = texture2D(uSampler, color);\n}\n",{
dimensions:{type:"4fv",value:new Float32Array([0,0,0,0])},pixelSize:{type:"v2",value:{x:10,y:10}}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{size:{get:function(){return this.uniforms.pixelSize.value},set:function(t){this.uniforms.pixelSize.value=t}}})},{"../../core":29}],107:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 dimensions;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",{red:{type:"v2",value:{x:20,y:20}},green:{type:"v2",value:{x:-20,y:20}},blue:{type:"v2",value:{x:20,y:-20}},dimensions:{type:"4fv",value:[0,0,0,0]}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{red:{get:function(){return this.uniforms.red.value},set:function(t){this.uniforms.red.value=t}},green:{get:function(){return this.uniforms.green.value},set:function(t){this.uniforms.green.value=t}},blue:{get:function(){return this.uniforms.blue.value},set:function(t){this.uniforms.blue.value=t}}})},{"../../core":29}],108:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float sepia;\n\nconst mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);\n}\n",{sepia:{type:"1f",value:1}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{sepia:{get:function(){return this.uniforms.sepia.value},set:function(t){this.uniforms.sepia.value=t}}})},{"../../core":29}],109:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord;\n    vec2 texCoord = uv;\n\n    float dist = distance(uv, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        texCoord = uv + (diffUV * diffTime);\n    }\n\n    gl_FragColor = texture2D(uSampler, texCoord);\n}\n",{center:{type:"v2",value:{x:.5,y:.5}},params:{type:"v3",value:{x:10,y:.8,z:.1}},time:{type:"1f",value:0}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{center:{get:function(){return this.uniforms.center.value},set:function(t){this.uniforms.center.value=t}},params:{get:function(){return this.uniforms.params.value},set:function(t){this.uniforms.params.value=t}},time:{get:function(){return this.uniforms.time.value},set:function(t){this.uniforms.time.value=t}}})},{"../../core":29}],110:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n",{blur:{type:"1f",value:100},gradientBlur:{type:"1f",value:600},start:{type:"v2",value:{x:0,y:window.innerHeight/2}},end:{type:"v2",value:{x:600,y:window.innerHeight/2}},delta:{type:"v2",value:{x:30,y:30}},texSize:{type:"v2",value:{x:window.innerWidth,y:window.innerHeight}}}),this.updateDelta()}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.updateDelta=function(){this.uniforms.delta.value.x=0,this.uniforms.delta.value.y=0},Object.defineProperties(i.prototype,{blur:{get:function(){return this.uniforms.blur.value},set:function(t){this.uniforms.blur.value=t}},gradientBlur:{get:function(){return this.uniforms.gradientBlur.value},set:function(t){this.uniforms.gradientBlur.value=t}},start:{get:function(){return this.uniforms.start.value},set:function(t){this.uniforms.start.value=t,this.updateDelta()}},end:{get:function(){return this.uniforms.end.value},set:function(t){this.uniforms.end.value=t,this.updateDelta()}}})},{"../../core":29}],111:[function(t,e,r){function i(){n.AbstractFilter.call(this),this.tiltShiftXFilter=new o,this.tiltShiftYFilter=new s}var n=t("../../core"),o=t("./TiltShiftXFilter"),s=t("./TiltShiftYFilter");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.applyFilter=function(t,e,r){var i=t.filterManager.getRenderTarget(!0);this.tiltShiftXFilter.applyFilter(t,e,i),this.tiltShiftYFilter.applyFilter(t,i,r),t.filterManager.returnRenderTarget(i)},Object.defineProperties(i.prototype,{blur:{get:function(){return this.tiltShiftXFilter.blur},set:function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t}},gradientBlur:{get:function(){return this.tiltShiftXFilter.gradientBlur},set:function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t}},start:{get:function(){return this.tiltShiftXFilter.start},set:function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t}},end:{get:function(){return this.tiltShiftXFilter.end},set:function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t}}})},{"../../core":29,"./TiltShiftXFilter":112,"./TiltShiftYFilter":113}],112:[function(t,e,r){function i(){n.call(this)}var n=t("./TiltShiftAxisFilter");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.value.x-this.uniforms.start.value.x,e=this.uniforms.end.value.y-this.uniforms.start.value.y,r=Math.sqrt(t*t+e*e);this.uniforms.delta.value.x=t/r,this.uniforms.delta.value.y=e/r}},{"./TiltShiftAxisFilter":110}],113:[function(t,e,r){function i(){n.call(this)}var n=t("./TiltShiftAxisFilter");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.value.x-this.uniforms.start.value.x,e=this.uniforms.end.value.y-this.uniforms.start.value.y,r=Math.sqrt(t*t+e*e);this.uniforms.delta.value.x=-e/r,this.uniforms.delta.value.y=t/r}},{"./TiltShiftAxisFilter":110}],114:[function(t,e,r){function i(){n.AbstractFilter.call(this,null,"precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\n\nvoid main(void)\n{\n   vec2 coord = vTextureCoord - offset;\n   float dist = length(coord);\n\n   if (dist < radius)\n   {\n       float ratio = (radius - dist) / radius;\n       float angleMod = ratio * ratio * angle;\n       float s = sin(angleMod);\n       float c = cos(angleMod);\n       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n   }\n\n   gl_FragColor = texture2D(uSampler, coord+offset);\n}\n",{radius:{type:"1f",value:.5},angle:{type:"1f",value:5},offset:{type:"v2",value:{x:.5,y:.5}}})}var n=t("../../core");i.prototype=Object.create(n.AbstractFilter.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{offset:{get:function(){return this.uniforms.offset.value},set:function(t){this.uniforms.offset.value=t}},radius:{get:function(){return this.uniforms.radius.value},set:function(t){this.uniforms.radius.value=t}},angle:{get:function(){return this.uniforms.angle.value},set:function(t){this.uniforms.angle.value=t}}})},{"../../core":29}],115:[function(t,e,r){(function(r){t("./polyfill");var i=e.exports=t("./core");i.extras=t("./extras"),i.filters=t("./filters"),i.interaction=t("./interaction"),i.loaders=t("./loaders"),i.mesh=t("./mesh"),i.accessibility=t("./accessibility"),i.loader=new i.loaders.Loader,Object.assign(i,t("./deprecation")),r.PIXI=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./accessibility":21,"./core":29,"./deprecation":79,"./extras":86,"./filters":103,"./interaction":118,"./loaders":121,"./mesh":128,"./polyfill":133}],116:[function(t,e,r){function i(){this.global=new n.Point,this.target=null,this.originalEvent=null}var n=t("../core");i.prototype.constructor=i,e.exports=i,i.prototype.getLocalPosition=function(t,e,r){return t.worldTransform.applyInverse(r||this.global,e)}},{"../core":29}],117:[function(t,e,r){function i(t,e){e=e||{},this.renderer=t,this.autoPreventDefault=void 0!==e.autoPreventDefault?e.autoPreventDefault:!0,this.interactionFrequency=e.interactionFrequency||10,this.mouse=new o,this.eventData={stopped:!1,target:null,type:null,data:this.mouse,stopPropagation:function(){this.stopped=!0}},this.interactiveDataPool=[],this.interactionDOMElement=null,this.moveWhenInside=!1,this.eventsAdded=!1,this.onMouseUp=this.onMouseUp.bind(this),this.processMouseUp=this.processMouseUp.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.processMouseDown=this.processMouseDown.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.processMouseMove=this.processMouseMove.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.processMouseOverOut=this.processMouseOverOut.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.processTouchStart=this.processTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.processTouchEnd=this.processTouchEnd.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.processTouchMove=this.processTouchMove.bind(this),this.last=0,this.currentCursorStyle="inherit",this._tempPoint=new n.Point,this.resolution=1,this.setTargetElement(this.renderer.view,this.renderer.resolution)}var n=t("../core"),o=t("./InteractionData");Object.assign(n.DisplayObject.prototype,t("./interactiveTarget")),i.prototype.constructor=i,e.exports=i,i.prototype.setTargetElement=function(t,e){this.removeEvents(),this.interactionDOMElement=t,this.resolution=e||1,this.addEvents()},i.prototype.addEvents=function(){this.interactionDOMElement&&(n.ticker.shared.add(this.update,this),window.navigator.msPointerEnabled&&(this.interactionDOMElement.style["-ms-content-zooming"]="none",this.interactionDOMElement.style["-ms-touch-action"]="none"),window.document.addEventListener("mousemove",this.onMouseMove,!0),this.interactionDOMElement.addEventListener("mousedown",this.onMouseDown,!0),this.interactionDOMElement.addEventListener("mouseout",this.onMouseOut,!0),this.interactionDOMElement.addEventListener("touchstart",this.onTouchStart,!0),this.interactionDOMElement.addEventListener("touchend",this.onTouchEnd,!0),this.interactionDOMElement.addEventListener("touchmove",this.onTouchMove,!0),window.addEventListener("mouseup",this.onMouseUp,!0),this.eventsAdded=!0)},i.prototype.removeEvents=function(){this.interactionDOMElement&&(n.ticker.shared.remove(this.update),window.navigator.msPointerEnabled&&(this.interactionDOMElement.style["-ms-content-zooming"]="",this.interactionDOMElement.style["-ms-touch-action"]=""),window.document.removeEventListener("mousemove",this.onMouseMove,!0),this.interactionDOMElement.removeEventListener("mousedown",this.onMouseDown,!0),this.interactionDOMElement.removeEventListener("mouseout",this.onMouseOut,!0),this.interactionDOMElement.removeEventListener("touchstart",this.onTouchStart,!0),this.interactionDOMElement.removeEventListener("touchend",this.onTouchEnd,!0),this.interactionDOMElement.removeEventListener("touchmove",this.onTouchMove,!0),this.interactionDOMElement=null,window.removeEventListener("mouseup",this.onMouseUp,!0),this.eventsAdded=!1)},i.prototype.update=function(t){if(this._deltaTime+=t,!(this._deltaTime<this.interactionFrequency)&&(this._deltaTime=0,this.interactionDOMElement)){if(this.didMove)return void(this.didMove=!1);this.cursor="inherit",this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseOverOut,!0),this.currentCursorStyle!==this.cursor&&(this.currentCursorStyle=this.cursor,this.interactionDOMElement.style.cursor=this.cursor)}},i.prototype.dispatchEvent=function(t,e,r){r.stopped||(r.target=t,r.type=e,t.emit(e,r),t[e]&&t[e](r))},i.prototype.mapPositionToPoint=function(t,e,r){var i=this.interactionDOMElement.getBoundingClientRect();t.x=(e-i.left)*(this.interactionDOMElement.width/i.width)/this.resolution,t.y=(r-i.top)*(this.interactionDOMElement.height/i.height)/this.resolution},i.prototype.processInteractive=function(t,e,r,i,n){if(!e||!e.visible)return!1;var o=!1,s=n=e.interactive||n;if(e.hitArea&&(s=!1),e.interactiveChildren)for(var a=e.children,h=a.length-1;h>=0;h--){var l=a[h];if(this.processInteractive(t,l,r,i,s)){if(!l.parent)continue;o=!0,s=!1,i=!1}}return n&&(i&&!o&&(e.hitArea?(e.worldTransform.applyInverse(t,this._tempPoint),o=e.hitArea.contains(this._tempPoint.x,this._tempPoint.y)):e.containsPoint&&(o=e.containsPoint(t))),e.interactive&&r(e,o)),o},i.prototype.onMouseDown=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData.stopped=!1,this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.autoPreventDefault&&this.mouse.originalEvent.preventDefault(),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseDown,!0)},i.prototype.processMouseDown=function(t,e){var r=this.mouse.originalEvent,i=2===r.button||3===r.which;e&&(t[i?"_isRightDown":"_isLeftDown"]=!0,this.dispatchEvent(t,i?"rightdown":"mousedown",this.eventData))},i.prototype.onMouseUp=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData.stopped=!1,this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseUp,!0)},i.prototype.processMouseUp=function(t,e){var r=this.mouse.originalEvent,i=2===r.button||3===r.which,n=i?"_isRightDown":"_isLeftDown";e?(this.dispatchEvent(t,i?"rightup":"mouseup",this.eventData),t[n]&&(t[n]=!1,this.dispatchEvent(t,i?"rightclick":"click",this.eventData))):t[n]&&(t[n]=!1,this.dispatchEvent(t,i?"rightupoutside":"mouseupoutside",this.eventData))},i.prototype.onMouseMove=function(t){this.mouse.originalEvent=t,this.eventData.data=this.mouse,this.eventData.stopped=!1,this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.didMove=!0,this.cursor="inherit",this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseMove,!0),this.currentCursorStyle!==this.cursor&&(this.currentCursorStyle=this.cursor,this.interactionDOMElement.style.cursor=this.cursor)},i.prototype.processMouseMove=function(t,e){this.processMouseOverOut(t,e),this.moveWhenInside&&!e||this.dispatchEvent(t,"mousemove",this.eventData)},i.prototype.onMouseOut=function(t){this.mouse.originalEvent=t,this.eventData.stopped=!1,this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.interactionDOMElement.style.cursor="inherit",this.mapPositionToPoint(this.mouse.global,t.clientX,t.clientY),this.processInteractive(this.mouse.global,this.renderer._lastObjectRendered,this.processMouseOverOut,!1)},i.prototype.processMouseOverOut=function(t,e){e?(t._over||(t._over=!0,this.dispatchEvent(t,"mouseover",this.eventData)),t.buttonMode&&(this.cursor=t.defaultCursor)):t._over&&(t._over=!1,this.dispatchEvent(t,"mouseout",this.eventData))},i.prototype.onTouchStart=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,i=0;r>i;i++){var n=e[i],o=this.getTouchData(n);o.originalEvent=t,this.eventData.data=o,this.eventData.stopped=!1,this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchStart,!0),this.returnTouchData(o)}},i.prototype.processTouchStart=function(t,e){e&&(t._touchDown=!0,this.dispatchEvent(t,"touchstart",this.eventData))},i.prototype.onTouchEnd=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,i=0;r>i;i++){var n=e[i],o=this.getTouchData(n);o.originalEvent=t,this.eventData.data=o,this.eventData.stopped=!1,this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchEnd,!0),this.returnTouchData(o)}},i.prototype.processTouchEnd=function(t,e){e?(this.dispatchEvent(t,"touchend",this.eventData),t._touchDown&&(t._touchDown=!1,this.dispatchEvent(t,"tap",this.eventData))):t._touchDown&&(t._touchDown=!1,this.dispatchEvent(t,"touchendoutside",this.eventData))},i.prototype.onTouchMove=function(t){this.autoPreventDefault&&t.preventDefault();for(var e=t.changedTouches,r=e.length,i=0;r>i;i++){var n=e[i],o=this.getTouchData(n);o.originalEvent=t,this.eventData.data=o,this.eventData.stopped=!1,this.processInteractive(o.global,this.renderer._lastObjectRendered,this.processTouchMove,this.moveWhenInside),this.returnTouchData(o)}},i.prototype.processTouchMove=function(t,e){this.moveWhenInside&&!e||this.dispatchEvent(t,"touchmove",this.eventData)},i.prototype.getTouchData=function(t){var e=this.interactiveDataPool.pop();return e||(e=new o),e.identifier=t.identifier,this.mapPositionToPoint(e.global,t.clientX,t.clientY),navigator.isCocoonJS&&(e.global.x=e.global.x/this.resolution,e.global.y=e.global.y/this.resolution),t.globalX=e.global.x,t.globalY=e.global.y,e},i.prototype.returnTouchData=function(t){this.interactiveDataPool.push(t)},i.prototype.destroy=function(){this.removeEvents(),this.renderer=null,this.mouse=null,this.eventData=null,this.interactiveDataPool=null,this.interactionDOMElement=null,this.onMouseUp=null,this.processMouseUp=null,this.onMouseDown=null,this.processMouseDown=null,this.onMouseMove=null,this.processMouseMove=null,this.onMouseOut=null,this.processMouseOverOut=null,this.onTouchStart=null,this.processTouchStart=null,this.onTouchEnd=null,this.processTouchEnd=null,this.onTouchMove=null,this.processTouchMove=null,this._tempPoint=null},n.WebGLRenderer.registerPlugin("interaction",i),n.CanvasRenderer.registerPlugin("interaction",i)},{"../core":29,"./InteractionData":116,"./interactiveTarget":119}],118:[function(t,e,r){e.exports={InteractionData:t("./InteractionData"),InteractionManager:t("./InteractionManager"),interactiveTarget:t("./interactiveTarget")}},{"./InteractionData":116,"./InteractionManager":117,"./interactiveTarget":119}],119:[function(t,e,r){var i={interactive:!1,buttonMode:!1,interactiveChildren:!0,defaultCursor:"pointer",_over:!1,_touchDown:!1};e.exports=i},{}],120:[function(t,e,r){function i(t,e){var r={},i=t.data.getElementsByTagName("info")[0],n=t.data.getElementsByTagName("common")[0];r.font=i.getAttribute("face"),r.size=parseInt(i.getAttribute("size"),10),r.lineHeight=parseInt(n.getAttribute("lineHeight"),10),r.chars={};for(var a=t.data.getElementsByTagName("char"),h=0;h<a.length;h++){var l=parseInt(a[h].getAttribute("id"),10),u=new o.Rectangle(parseInt(a[h].getAttribute("x"),10)+e.frame.x,parseInt(a[h].getAttribute("y"),10)+e.frame.y,parseInt(a[h].getAttribute("width"),10),parseInt(a[h].getAttribute("height"),10));r.chars[l]={xOffset:parseInt(a[h].getAttribute("xoffset"),10),yOffset:parseInt(a[h].getAttribute("yoffset"),10),xAdvance:parseInt(a[h].getAttribute("xadvance"),10),kerning:{},texture:new o.Texture(e.baseTexture,u)}}var c=t.data.getElementsByTagName("kerning");for(h=0;h<c.length;h++){var p=parseInt(c[h].getAttribute("first"),10),d=parseInt(c[h].getAttribute("second"),10),f=parseInt(c[h].getAttribute("amount"),10);r.chars[d]&&(r.chars[d].kerning[p]=f)}t.bitmapFont=r,s.BitmapText.fonts[r.font]=r}var n=t("resource-loader").Resource,o=t("../core"),s=t("../extras"),a=t("path");e.exports=function(){return function(t,e){if(!t.data||!t.isXml)return e();if(0===t.data.getElementsByTagName("page").length||0===t.data.getElementsByTagName("info").length||null===t.data.getElementsByTagName("info")[0].getAttribute("face"))return e();var r=a.dirname(t.url);"."===r&&(r=""),this.baseUrl&&r&&("/"===this.baseUrl.charAt(this.baseUrl.length-1)&&(r+="/"),r=r.replace(this.baseUrl,"")),r&&"/"!==r.charAt(r.length-1)&&(r+="/");var s=r+t.data.getElementsByTagName("page")[0].getAttribute("file");if(o.utils.TextureCache[s])i(t,o.utils.TextureCache[s]),e();else{var h={crossOrigin:t.crossOrigin,loadType:n.LOAD_TYPE.IMAGE,metadata:t.metadata.imageMetadata};this.add(t.name+"_image",s,h,function(r){i(t,r.texture),e()})}}}},{"../core":29,"../extras":86,path:2,"resource-loader":16}],121:[function(t,e,r){e.exports={Loader:t("./loader"),bitmapFontParser:t("./bitmapFontParser"),spritesheetParser:t("./spritesheetParser"),textureParser:t("./textureParser"),Resource:t("resource-loader").Resource}},{"./bitmapFontParser":120,"./loader":122,"./spritesheetParser":123,"./textureParser":124,"resource-loader":16}],122:[function(t,e,r){function i(t,e){n.call(this,t,e);for(var r=0;r<i._pixiMiddleware.length;++r)this.use(i._pixiMiddleware[r]())}var n=t("resource-loader"),o=t("./textureParser"),s=t("./spritesheetParser"),a=t("./bitmapFontParser");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i._pixiMiddleware=[n.middleware.parsing.blob,o,s,a],i.addPixiMiddleware=function(t){i._pixiMiddleware.push(t)};var h=n.Resource;h.setExtensionXhrType("fnt",h.XHR_RESPONSE_TYPE.DOCUMENT)},{"./bitmapFontParser":120,"./spritesheetParser":123,"./textureParser":124,"resource-loader":16}],123:[function(t,e,r){var i=t("resource-loader").Resource,n=t("path"),o=t("../core"),s=t("async"),a=1e3;e.exports=function(){return function(t,e){var r=t.name+"_image";if(!t.data||!t.isJson||!t.data.frames||this.resources[r])return e();var h={crossOrigin:t.crossOrigin,loadType:i.LOAD_TYPE.IMAGE,metadata:t.metadata.imageMetadata},l=n.dirname(t.url.replace(this.baseUrl,""));this.add(r,l+"/"+t.data.meta.image,h,function(r){function i(e,i){for(var n=e;i>n-e&&n<u.length;){var s=l[u[n]],a=s.frame;if(a){var h=null,p=null;if(h=s.rotated?new o.Rectangle(a.x,a.y,a.h,a.w):new o.Rectangle(a.x,a.y,a.w,a.h),s.trimmed&&(p=new o.Rectangle(s.spriteSourceSize.x/c,s.spriteSourceSize.y/c,s.sourceSize.w/c,s.sourceSize.h/c)),s.rotated){var d=h.width;h.width=h.height,h.height=d}h.x/=c,h.y/=c,h.width/=c,h.height/=c,t.textures[u[n]]=new o.Texture(r.texture.baseTexture,h,h.clone(),p,s.rotated),o.utils.TextureCache[u[n]]=t.textures[u[n]]}n++}}function n(){return p*a<u.length}function h(t){i(p*a,a),p++,setTimeout(t,0)}t.textures={};var l=t.data.frames,u=Object.keys(l),c=o.utils.getResolutionOfUrl(t.url),p=0;u.length<=a?(i(0,a),e()):s.whilst(n,h,e)})}}},{"../core":29,async:1,path:2,"resource-loader":16}],124:[function(t,e,r){var i=t("../core");e.exports=function(){return function(t,e){if(t.data&&t.isImage){var r=new i.BaseTexture(t.data,null,i.utils.getResolutionOfUrl(t.url));r.imageUrl=t.url,t.texture=new i.Texture(r),i.utils.BaseTextureCache[t.url]=r,i.utils.TextureCache[t.url]=t.texture}e()}}},{"../core":29}],125:[function(t,e,r){function i(t,e,r,o,s){n.Container.call(this),this._texture=null,this.uvs=r||new Float32Array([0,0,1,0,1,1,0,1]),this.vertices=e||new Float32Array([0,0,100,0,100,100,0,100]),this.indices=o||new Uint16Array([0,1,3,2]),this.dirty=!0,this.blendMode=n.BLEND_MODES.NORMAL,this.canvasPadding=0,this.drawMode=s||i.DRAW_MODES.TRIANGLE_MESH,this.texture=t,this.shader=null}var n=t("../core"),o=new n.Point,s=new n.Polygon;i.prototype=Object.create(n.Container.prototype),i.prototype.constructor=i,e.exports=i,Object.defineProperties(i.prototype,{texture:{get:function(){return this._texture},set:function(t){this._texture!==t&&(this._texture=t,t&&(t.baseTexture.hasLoaded?this._onTextureUpdate():t.once("update",this._onTextureUpdate,this)))}}}),i.prototype._renderWebGL=function(t){t.setObjectRenderer(t.plugins.mesh),t.plugins.mesh.render(this)},i.prototype._renderCanvas=function(t){var e=t.context,r=this.worldTransform,n=t.resolution;t.roundPixels?e.setTransform(r.a*n,r.b*n,r.c*n,r.d*n,r.tx*n|0,r.ty*n|0):e.setTransform(r.a*n,r.b*n,r.c*n,r.d*n,r.tx*n,r.ty*n),this.drawMode===i.DRAW_MODES.TRIANGLE_MESH?this._renderCanvasTriangleMesh(e):this._renderCanvasTriangles(e)},i.prototype._renderCanvasTriangleMesh=function(t){for(var e=this.vertices,r=this.uvs,i=e.length/2,n=0;i-2>n;n++){var o=2*n;this._renderCanvasDrawTriangle(t,e,r,o,o+2,o+4)}},i.prototype._renderCanvasTriangles=function(t){for(var e=this.vertices,r=this.uvs,i=this.indices,n=i.length,o=0;n>o;o+=3){var s=2*i[o],a=2*i[o+1],h=2*i[o+2];this._renderCanvasDrawTriangle(t,e,r,s,a,h)}},i.prototype._renderCanvasDrawTriangle=function(t,e,r,i,n,o){var s=this._texture.baseTexture,a=s.source,h=s.width,l=s.height,u=e[i],c=e[n],p=e[o],d=e[i+1],f=e[n+1],v=e[o+1],g=r[i]*s.width,y=r[n]*s.width,m=r[o]*s.width,x=r[i+1]*s.height,b=r[n+1]*s.height,_=r[o+1]*s.height;if(this.canvasPadding>0){var T=this.canvasPadding/this.worldTransform.a,E=this.canvasPadding/this.worldTransform.d,S=(u+c+p)/3,w=(d+f+v)/3,A=u-S,C=d-w,M=Math.sqrt(A*A+C*C);u=S+A/M*(M+T),d=w+C/M*(M+E),A=c-S,C=f-w,M=Math.sqrt(A*A+C*C),c=S+A/M*(M+T),f=w+C/M*(M+E),A=p-S,C=v-w,M=Math.sqrt(A*A+C*C),p=S+A/M*(M+T),v=w+C/M*(M+E)}t.save(),t.beginPath(),t.moveTo(u,d),t.lineTo(c,f),t.lineTo(p,v),t.closePath(),t.clip();var R=g*b+x*m+y*_-b*m-x*y-g*_,O=u*b+x*p+c*_-b*p-x*c-u*_,P=g*c+u*m+y*p-c*m-u*y-g*p,F=g*b*p+x*c*m+u*y*_-u*b*m-x*y*p-g*c*_,D=d*b+x*v+f*_-b*v-x*f-d*_,B=g*f+d*m+y*v-f*m-d*y-g*v,L=g*b*v+x*f*m+d*y*_-d*b*m-x*y*v-g*f*_;t.transform(O/R,D/R,P/R,B/R,F/R,L/R),t.drawImage(a,0,0,h*s.resolution,l*s.resolution,0,0,h,l),t.restore()},i.prototype.renderMeshFlat=function(t){var e=this.context,r=t.vertices,i=r.length/2;e.beginPath();for(var n=1;i-2>n;n++){var o=2*n,s=r[o],a=r[o+2],h=r[o+4],l=r[o+1],u=r[o+3],c=r[o+5];e.moveTo(s,l),e.lineTo(a,u),e.lineTo(h,c)}e.fillStyle="#FF0000",e.fill(),e.closePath()},i.prototype._onTextureUpdate=function(){this.updateFrame=!0},i.prototype.getBounds=function(t){if(!this._currentBounds){for(var e=t||this.worldTransform,r=e.a,i=e.b,o=e.c,s=e.d,a=e.tx,h=e.ty,l=-(1/0),u=-(1/0),c=1/0,p=1/0,d=this.vertices,f=0,v=d.length;v>f;f+=2){var g=d[f],y=d[f+1],m=r*g+o*y+a,x=s*y+i*g+h;c=c>m?m:c,p=p>x?x:p,l=m>l?m:l,u=x>u?x:u}if(c===-(1/0)||u===1/0)return n.Rectangle.EMPTY;var b=this._bounds;b.x=c,b.width=l-c,b.y=p,b.height=u-p,this._currentBounds=b}return this._currentBounds},i.prototype.containsPoint=function(t){if(!this.getBounds().contains(t.x,t.y))return!1;this.worldTransform.applyInverse(t,o);var e,r,n=this.vertices,a=s.points;if(this.drawMode===i.DRAW_MODES.TRIANGLES){var h=this.indices;for(r=this.indices.length,e=0;r>e;e+=3){var l=2*h[e],u=2*h[e+1],c=2*h[e+2];if(a[0]=n[l],a[1]=n[l+1],a[2]=n[u],a[3]=n[u+1],a[4]=n[c],a[5]=n[c+1],s.contains(o.x,o.y))return!0}}else for(r=n.length,e=0;r>e;e+=6)if(a[0]=n[e],a[1]=n[e+1],a[2]=n[e+2],a[3]=n[e+3],a[4]=n[e+4],a[5]=n[e+5],s.contains(o.x,o.y))return!0;return!1},i.DRAW_MODES={TRIANGLE_MESH:0,TRIANGLES:1}},{"../core":29}],126:[function(t,e,r){function i(t,e,r){n.call(this,t),this._ready=!0,this.segmentsX=e||10,this.segmentsY=r||10,this.drawMode=n.DRAW_MODES.TRIANGLES,this.refresh()}var n=t("./Mesh");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.refresh=function(){var t=this.segmentsX*this.segmentsY,e=[],r=[],i=[],n=[],o=this.texture,s=this.segmentsX-1,a=this.segmentsY-1,h=0,l=o.width/s,u=o.height/a;for(h=0;t>h;h++){var c=h%this.segmentsX,p=h/this.segmentsX|0;e.push(c*l,p*u),i.push(o._uvs.x0+(o._uvs.x1-o._uvs.x0)*(c/(this.segmentsX-1)),o._uvs.y0+(o._uvs.y3-o._uvs.y0)*(p/(this.segmentsY-1)))}var d=s*a;for(h=0;d>h;h++){var f=h%s,v=h/s|0,g=v*this.segmentsX+f,y=v*this.segmentsX+f+1,m=(v+1)*this.segmentsX+f,x=(v+1)*this.segmentsX+f+1;n.push(g,y,m),n.push(y,x,m)}this.vertices=new Float32Array(e),this.uvs=new Float32Array(i),this.colors=new Float32Array(r),this.indices=new Uint16Array(n)},i.prototype._onTextureUpdate=function(){n.prototype._onTextureUpdate.call(this),this._ready&&this.refresh()}},{"./Mesh":125}],127:[function(t,e,r){function i(t,e){n.call(this,t),this.points=e,this.vertices=new Float32Array(4*e.length),this.uvs=new Float32Array(4*e.length),this.colors=new Float32Array(2*e.length),this.indices=new Uint16Array(2*e.length),this._ready=!0,this.refresh()}var n=t("./Mesh"),o=t("../core");i.prototype=Object.create(n.prototype),i.prototype.constructor=i,e.exports=i,i.prototype.refresh=function(){var t=this.points;if(!(t.length<1)&&this._texture._uvs){var e=this.uvs,r=this.indices,i=this.colors,n=this._texture._uvs,s=new o.Point(n.x0,n.y0),a=new o.Point(n.x2-n.x0,n.y2-n.y0);e[0]=0+s.x,e[1]=0+s.y,e[2]=0+s.x,e[3]=1*a.y+s.y,i[0]=1,i[1]=1,r[0]=0,r[1]=1;for(var h,l,u,c=t.length,p=1;c>p;p++)h=t[p],l=4*p,u=p/(c-1),e[l]=u*a.x+s.x,e[l+1]=0+s.y,e[l+2]=u*a.x+s.x,e[l+3]=1*a.y+s.y,l=2*p,i[l]=1,i[l+1]=1,l=2*p,r[l]=l,r[l+1]=l+1;this.dirty=!0}},i.prototype._onTextureUpdate=function(){n.prototype._onTextureUpdate.call(this),this._ready&&this.refresh()},i.prototype.updateTransform=function(){var t=this.points;if(!(t.length<1)){for(var e,r,i,n,o,s,a=t[0],h=0,l=0,u=this.vertices,c=t.length,p=0;c>p;p++)r=t[p],i=4*p,e=p<t.length-1?t[p+1]:r,l=-(e.x-a.x),h=e.y-a.y,n=10*(1-p/(c-1)),n>1&&(n=1),o=Math.sqrt(h*h+l*l),s=this._texture.height/2,h/=o,l/=o,h*=s,l*=s,u[i]=r.x+h,u[i+1]=r.y+l,u[i+2]=r.x-h,u[i+3]=r.y-l,a=r;this.containerUpdateTransform()}}},{"../core":29,"./Mesh":125}],128:[function(t,e,r){e.exports={Mesh:t("./Mesh"),Plane:t("./Plane"),Rope:t("./Rope"),MeshRenderer:t("./webgl/MeshRenderer"),MeshShader:t("./webgl/MeshShader")}},{"./Mesh":125,"./Plane":126,"./Rope":127,"./webgl/MeshRenderer":129,"./webgl/MeshShader":130}],129:[function(t,e,r){function i(t){n.ObjectRenderer.call(this,t),this.indices=new Uint16Array(15e3);for(var e=0,r=0;15e3>e;e+=6,r+=4)this.indices[e+0]=r+0,this.indices[e+1]=r+1,this.indices[e+2]=r+2,this.indices[e+3]=r+0,this.indices[e+4]=r+2,this.indices[e+5]=r+3;this.currentShader=null}var n=t("../../core"),o=t("../Mesh");i.prototype=Object.create(n.ObjectRenderer.prototype),i.prototype.constructor=i,e.exports=i,n.WebGLRenderer.registerPlugin("mesh",i),i.prototype.onContextChange=function(){},i.prototype.render=function(t){t._vertexBuffer||this._initWebGL(t);var e=this.renderer,r=e.gl,i=t._texture.baseTexture,n=t.shader,s=t.drawMode===o.DRAW_MODES.TRIANGLE_MESH?r.TRIANGLE_STRIP:r.TRIANGLES;e.blendModeManager.setBlendMode(t.blendMode),n=n?n.shaders[r.id]||n.getShader(e):e.shaderManager.plugins.meshShader,this.renderer.shaderManager.setShader(n),n.uniforms.translationMatrix.value=t.worldTransform.toArray(!0),n.uniforms.projectionMatrix.value=e.currentRenderTarget.projectionMatrix.toArray(!0),n.uniforms.alpha.value=t.worldAlpha,n.syncUniforms(),t.dirty?(t.dirty=!1,r.bindBuffer(r.ARRAY_BUFFER,t._vertexBuffer),r.bufferData(r.ARRAY_BUFFER,t.vertices,r.STATIC_DRAW),r.vertexAttribPointer(n.attributes.aVertexPosition,2,r.FLOAT,!1,0,0),
r.bindBuffer(r.ARRAY_BUFFER,t._uvBuffer),r.bufferData(r.ARRAY_BUFFER,t.uvs,r.STATIC_DRAW),r.vertexAttribPointer(n.attributes.aTextureCoord,2,r.FLOAT,!1,0,0),r.activeTexture(r.TEXTURE0),i._glTextures[r.id]?r.bindTexture(r.TEXTURE_2D,i._glTextures[r.id]):this.renderer.updateTexture(i),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t._indexBuffer),r.bufferData(r.ELEMENT_ARRAY_BUFFER,t.indices,r.STATIC_DRAW)):(r.bindBuffer(r.ARRAY_BUFFER,t._vertexBuffer),r.bufferSubData(r.ARRAY_BUFFER,0,t.vertices),r.vertexAttribPointer(n.attributes.aVertexPosition,2,r.FLOAT,!1,0,0),r.bindBuffer(r.ARRAY_BUFFER,t._uvBuffer),r.vertexAttribPointer(n.attributes.aTextureCoord,2,r.FLOAT,!1,0,0),r.activeTexture(r.TEXTURE0),i._glTextures[r.id]?r.bindTexture(r.TEXTURE_2D,i._glTextures[r.id]):this.renderer.updateTexture(i),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t._indexBuffer),r.bufferSubData(r.ELEMENT_ARRAY_BUFFER,0,t.indices)),r.drawElements(s,t.indices.length,r.UNSIGNED_SHORT,0)},i.prototype._initWebGL=function(t){var e=this.renderer.gl;t._vertexBuffer=e.createBuffer(),t._indexBuffer=e.createBuffer(),t._uvBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,t._vertexBuffer),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,t._uvBuffer),e.bufferData(e.ARRAY_BUFFER,t.uvs,e.STATIC_DRAW),t.colors&&(t._colorBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,t._colorBuffer),e.bufferData(e.ARRAY_BUFFER,t.colors,e.STATIC_DRAW)),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t._indexBuffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW)},i.prototype.flush=function(){},i.prototype.start=function(){this.currentShader=null},i.prototype.destroy=function(){n.ObjectRenderer.prototype.destroy.call(this)}},{"../../core":29,"../Mesh":125}],130:[function(t,e,r){function i(t){n.Shader.call(this,t,["precision lowp float;","attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","uniform mat3 translationMatrix;","uniform mat3 projectionMatrix;","varying vec2 vTextureCoord;","void main(void){","   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);","   vTextureCoord = aTextureCoord;","}"].join("\n"),["precision lowp float;","varying vec2 vTextureCoord;","uniform float alpha;","uniform sampler2D uSampler;","void main(void){","   gl_FragColor = texture2D(uSampler, vTextureCoord) * alpha ;","}"].join("\n"),{alpha:{type:"1f",value:0},translationMatrix:{type:"mat3",value:new Float32Array(9)},projectionMatrix:{type:"mat3",value:new Float32Array(9)}},{aVertexPosition:0,aTextureCoord:0})}var n=t("../../core");i.prototype=Object.create(n.Shader.prototype),i.prototype.constructor=i,e.exports=i,n.ShaderManager.registerPlugin("meshShader",i)},{"../../core":29}],131:[function(t,e,r){Math.sign||(Math.sign=function(t){return t=+t,0===t||isNaN(t)?t:t>0?1:-1})},{}],132:[function(t,e,r){Object.assign||(Object.assign=t("object-assign"))},{"object-assign":11}],133:[function(t,e,r){t("./Object.assign"),t("./requestAnimationFrame"),t("./Math.sign")},{"./Math.sign":131,"./Object.assign":132,"./requestAnimationFrame":134}],134:[function(t,e,r){(function(t){if(Date.now&&Date.prototype.getTime||(Date.now=function(){return(new Date).getTime()}),!t.performance||!t.performance.now){var e=Date.now();t.performance||(t.performance={}),t.performance.now=function(){return Date.now()-e}}for(var r=Date.now(),i=["ms","moz","webkit","o"],n=0;n<i.length&&!t.requestAnimationFrame;++n)t.requestAnimationFrame=t[i[n]+"RequestAnimationFrame"],t.cancelAnimationFrame=t[i[n]+"CancelAnimationFrame"]||t[i[n]+"CancelRequestAnimationFrame"];t.requestAnimationFrame||(t.requestAnimationFrame=function(t){if("function"!=typeof t)throw new TypeError(t+"is not a function");var e=Date.now(),i=16+r-e;return 0>i&&(i=0),r=e,setTimeout(function(){r=Date.now(),t(performance.now())},i)}),t.cancelAnimationFrame||(t.cancelAnimationFrame=function(t){clearTimeout(t)})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[115])(115)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
var PIXI = require('./pixi.min'),
	AnimatedObject = require('./animatedObject');

function Player(textures){
	this.speed = 1;
	this.vx = 0;


	AnimatedObject.call(this, textures);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
}

Player.prototype = Object.create(AnimatedObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveRight = function(){
	this.x += this.speed;
	this.animate('walk');
}

Player.prototype.moveLeft = function(){
	this.x -= this.speed;
	this.animate('left');
}

Player.prototype.moveUp = function(){
	this.y -= this.speed;
	this.animations.play('move up');
}

Player.prototype.walk = function(){
	this.animate('walk');
}


module.exports = Player;
},{"./animatedObject":1,"./pixi.min":6}],8:[function(require,module,exports){
var PIXI = require('./pixi.min');

var Renderer = (function(){
	var renderer,
		canvasWidth = 640,
		canvasHeight = 480,
		layers = [];

	function getScreenWidth(){
		body = document.getElementsByTagName('body')[0];
		return body.offsetWidth;
	}

	function getScreenHeight(){
		body = document.getElementsByTagName('body')[0];
		return body.offsetHeight;
	}

	function resize(){

	}

	return {

		init: function(params){
			if(params.fullscreen){
				canvasWidth = getScreenWidth();
				canvasHeight = getScreenHeight();
			}

			renderer = new PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
			document.body.appendChild(renderer.view);
		},

		render: function(){
			stage = new PIXI.Container();
			for(i=0;i<layers.length;i++){
				stage.addChild(layers[i].content);
			}
			renderer.render(stage);
		},

		addLayer: function(name, content){
			container = new PIXI.Container();
			container.addChild(content);
			layers.push({name: name, content: container});
		},

		addToLayer: function(layer, content){
			for(i=0;i<layers.length;i++){
				if(layers[i].name == layer){
					layers[i].addChild(content);
				}
			}
		}
	};

})();

module.exports = Renderer;
},{"./pixi.min":6}],9:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 4.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash -d -o ./foo/lodash.js`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.6.1';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256,
      FLIP_FLAG = 512;

  /** Used to compose bitmasks for comparison styles. */
  var UNORDERED_COMPARE_FLAG = 1,
      PARTIAL_COMPARE_FLAG = 2;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

  /** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0x/i;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsComboSymbolsRange = '\\u20d0-\\u20f0',
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

  /** Used to match non-compound words composed of alphanumeric characters. */
  var reBasicWord = /[a-zA-Z0-9]+/g;

  /** Used to match complex or compound words. */
  var reComplexWord = RegExp([
    rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
    rsUpper + '?' + rsLowerMisc + '+',
    rsUpper + '+',
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_',
    'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[mapTag] = cloneableTags[numberTag] =
  cloneableTags[objectTag] = cloneableTags[regexpTag] =
  cloneableTags[setTag] = cloneableTags[stringTag] =
  cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
  cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
  cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `Map#set` because it doesn't return the map instance in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    var length = args.length;
    switch (length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * Creates a new array concatenating `array` with `other`.
   *
   * @private
   * @param {Array} array The first array to concatenate.
   * @param {Array} other The second array to concatenate.
   * @returns {Array} Returns the new concatenated array.
   */
  function arrayConcat(array, other) {
    var index = -1,
        length = array.length,
        othIndex = -1,
        othLength = other.length,
        result = Array(length + othLength);

    while (++index < length) {
      result[index] = array[index];
    }
    while (++othIndex < othLength) {
      result[index++] = other[othIndex];
    }
    return result;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    return !!array.length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? current === current
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of methods like `_.find` and `_.findKey`, without
   * support for iteratee shorthands, which iterates over `collection` using
   * `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` without support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the new array of key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing wrapper metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Compares values to sort them in ascending order.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * Used by `_.orderBy` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
   * specify an order of "desc" for descending or "asc" for ascending sort order
   * of corresponding values.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]|string[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == 'desc' ? -1 : 1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        result++;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to an array.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the converted array.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the converted array.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    if (!(string && reHasComplexSymbol.test(string))) {
      return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (reComplexSymbol.test(string)) {
      result++;
    }
    return result;
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return string.match(reComplexSymbol);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Use `context` to mock `Date#getTime` use in `_.now`.
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;

    /** Built-in constructor references. */
    var Date = context.Date,
        Error = context.Error,
        Math = context.Math,
        RegExp = context.RegExp,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = context.Array.prototype,
        objectProto = context.Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = context.Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Reflect = context.Reflect,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        clearTimeout = context.clearTimeout,
        enumerate = Reflect ? Reflect.enumerate : undefined,
        getPrototypeOf = Object.getPrototypeOf,
        getOwnPropertySymbols = Object.getOwnPropertySymbols,
        iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        setTimeout = context.setTimeout,
        splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = Object.keys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var Map = getNative(context, 'Map'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
    var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var mapCtorString = Map ? funcToString.call(Map) : '',
        setCtorString = Set ? funcToString.call(Set) : '',
        weakMapCtorString = WeakMap ? funcToString.call(WeakMap) : '';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chaining. Methods that operate on and return arrays, collections, and
     * functions can be chained together. Methods that retrieve a single value or
     * may return a primitive value will automatically end the chain sequence and
     * return the unwrapped value. Otherwise, the value must be unwrapped with
     * `_#value`.
     *
     * Explicit chaining, which must be unwrapped with `_#value` in all cases,
     * may be enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization to merge iteratee calls; this avoids the creation
     * of intermediate arrays and can greatly reduce the number of iteratee executions.
     * Sections of a chain sequence qualify for shortcut fusion if the section is
     * applied to an array of at least two hundred elements and any iteratees
     * accept only one argument. The heuristic for whether a section qualifies
     * for shortcut fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatten`, `flattenDeep`, `flattenDepth`, `flip`, `flow`, `flowRight`,
     * `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`, `intersection`,
     * `intersectionBy`, `intersectionWith`, `invert`, `invertBy`, `invokeMap`,
     * `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`,
     * `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`, `method`,
     * `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`, `orderBy`,
     * `over`, `overArgs`, `overEvery`, `overSome`, `partial`, `partialRight`,
     * `partition`, `pick`, `pickBy`, `plant`, `property`, `propertyOf`, `pull`,
     * `pullAll`, `pullAllBy`, `pullAllWith`, `pullAt`, `push`, `range`,
     * `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`,
     * `set`, `setWith`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`, `spread`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
     * `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`,
     * `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`,
     * `uniqWith`, `unset`, `unshift`, `unzip`, `unzipWith`, `update`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`,
     * `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `each`, `eachRight`,
     * `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `first`, `floor`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`, `includes`,
     * `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`, `isArrayBuffer`,
     * `isArrayLike`, `isArrayLikeObject`, `isBoolean`, `isBuffer`, `isDate`,
     * `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`, `isFinite`,
     * `isFunction`, `isInteger`, `isLength`, `isMap`, `isMatch`, `isMatchWith`,
     * `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`,
     * `isPlainObject`, `isRegExp`, `isSafeInteger`, `isSet`, `isString`,
     * `isUndefined`, `isTypedArray`, `isWeakMap`, `isWeakSet`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`,
     * `maxBy`, `mean`, `min`, `minBy`, `noConflict`, `noop`, `now`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toInteger`, `toJSON`, `toLength`, `toLower`,
     * `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`, `trimEnd`,
     * `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`, `upperFirst`,
     * `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE ||
          (arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an hash object.
     *
     * @private
     * @constructor
     * @returns {Object} Returns the new hash object.
     */
    function Hash() {}

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(hash, key) {
      return hashHas(hash, key) && delete hash[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(hash, key) {
      if (nativeCreate) {
        var result = hash[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(hash, key) {
      return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     */
    function hashSet(hash, key, value) {
      hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function MapCache(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': Map ? new Map : [],
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapDelete(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map['delete'](key) : assocDelete(data.map, key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapGet(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashGet(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.get(key) : assocGet(data.map, key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashHas(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.has(key) : assocHas(data.map, key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache object.
     */
    function mapSet(key, value) {
      var data = this.__data__;
      if (isKeyable(key)) {
        hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
      } else if (Map) {
        data.map.set(key, value);
      } else {
        assocSet(data.map, key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a set cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.push(values[index]);
      }
    }

    /**
     * Checks if `value` is in `cache`.
     *
     * @private
     * @param {Object} cache The set cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function cacheHas(cache, value) {
      var map = cache.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        return hash[value] === HASH_UNDEFINED;
      }
      return map.has(value);
    }

    /**
     * Adds `value` to the set cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var map = this.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        hash[value] = HASH_UNDEFINED;
      }
      else {
        map.set(value, HASH_UNDEFINED);
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function Stack(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = { 'array': [], 'map': null };
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocDelete(array, key) : data.map['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocGet(array, key) : data.map.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocHas(array, key) : data.map.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache object.
     */
    function stackSet(key, value) {
      var data = this.__data__,
          array = data.array;

      if (array) {
        if (array.length < (LARGE_ARRAY_SIZE - 1)) {
          assocSet(array, key, value);
        } else {
          data.array = null;
          data.map = new MapCache(array);
        }
      }
      var map = data.map;
      if (map) {
        map.set(key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Removes `key` and its value from the associative array.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function assocDelete(array, key) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = array.length - 1;
      if (index == lastIndex) {
        array.pop();
      } else {
        splice.call(array, index, 1);
      }
      return true;
    }

    /**
     * Gets the associative array value for `key`.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function assocGet(array, key) {
      var index = assocIndexOf(array, key);
      return index < 0 ? undefined : array[index][1];
    }

    /**
     * Checks if an associative array value for `key` exists.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function assocHas(array, key) {
      return assocIndexOf(array, key) > -1;
    }

    /**
     * Gets the index at which the first occurrence of `key` is found in `array`
     * of key-value pairs.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Sets the associative array `key` to `value`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     */
    function assocSet(array, key, value) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        array.push([key, value]);
      } else {
        array[index][1] = value;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function assignInDefaults(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (typeof key == 'number' && value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          isNil = object == null,
          length = paths.length,
          result = Array(length);

      while (++index < length) {
        result[index] = isNil ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the array-like object.
     */
    function baseCastArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the array-like object.
     */
    function baseCastFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast property path array.
     */
    function baseCastPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            result = baseAssign(result, value);
            return isFull ? copySymbols(value, result) : result;
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return (isFull && !isArr) ? copySymbols(value, result) : result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     */
    function baseConforms(source) {
      var props = keys(source),
          length = props.length;

      return function(object) {
        if (object == null) {
          return !length;
        }
        var index = length;
        while (index--) {
          var key = props[index],
              predicate = source[key],
              value = object[key];

          if ((value === undefined && !(key in Object(object))) || !predicate(value)) {
            return false;
          }
        }
        return true;
      };
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an array
     * of `func` arguments.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments to provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support for
     * excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && isArrayLikeObject(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return object == null ? object : baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
      // that are composed entirely of index properties, return `false` for
      // `hasOwnProperty` checks of them.
      return hasOwnProperty.call(object, key) ||
        (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      if (!isKey(path, object)) {
        path = baseCastPath(path);
        object = parent(object, path);
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {boolean} [bitmask] The bitmask of comparison flags.
     *  The bitmask may be composed of the following flags:
     *     1 - Unordered comparison
     *     2 - Partial comparison
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = getTag(object);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object),
          othIsObj = othTag == objectTag && !isHostObject(other),
          isSameTag = objTag == othTag;

      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
          : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          stack || (stack = new Stack);
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack,
              result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;

          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      var type = typeof value;
      if (type == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (type == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      return nativeKeys(Object(object));
    }

    /**
     * The base implementation of `_.keysIn` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      object = object == null ? object : Object(object);

      var result = [];
      for (var key in object) {
        result.push(key);
      }
      return result;
    }

    // Fallback for IE < 9 with es6-shim.
    if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
      baseKeysIn = function(object) {
        return iteratorToArray(enumerate(object));
      };
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value &&
            (value !== undefined || (key in Object(object)));
        };
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      var props = (isArray(source) || isTypedArray(source))
        ? undefined
        : keysIn(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      });
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        newValue = srcValue;
        if (isArray(srcValue) || isTypedArray(srcValue)) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else {
            isCommon = false;
            newValue = baseClone(srcValue, !customizer);
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
            isCommon = false;
            newValue = baseClone(srcValue, !customizer);
          }
          else {
            newValue = objValue;
          }
        }
        else {
          isCommon = false;
        }
      }
      stack.set(srcValue, newValue);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      }
      stack['delete'](srcValue);
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : Array(1), getIteratee());

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property names.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, props) {
      object = Object(object);
      return arrayReduce(props, function(result, key) {
        if (key in object) {
          result[key] = object[key];
        }
        return result;
      }, {});
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key) {
        if (predicate(value, key)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (lastIndex == length || index != previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          }
          else if (!isKey(index, array)) {
            var path = baseCastPath(index),
                object = parent(array, path);

            if (object != null) {
              delete object[last(path)];
            }
          }
          else {
            delete array[index];
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments to numbers.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the new array of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          var newValue = value;
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined;
            if (newValue === undefined) {
              newValue = objValue == null
                ? (isIndex(path[index + 1]) ? [] : {})
                : objValue;
            }
          }
          assignValue(nested, key, newValue);
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array) {
      return baseSortedUniqBy(array);
    }

    /**
     * The base implementation of `_.sortedUniqBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniqBy(array, iteratee) {
      var index = 0,
          length = array.length,
          value = array[0],
          computed = iteratee ? iteratee(value) : value,
          seen = computed,
          resIndex = 1,
          result = [value];

      while (++index < length) {
        value = array[index],
        computed = iteratee ? iteratee(value) : value;

        if (!eq(computed, seen)) {
          seen = computed;
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);
      object = parent(object, path);
      var key = last(path);
      return (object != null && has(object, key)) ? delete object[key] : true;
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var index = -1,
          length = arrays.length;

      while (++index < length) {
        var result = result
          ? arrayPush(
              baseDifference(result, arrays[index], iteratee, comparator),
              baseDifference(arrays[index], result, iteratee, comparator)
            )
          : arrays[index];
      }
      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property names.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        assignFunc(result, props[index], index < valsLength ? values[index] : undefined);
      }
      return result;
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map) {
      return arrayReduce(mapToArray(map), addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set) {
      return arrayReduce(setToArray(set), addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object) {
      return copyObjectWith(source, props, object);
    }

    /**
     * This function is like `copyObject` except that it accepts a function to
     * customize copied values.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObjectWith(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : source[key];

        assignValue(object, key, newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return rest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = typeof customizer == 'function'
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBaseWrapper(func, bitmask, thisArg) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = reHasComplexSymbol.test(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols ? strSymbols[0] : string.charAt(0),
            trailing = strSymbols ? strSymbols.slice(1).join('') : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string)), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurryWrapper(func, bitmask, arity) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getPlaceholder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return rest(function(funcs) {
        funcs = baseFlatten(funcs, 1);

        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 &&
              isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
          isFlip = bitmask & FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getPlaceholder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new invoker function.
     */
    function createOver(arrayFunc) {
      return rest(function(iteratees) {
        iteratees = arrayMap(baseFlatten(iteratees, 1), getIteratee());
        return rest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(string, length, chars) {
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars === undefined ? ' ' : (chars + '');

      var result = repeat(chars, nativeCeil(padLength / stringSize(chars)));
      return reHasComplexSymbol.test(chars)
        ? stringToArray(result).slice(0, padLength).join('')
        : result.slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toNumber(start);
        start = start === start ? start : 0;
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toNumber(end) || 0;
        }
        step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & CURRY_FLAG,
          newArgPos = argPos ? copyArray(argPos) : undefined,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

      if (!(bitmask & CURRY_BOUND_FLAG)) {
        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, newArgPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return result;
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = toInteger(precision);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] == null
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == BIND_FLAG) {
        var result = createBaseWrapper(func, bitmask, thisArg);
      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
        result = createCurryWrapper(func, bitmask, arity);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
        result = createPartialWrapper(func, bitmask, thisArg, partials);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
      var index = -1,
          isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked) {
        return stacked == other;
      }
      var result = true;
      stack.set(array, other);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isUnordered) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
              })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
      switch (tag) {
        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object) ? other != +other : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          // Recursively compare objects (susceptible to call stack limits).
          return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask | UNORDERED_COMPARE_FLAG, stack.set(object, other));

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : baseHas(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      return result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "iteratee" function. If the `_.iteratee` method is
     * customized this function returns the custom method, otherwise it returns
     * `baseIteratee`. If arguments are provided the chosen function is invoked
     * with them and its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = toPairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getPlaceholder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Creates an array of the own symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = getOwnPropertySymbols || function() {
      return [];
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function getTag(value) {
      return objectToString.call(value);
    }

    // Fallback for IE 11 providing `toStringTag` values for maps, sets, and weakmaps.
    if ((Map && getTag(new Map) != mapTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : null,
            ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case mapCtorString: return mapTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      if (object == null) {
        return false;
      }
      var result = hasFunc(object, path);
      if (!result && !isKey(path)) {
        path = baseCastPath(path);
        object = parent(object, path);
        if (object != null) {
          path = last(path);
          result = hasFunc(object, path);
        }
      }
      var length = object ? object.length : undefined;
      return result || (
        !!length && isLength(length) && isIndex(path, length) &&
        (isArray(object) || isString(object) || isArguments(object))
      );
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototypeOf(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Creates an array of index keys for `object` values of arrays,
     * `arguments` objects, and strings, otherwise `null` is returned.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array|null} Returns index keys, else `null`.
     */
    function indexKeys(object) {
      var length = object ? object.length : undefined;
      if (isLength(length) &&
          (isArray(object) || isString(object) || isArguments(object))) {
        return baseTimes(length, String);
      }
      return null;
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (typeof value == 'number') {
        return true;
      }
      return !isArray(value) &&
        (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
          (object != null && value in Object(object)));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return type == 'number' || type == 'boolean' ||
        (type == 'string' && value != '__proto__') || value == null;
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * modify function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * combined case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

      var isCombo =
        ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
        ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : copyArray(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : copyArray(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : copyArray(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : copyArray(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = copyArray(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     * @returns {*} Returns the value to assign.
     */
    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
      }
      return objValue;
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    function stringToPath(string) {
      var result = [];
      toString(string).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=0] The length of each chunk.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size) {
      size = nativeMax(toInteger(size), 0);

      var length = array ? array.length : 0;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var concat = rest(function(array, values) {
      if (!isArray(array)) {
        array = array == null ? [] : [Object(array)];
      }
      values = baseFlatten(values, 1);
      return arrayConcat(array, values);
    });

    /**
     * Creates an array of unique `array` values not included in the other
     * given arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([3, 2, 1], [4, 2]);
     * // => [3, 1]
     */
    var difference = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
     * // => [3.1, 1.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = rest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true), getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. Result values
     * are chosen from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = rest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3))
        : -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3), true)
        : -1;
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs ? pairs.length : 0,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the offset
     * from the end of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      fromIndex = toInteger(fromIndex);
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [4, 2], [1, 2]);
     * // => [2]
     */
    var intersection = rest(function(arrays) {
      var mapped = arrayMap(arrays, baseCastArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = rest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, baseCastArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. Result values are chosen
     * from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = rest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, baseCastArrayLikeObject);

      if (comparator === last(mapped)) {
        comparator = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array ? nativeJoin.call(array, separator) : '';
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    var pull = rest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pullAll(array, [2, 3]);
     * console.log(array);
     * // => [1, 1]
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified individually or in arrays.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = rest(function(array, indexes) {
      indexes = arrayMap(baseFlatten(indexes, 1), String);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(compareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @category Array
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array ? nativeReverse.call(array) : array;
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of [`Array#slice`](https://mdn.io/Array/slice)
     * to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 5], 4);
     * // => 0
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
     *
     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([1, 1, 2, 2], 2);
     * // => 2
     */
    function sortedIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5], 4);
     * // => 1
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniqBy(array, getIteratee(iteratee))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with three
     * arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2, 1], [4, 2], [1, 2]);
     * // => [2, 1, 4]
     */
    var union = rest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by which
     * uniqueness is computed. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1, 1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, true), getIteratee(iteratee));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length)
        ? baseUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length)
        ? baseUniq(array, getIteratee(iteratee))
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      return (array && array.length)
        ? baseUniq(array, undefined, comparator)
        : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([2, 1], [4, 2]);
     * // => [1, 4]
     */
    var xor = rest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by which
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = rest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property names and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} [props=[]] The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} [props=[]] The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = rest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method chaining enabled.
     * The result of such method chaining must be unwrapped with `_#value`.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths of elements to pick,
     *  specified individually or in arrays.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     *
     * _(['a', 'b', 'c']).at(0, 2).value();
     * // => ['a', 'c']
     */
    var wrapperAt = rest(function(paths) {
      paths = baseFlatten(paths, 1);
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * This method is the wrapper version of `_.flatMap`.
     *
     * @name flatMap
     * @memberOf _
     * @category Seq
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _([1, 2]).flatMap(duplicate).value();
     * // => [1, 1, 2, 2]
     */
    function wrapperFlatMap(iteratee) {
      return this.map(iteratee).flatten();
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three arguments:
     * (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three arguments:
     * (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    function find(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEach);
    }

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate, true);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEachRight);
    }

    /**
     * Creates an array of flattened values by running each element in `collection`
     * through `iteratee` and concating its result to the other mapped values.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior use `_.forIn` or `_.forOwn`
     * for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(value) {
     *   console.log(value);
     * });
     * // => logs `1` then `2`
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed)
     */
    function forEach(collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEach(collection, iteratee)
        : baseEach(collection, baseCastFunction(iteratee));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => logs `2` then `1`
     */
    function forEachRight(collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEachRight(collection, iteratee)
        : baseEachRight(collection, baseCastFunction(iteratee));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of elements responsible for generating the key.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string it's checked
     * for a substring of `value`, otherwise [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it's
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = rest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`,
     * `invert`, `parseInt`, `random`, `range`, `rangeRight`, `slice`, `some`,
     * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`,
     * and `words`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} [iteratees=[_.identity]] The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getIteratee(predicate, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var array = isArrayLike(collection) ? collection : values(collection),
          length = array.length;

      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=0] The number of elements to sample.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n) {
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = baseClamp(toInteger(n), 0, length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sampleSize(collection, MAX_ARRAY_LENGTH);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        var result = collection.length;
        return (result && isString(collection)) ? stringSize(collection) : result;
      }
      return keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[_.identity]]
     *  The iteratees to sort by, specified individually or in arrays.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, function(o) { return o.user; });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.sortBy(users, 'user', function(o) {
     *   return Math.floor(o.age / 10);
     * });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortBy = rest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees.length = 1;
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @type {Function}
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = Date.now;

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = rest(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getPlaceholder(bind));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = rest(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getPlaceholder(bindKey));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide an options object to indicate whether `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it's invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          leading = false,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function flush() {
        if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
          result = func.apply(thisArg, args);
        }
        cancel();
        return result;
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!lastCalled && !maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled);

          var isCalled = (remaining <= 0 || remaining > maxWait) &&
            (leading || maxTimeoutId);

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => logs 'deferred' after one or more milliseconds
     */
    var defer = rest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = rest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrapper(func, FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with arguments transformed by
     * corresponding `transforms`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified individually or in arrays.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = rest(function(func, transforms) {
      transforms = arrayMap(baseFlatten(transforms, 1), getIteratee());

      var funcsLength = transforms.length;
      return rest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = rest(function(func, partials) {
      var holders = replaceHolders(partials, getPlaceholder(partial));
      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = rest(function(func, partials) {
      var holders = replaceHolders(partials, getPlaceholder(partialRight));
      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified individually or in arrays.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = rest(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes, 1));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, array);
          case 1: return func.call(this, args[0], array);
          case 2: return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
      return rest(function(args) {
        var array = args[start],
            otherArgs = args.slice(0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide an options object to indicate whether
     * `func` should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return partial(wrapper, value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, false, true);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      return baseClone(value, false, true, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      return baseClone(value, true, true, customizer);
    }

    /**
     * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @type {Function}
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    function isArrayBuffer(value) {
      return isObjectLike(value) && objectToString.call(value) == arrayBufferTag;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value)) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && objectToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = !Buffer ? constant(false) : function(value) {
      return value instanceof Buffer;
    };

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objectToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty collection or object. A value is considered
     * empty if it's an `arguments` object, array, string, or jQuery-like collection
     * with a length of `0` or has no own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (isArrayLike(value) &&
          (isArray(value) || isString(value) ||
            isFunction(value.splice) || isArguments(value))) {
        return !value.length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are **not** supported.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined` comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      return (objectToString.call(value) == errorTag) ||
        (typeof value.message == 'string' && typeof value.name == 'string');
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MAX_VALUE);
     * // => true
     *
     * _.isFinite(3.14);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array and weak map constructors,
      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    function isMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values. This method is
     * equivalent to a `_.matches` function when `source` is partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined` comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(funcToString.call(value));
      }
      return isObjectLike(value) &&
        (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && objectToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) ||
          objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      var Ctor = proto.constructor;
      return (typeof Ctor == 'function' &&
        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objectToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    function isSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && objectToString.call(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (iteratorSymbol && value[iteratorSymbol]) {
        return iteratorToArray(value[iteratorSymbol]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3');
     * // => 3
     */
    function toInteger(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      var remainder = value % 1;
      return value === value ? (remainder ? value - remainder : value) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3);
     * // => 3
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3');
     * // => 3
     */
    function toNumber(value) {
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3');
     * // => 3
     */
    function toSafeInteger(value) {
      return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    }

    /**
     * Converts `value` to a string if it's not one. An empty string is returned
     * for `null` and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (value == null) {
        return '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source objects to the destination
     * object. Source objects are applied from left to right. Subsequent sources
     * overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.c = 3;
     * }
     *
     * function Bar() {
     *   this.e = 5;
     * }
     *
     * Foo.prototype.d = 4;
     * Bar.prototype.f = 6;
     *
     * _.assign({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3, 'e': 5 }
     */
    var assign = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * function Bar() {
     *   this.d = 4;
     * }
     *
     * Foo.prototype.c = 3;
     * Bar.prototype.e = 5;
     *
     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
     */
    var assignIn = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keysIn(source), object);
        return;
      }
      for (var key in source) {
        assignValue(object, key, source[key]);
      }
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer` which
     * is invoked to produce the assigned values. If `customizer` returns `undefined`
     * assignment is handled by the method instead. The `customizer` is invoked
     * with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObjectWith(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer` which
     * is invoked to produce the assigned values. If `customizer` returns `undefined`
     * assignment is handled by the method instead. The `customizer` is invoked
     * with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObjectWith(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths of elements to pick,
     *  specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     *
     * _.at(['a', 'b', 'c'], 0, 2);
     * // => ['a', 'c']
     */
    var at = rest(function(object, paths) {
      return baseAt(object, baseFlatten(paths, 1));
    });

    /**
     * Creates an object that inherits from the `prototype` object. If a `properties`
     * object is given its own enumerable properties are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own and inherited enumerable properties of source objects to the
     * destination object for all destination properties that resolve to `undefined`.
     * Source objects are applied from left to right. Once a property is set,
     * additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = rest(function(args) {
      args.push(undefined, assignInDefaults);
      return apply(assignInWith, undefined, args);
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = rest(function(args) {
      args.push(undefined, mergeDefaults);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
    }

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The iteratee is invoked with three arguments:
     * (value, key, object). Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', then 'c' (iteration order is not guaranteed)
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, baseCastFunction(iteratee), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, baseCastFunction(iteratee), keysIn);
    }

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The iteratee is invoked with three arguments:
     * (value, key, object). Iteratee functions may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed)
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, baseCastFunction(iteratee));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, baseCastFunction(iteratee));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b.c');
     * // => true
     *
     * _.hasIn(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` through `iteratee`.
     * The corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = rest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      var isProto = isPrototype(object);
      if (!(isProto || isArrayLike(object))) {
        return baseKeys(object);
      }
      var indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      for (var key in object) {
        if (baseHas(object, key) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(isProto && key == 'constructor')) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      var index = -1,
          isProto = isPrototype(object),
          props = baseKeysIn(object),
          propsLength = props.length,
          indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      while (++index < propsLength) {
        var key = props[index];
        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`. The iteratee is invoked with
     * three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[iteratee(value, key, object)] = value;
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee is invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[key] = iteratee(value, key, object);
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable properties of source objects into the destination
     * object. Source properties that resolve to `undefined` are skipped if a
     * destination value exists. Array and plain object properties are merged
     * recursively.Other objects and value types are overridden by assignment.
     * Source objects are applied from left to right. Subsequent sources
     * overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined` merging is handled by the
     * method instead. The `customizer` is invoked with seven arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property names to omit, specified
     *  individually or in arrays.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = rest(function(object, props) {
      if (object == null) {
        return {};
      }
      props = arrayMap(baseFlatten(props, 1), String);
      return basePick(object, baseDifference(keysIn(object), props));
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable properties of `object` that `predicate`
     * doesn't return truthy for. The predicate is invoked with two arguments:
     * (value, key).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      predicate = getIteratee(predicate);
      return basePickBy(object, function(value, key) {
        return !predicate(value, key);
      });
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property names to pick, specified
     *  individually or in arrays.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = rest(function(object, props) {
      return object == null ? {} : basePick(object, baseFlatten(props, 1));
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      return object == null ? {} : basePickBy(object, getIteratee(predicate));
    }

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it's invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      if (!isKey(path, object)) {
        path = baseCastPath(path);
        var result = get(object, path);
        object = parent(object, path);
      } else {
        result = object == null ? undefined : object[path];
      }
      if (result === undefined) {
        result = defaultValue;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable key-value pairs for `object` which
     * can be consumed by `_.fromPairs`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    function toPairs(object) {
      return baseToPairs(object, keys(object));
    }

    /**
     * Creates an array of own and inherited enumerable key-value pairs for
     * `object` which can be consumed by `_.fromPairs`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 1]] (iteration order is not guaranteed)
     */
    function toPairsIn(object) {
      return baseToPairs(object, keysIn(object));
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The iteratee is invoked with four arguments:
     * (accumulator, value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getIteratee(iteratee, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototypeOf(object)) : {};
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, baseCastFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, baseCastFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }

    /**
     * Creates an array of the own and inherited enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toNumber(start) || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toNumber(end) || 0;
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are floats,
     * a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toNumber(lower) || 0;
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toNumber(upper) || 0;
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = typeof target == 'string' ? target : (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in IE < 9, they can break out of
     * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      return createPadding('', leftLength, chars) + string + createPadding('', rightLength, chars);
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      return string + createPadding(string, length, chars);
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      return createPadding(string, length, chars) + string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#x15.1.2.2)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = toString(string).replace(reTrim, '');
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      string = toString(string);
      n = toInteger(n);

      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the new array of string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      return toString(string).split(separator, limit);
    }

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + capitalize(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = baseClamp(toInteger(position), 0, string.length);
      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, assignInDefaults);

      var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar');
     * // => '--foo-bar'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar');
     * // => '--FOO-BAR'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrim, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars);

      return strSymbols
        .slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1)
        .join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrimEnd, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols
        .slice(0, charsEndIndex(strSymbols, stringToArray(chars)) + 1)
        .join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrimStart, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols
        .slice(charsStartIndex(strSymbols, stringToArray(chars)))
        .join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options=({})] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? toString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (reHasComplexSymbol.test(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? strSymbols.slice(0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = rest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind,
     *  specified individually or in arrays.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, 'onClick');
     * jQuery(element).on('click', view.onClick);
     * // => logs 'clicked docs' when clicked
     */
    var bindAll = rest(function(object, methodNames) {
      arrayEach(baseFlatten(methodNames, 1), function(key) {
        object[key] = bind(object[key], object);
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` invoking the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.constant(true),                _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs ? pairs.length : 0,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return rest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, true));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument given to it.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name the created callback returns the
     * property value for a given element. If `func` is an object the created
     * callback returns `true` for elements that contain the equivalent object
     * properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(callback, func) {
     *   var p = /^(\S+)\s*([<>])\s*(\S+)$/.exec(func);
     *   return !p ? callback(func) : function(object) {
     *     return (p[2] == '>' ? object[p[1]] > p[3] : object[p[1]] < p[3]);
     *   };
     * });
     *
     * _.filter(users, 'age > 36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`. The created function is equivalent to
     * `_.isMatch` with a `source` partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invokeMap(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = rest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = rest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = (isObject(options) && 'chain' in options) ? options.chain : true,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Util
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns its nth argument.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.nthArg(1);
     *
     * func('a', 'b', 'c');
     * // => 'b'
     */
    function nthArg(n) {
      n = toInteger(n);
      return function() {
        return arguments[n];
      };
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments provided
     * to the created function and returns their results.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} iteratees The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over(Math.max, Math.min);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(true));
     * // => [true, true, true, true]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = baseCastFunction(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     *
     * var path = ['a', 'b', 'c'],
     *     newPath = _.toPath(path);
     *
     * console.log(newPath);
     * // => ['a', 'b', 'c']
     *
     * console.log(path === newPath);
     * // => false
     */
    function toPath(value) {
      return isArray(value) ? arrayMap(value, String) : stringToPath(value);
    }

    /**
     * Generates a unique ID. If `prefix` is given the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      var result;
      if (augend === undefined && addend === undefined) {
        return 0;
      }
      if (augend !== undefined) {
        result = augend;
      }
      if (addend !== undefined) {
        result = result === undefined ? addend : (result + addend);
      }
      return result;
    }

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey
     * `undefined` is returned.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, gt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), gt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return sum(array) / (array ? array.length : 0);
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey
     * `undefined` is returned.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, lt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), lt)
        : undefined;
    }

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    function subtract(minuend, subtrahend) {
      var result;
      if (minuend === undefined && subtrahend === undefined) {
        return 0;
      }
      if (minuend !== undefined) {
        result = minuend;
      }
      if (subtrahend !== undefined) {
        result = result === undefined ? subtrahend : (result - subtrahend);
      }
      return result;
    }

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Avoid inheriting from `Object.prototype` when possible.
    Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

    // Add functions to the `MapCache`.
    MapCache.prototype.clear = mapClear;
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `SetCache`.
    SetCache.prototype.push = cachePush;

    // Add functions to the `Stack` cache.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = rest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      predicate = getIteratee(predicate, 3);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.flatMap = wrapperFlatMap;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    if (iteratorSymbol) {
      lodash.prototype[iteratorSymbol] = wrapperToIterator;
    }
    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Expose lodash on the free variable `window` or `self` when available. This
  // prevents errors in cases where lodash is loaded by a script tag in the presence
  // of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch for more details.
  (freeWindow || freeSelf || {})._ = _;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3]);
