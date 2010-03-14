
var ctx, canvas, updateWorker, drawIndex, buffer;
var keyboardState, fps=30;

function init() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	var player1 = new Player("Player 1", 100, 100, 10, 20, 50, [200,0,0]);
	var player2 = new Player("Player 2", 100, 100, 100, 20, 150, [0,0,200]);

	var _game = {
		players: [player1, player2],
		wind: 5,
		friction: 0.5,
		gravity: 9.82,
		width: canvas.width,
		height: canvas.height,
	};

	buffer = [_game,_game];
	drawIndex = 0;

	updateWorker = new Worker("update.js");
	updateWorker.onmessage = function(event) {
		var index = drawIndex;
		drawIndex = (drawIndex == 1) ? 0 : 1;

		buffer[index] = event.data;
	};
	updateWorker.onerror = function(error) {
      alert("Update worker error: " + error.message);
      throw error;
    };
	updateWorker.postMessage(["init", _game]);

	keyboardState = {
		jump: false,
		left: false,
		right: false,
		p2jump: false,
		p2left: false,
		p2right: false
	};

	document.onkeydown = function(e) {
		//player 1
		if(e.keyCode == 37) //left
			keyboardState.left = true;
		
		if(e.keyCode == 39) //right
			keyboardState.right = true;
		
		if(e.keyCode == 38) //up
			keyboardState.jump = true;

		//player 2
		if(e.keyCode == 65) //A
			keyboardState.p2left = true;
		
		if(e.keyCode == 68) //D
			keyboardState.p2right = true;
		
		if(e.keyCode == 87) //W
			keyboardState.p2jump = true;
	};
	document.onkeyup = function(e) {
		//player 1
		if(e.keyCode == 37) //left arrow
			keyboardState.left = false;

		if(e.keyCode == 39) //right arrow
			keyboardState.right = false;
		
		if(e.keyCode == 38) //up
			keyboardState.jump = false;

		//player 2
		if(e.keyCode == 65) //A
			keyboardState.p2left = false;
		
		if(e.keyCode == 68) //D
			keyboardState.p2right = false;
		
		if(e.keyCode == 87) //W
			keyboardState.p2jump = false;
	};

	setInterval(function() {
		updateWorker.postMessage(["move", keyboardState]);
	},1000/30);

	draw();
}

function Player(name, x, y, mass, size, speed, color) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.sx = x;
	this.sy = y;
	this.vx = 0;
	this.vy = 0;
	this.mass = mass;
	this.fx = 0;
	this.fy = 0;
	this.size = size;
	this.dir = 0;
	this.jump = false;
	this.jumpForce = 50*mass;
	this.speed = speed;
	this.maxVelocity = 10;
	this.color = color;
};

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.translate(0, 0);

	var len = buffer[drawIndex].players.length;
	for(i=0;i<len;i++) {
		ctx.save();
		var p = buffer[drawIndex].players[i];
		ctx.translate(p.x, p.y);
		ctx.fillStyle = "rgb(" + p.color[0] + "," + p.color[1] + "," + p.color[2] + ")";
		ctx.fillRect(-p.size/2, -p.size, p.size, p.size);
		ctx.restore();
	}
	setTimeout(draw, 1000/fps);
}

init();

