var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var Ball = {
	new: function (incrementedSpeed) {
		return {
			width: 8,
			height: 8,
			x: (this.canvas.width / 2) - 9,
			y: (this.canvas.height / 2) - 9,
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: incrementedSpeed || 9
		};
	}
};

var Paddle = {
	new: function (side) {
		return {
			width: 9,
			height: 105,
			x: side === 'left' ? 90 : this.canvas.width - 90,
			y: (this.canvas.height / 2) - 35,
			score: 0,
			move: DIRECTION.IDLE,
			speed: 15
		};
	}
};

var Game = {
	initialize: function () {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 2800;
		this.canvas.height = 1500;

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player = Paddle.new.call(this, 'left');
		this.paddle = Paddle.new.call(this, 'right');
		this.ball = Ball.new.call(this);

		this.paddle.speed = 8;
		this.running = this.over = false;
		this.turn = this.paddle;
		this.timer = 0;
		this.color = '#8B0000';
        this.scorer = " ";


		Pong.menu();
		Pong.listen();
	},

	endGameMenu: function (text) {
		Pong.context.font = '50px Courier New';
		Pong.context.fillStyle = this.color;

		Pong.context.fillRect(
			Pong.canvas.width / 2 - 350,
			Pong.canvas.height / 2 - 48,
			700,
			100
		);

		Pong.context.fillStyle = '8A2BE2ff';

		Pong.context.fillText(text,
			Pong.canvas.width / 2,
			Pong.canvas.height / 2 + 15
		);

		setTimeout(function () {
			Pong = Object.assign({}, Game);
			Pong.initialize();
		}, 3000);
	},

	menu: function () {
		Pong.draw();

		this.context.font = '50px Courier New';
		this.context.fillStyle = this.color;

		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		this.context.fillStyle = '#8A2BE2ff';

		this.context.fillText('Press any key to begin',
			this.canvas.width / 2,
			this.canvas.height / 2
		);
	},

	update: function () {
		if (!this.over) {
			if (this.ball.x <= 0){
                this.scorer = "AI got a point";
                Pong._resetTurn.call(this, this.paddle, this.player);
            }
			if (this.ball.x >= this.canvas.width - this.ball.width){
                    this.scorer = "Player got a point";
                    Pong._resetTurn.call(this, this.player, this.paddle);
            }
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

			if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;
			if (Pong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				this.turn = null;
			}

			if (this.player.y <= 0) this.player.y = 0;
			else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
				else this.paddle.y -= this.paddle.speed / 4;
			}
			if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
				else this.paddle.y += this.paddle.speed / 4;
			}
			if (this.paddle.y >= this.canvas.height - this.paddle.height) this.paddle.y = this.canvas.height - this.paddle.height;
			else if (this.paddle.y <= 0) this.paddle.y = 0;

			if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
				if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
					this.ball.x = (this.player.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;

				}
			}
			if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
				if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
					this.ball.x = (this.paddle.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;

				}
			}
		}

		if (this.player.score === 20) {
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Player wins!'); }, 1000);
		}
		else if (this.paddle.score === 20) {
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('AI wins'); }, 1000);
		}
	},

	draw: function () {
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.context.fillStyle = this.color;

		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.context.fillStyle = '#8A2BE2ff';

		this.context.fillRect(
			this.player.x,
			this.player.y,
			this.player.width,
			this.player.height
		);

		this.context.fillRect(
			this.paddle.x,
			this.paddle.y,
			this.paddle.width,
			this.paddle.height
		);

		if (Pong._turnDelayIsOver.call(this)) {
			this.context.fillRect(
				this.ball.x,
				this.ball.y,
				this.ball.width,
				this.ball.height
			);
		}

		this.context.beginPath();
		this.context.setLineDash([10, 15]);
		this.context.moveTo(10, this.canvas.height - 140);
		this.context.lineTo(10, 140);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#8A2BE2ff';
		this.context.stroke();

		this.context.beginPath();
		this.context.setLineDash([10, 15]);
		this.context.moveTo(this.canvas.width - 10, this.canvas.height - 140);
		this.context.lineTo(this.canvas.width - 10, 140);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#8A2BE2ff';
		this.context.stroke();

		this.context.font = '100px Courier New';
		this.context.textAlign = 'center';

		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 150,
			1400
		);

		this.context.fillText(
			this.paddle.score.toString(),
			(this.canvas.width / 2) + 150,
			1400
		);

		this.context.fillText(
			this.scorer.toString(),
			(this.canvas.width / 2),
			60
		);
	},

	loop: function () {
		Pong.update();
		Pong.draw();

		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	listen: function () {
		document.addEventListener('keydown', function (key) {
			if (Pong.running === false) {
				Pong.running = true;
				window.requestAnimationFrame(Pong.loop);
			}

			if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;

			if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
		});

		document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
	},

	_resetTurn: function(victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();

		victor.score++;
	},

	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timer >= 1000);
	},


};

var Pong = Object.assign({}, Game);
Pong.initialize();