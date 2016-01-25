'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Character = function () {
	function Character(params) {
		_classCallCheck(this, Character);

		this.position = params.hasOwnProperty('position') ? params.position : { x: 0, y: 0 };
		this.sprite = params.hasOwnProperty('sprite') ? params.sprite : null;
		this.dx = 0;
		this.dy = 0;
		this.max_vx = params.hasOwnProperty('max_vx') ? params.max_vx : 16 * 7.5;
		this.max_vy = params.hasOwnProperty('max_vy') ? params.max_vy : 16 * 15;
		this.acceleration = params.hasOwnProperty('acceleration') ? params.acceleration : this.max_vx * 10;
		this.friction = params.hasOwnProperty('friction') ? params.friction : this.max_vx * 6;
		this.jump_height = params.hasOwnProperty('jump_height') ? params.jump_height : 18 * 1500;
		this.ticks = 0;
		this.ticksPerFrame = params.hasOwnProperty('ticks_per_frame') ? params.ticks_per_frame : 4;
		this.jumping = false;
		this.falling = true;
		this.life = params.hasOwnProperty('life') ? params.life : 6;
		this.spawn = params.hasOwnProperty('spawn') ? params.spawn : { x: 0, y: 0 };
		this.dead = false;
		this.respawn_after = params.hasOwnProperty('respawn_after') ? params.respawn_after : 5 * 1000;
		this.time_of_dead = null;
	}

	_createClass(Character, [{
		key: 'update',
		value: function update(dt, events) {}
	}, {
		key: 'draw',
		value: function draw() {
			this.ticks++;
			this.sprite.draw(this.position.x, this.position.y);
		}
	}, {
		key: 'moveLeft',
		value: function moveLeft() {}
	}, {
		key: 'moveRight',
		value: function moveRight() {}
	}, {
		key: 'jump',
		value: function jump() {}
	}, {
		key: 'die',
		value: function die() {}
	}, {
		key: 'stop',
		value: function stop() {}
	}]);

	return Character;
}();

var Player = exports.Player = function (_Character) {
	_inherits(Player, _Character);

	function Player(params) {
		_classCallCheck(this, Player);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, params));

		_this.name = 'Player';
		return _this;
	}

	_createClass(Player, [{
		key: 'update',
		value: function update(dt, events) {

			var wasleft = this.dx < 0,
			    wasright = this.dx > 0,
			    falling = this.falling,
			    friction = this.friction * (falling ? 0.5 : 1),
			    acceleration = this.acceleration * (falling ? 0.5 : 1);

			this.ddx = 0;
			this.ddy = gravity;

			if (!this.dead) {
				if (Key.isDown(Key.LEFT)) this.ddx = this.ddx - acceleration;else if (wasleft) this.ddx = this.ddx + friction;

				if (Key.isDown(Key.RIGHT)) this.ddx = this.ddx + acceleration;else if (wasright) this.ddx = this.ddx - friction;

				if (Key.isDown(Key.SPACE) && !this.jumping && !falling) {

					this.ddy = this.ddy - this.jump_height;
					this.jumping = true;
					Game.jumpAudio.play();
				}

				if (Key.isDown(Key.RIGHT) || wasright) {
					this.moveRight();
				}

				if (Key.isDown(Key.LEFT) || wasleft) {
					this.moveLeft();
				}

				if (Key.isDown(Key.SPACE) && (Key.isDown(Key.LEFT) || wasleft)) {
					this.jumpLeft();
				} else if (Key.isDown(Key.SPACE) && (Key.isDown(Key.RIGHT) || wasright)) {
					this.jumpRight();
				} else if (!Key.isDown(Key.SPACE) && !Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT) && !wasright && !wasleft && !this.falling) {
					this.stop();
				}

				horizontal_movement = Math.round(dt * this.dx);

				if (this.position.x * 2 >= Screen.canvas.width - Camera.margin && (Key.isDown(Key.RIGHT) || wasright) && Camera.offset.x + Screen.canvas.width < Game.level.width * Game.level.tilewidth * 2 - Camera.offset.x) {
					this.position.x = this.position.x;
					Camera.offset.x += horizontal_movement;
				} else if (this.position.x * 2 <= Camera.margin && (Key.isDown(Key.LEFT) || wasleft) && Camera.offset.x > 0) {
					this.position.x = this.position.x;
					Camera.offset.x += horizontal_movement;
				} else {
					this.position.x = this.position.x + horizontal_movement;
				}

				vertical_movement = Math.round(dt * this.dy);

				if (this.position.y * 2 >= Screen.canvas.height - Camera.margin && !this.jumping && Camera.offset.y + Screen.canvas.height < Game.level.height * Game.level.tileheight * 2 - Camera.offset.y) {
					this.position.y = this.position.y;
					Camera.offset.y += vertical_movement;
				} else if (this.position.y * 2 <= Screen.canvas.height - Camera.margin && this.jumping && Camera.offset.y > 0) {
					this.position.y = this.position.y;
					Camera.offset.y += vertical_movement;
				} else {
					this.position.y = this.position.y + vertical_movement;
				}

				this.dx = bound(this.dx + dt * this.ddx, -this.max_vx, this.max_vx);
				this.dy = bound(this.dy + dt * this.ddy, -this.max_vy, this.max_vy);

				if (wasleft && this.dx > 0 || wasright && this.dx < 0) {
					this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
				}

				if (vertical_movement > 0) {
					this.falling = true;
				}

				this.checkForCollisions();
				this.checkForPowerUps();
				this.checkForCoins();
				this.checkForEnemies();
			} else {
				this.dx = 0;
				this.dy = 0;
				this.ddx = 0;
				if (timestamp() >= this.timeofdead + this.respawnAfter) {
					this.spawn();
				}
			}
		}
	}, {
		key: 'checkForCollisions',
		value: function checkForCollisions() {
			player = this;
			Game.coliders.map(function (object) {
				vX = player.position.x + 8 - (object.x - Camera.offset.x + object.width / 2);
				vY = player.position.y + 8 - (object.y - Camera.offset.y + object.height / 2);

				hWidths = 8 + object.width / 2;
				hHeights = 8 + object.height / 2;

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
					if (object.killing && !player.dead) {
						player.die();
					}
				}
			});
		}
	}, {
		key: 'checkForPowerUps',
		value: function checkForPowerUps() {
			player = this;
			Game.powerUps.map(function (powerUp) {

				if (!powerUp.deleted && player.position.x + 8 > powerUp.x - Camera.offset.x && player.position.x < powerUp.x + powerUp.height - Camera.offset.x && player.position.y + 8 > powerUp.y - powerUp.height - Camera.offset.y && player.position.y + 16 < powerUp.y + powerUp.height - Camera.offset.y) {
					powerUp.deleted = true;
					if (powerUp.type == 'life' && player.life < 6) {
						player.life++;
					}
					Game.pickAudio.play();
				}
			});
		}
	}, {
		key: 'checkForCoins',
		value: function checkForCoins() {
			player = this;
			//coin.x-Camera.offset.x, (coin.y-coin.height)-Camera.offset.y
			Game.coins.map(function (coin) {
				if (!coin.deleted && player.position.x + 8 > coin.x - Camera.offset.x && player.position.x < coin.x + coin.height - Camera.offset.x && player.position.y + 8 > coin.y - coin.height - Camera.offset.y && player.position.y + 16 < coin.y + coin.height - Camera.offset.y) {
					coin.deleted = true;
					Game.pickAudio.play();
				}
			});
		}
	}, {
		key: 'checkForEnemies',
		value: function checkForEnemies() {
			player = this;
			//coin.x-Camera.offset.x, (coin.y-coin.height)-Camera.offset.y
			// @TODO change to circular colision
			Game.enemies.map(function (enemy) {
				//if ( squared(OB1.x-OB2.x) + squared(OB1.y-OB2.y) < squared(OB1.Radius+OB2.Radius)) return true;
				if (!enemy.deleted && player.position.x + 8 > enemy.x - Camera.offset.x && player.position.x + 8 < enemy.x + enemy.height - Camera.offset.x && player.position.y + 16 > enemy.y - Camera.offset.y && player.position.y + 8 < enemy.y + enemy.height - Camera.offset.y) {
					!player.dead && player.die();
				}
			});
		}
	}, {
		key: 'moveRight',
		value: function moveRight() {

			this.sprite.sourceY = 0;
			if (this.ticks > this.ticksPerFrame) {
				this.ticks = 0;
				this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX + 16;
			}
		}
	}, {
		key: 'moveLeft',
		value: function moveLeft() {

			this.sprite.sourceY = 32;
			if (this.ticks > this.ticksPerFrame) {
				this.ticks = 0;
				this.sprite.sourceX = this.sprite.sourceX == 32 ? 0 : this.sprite.sourceX + 16;
			}
		}
	}, {
		key: 'jumpRight',
		value: function jumpRight() {
			this.sprite.sourceY = 16;
			this.sprite.sourceX = 0;
		}
	}, {
		key: 'jumpLeft',
		value: function jumpLeft() {
			this.sprite.sourceY = 48;
			this.sprite.sourceX = 0;
		}
	}, {
		key: 'die',
		value: function die() {
			this.sprite.sourceY = 16;
			this.sprite.sourceX = 48;
			this.life -= 1;
			this.dead = true;
			this.timeofdead = timestamp();
		}
	}, {
		key: 'spawn',
		value: function spawn() {
			this.dead = false;
			this.sprite.sourceY = 16;
			this.sprite.sourceX = 16;
			this.position.x = this.spawn.x;
			this.position.y = this.spawn.y;
			Camera.offset.x = 0;
			Camera.offset.y = 0;
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.sprite.sourceY = 16;
			this.sprite.sourceX = 16;
		}
	}]);

	return Player;
}(Character);

var Enemy = exports.Enemy = function (_Character2) {
	_inherits(Enemy, _Character2);

	function Enemy(params) {
		_classCallCheck(this, Enemy);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Enemy).call(this, params));

		_this2.name = 'Enemy';
		return _this2;
	}

	return Enemy;
}(Character);

var Princess = exports.Princess = function (_Character3) {
	_inherits(Princess, _Character3);

	function Princess(params) {
		_classCallCheck(this, Princess);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Princess).call(this, params));

		_this3.name = 'Princess';
		return _this3;
	}

	_createClass(Princess, [{
		key: 'update',
		value: function update(dt) {
			this.wave();
		}
	}, {
		key: 'wave',
		value: function wave() {
			Game.sprites.princess.sourceY = 0;
			if (!(Game.ticks % Game.sprites.princess.ticksPerFrame)) {
				Game.sprites.princess.sourceX = Game.sprites.princess.sourceX == 48 ? 16 : Game.sprites.princess.sourceX + 16;
			}
		}
	}]);

	return Princess;
}(Character);