var game, fps=30, lastUpdate;

function update() {
	var dt = 1 + (new Date().getTime() - lastUpdate) / 1000;

	var len = game.players.length;
	for(i=0;i<len;i++) {
		var player = game.players[i];

		//add force on the x-axis depending on the direction and speed of the player.
		player.fx = player.dir * player.speed + game.wind;

		//add force upwards when jumping
		if(player.jump && player.y >= game.height) {
			player.fy = -player.jumpForce;
		}
		else
			player.fy = 0;

		//change velocity based on the acceleration
		player.vx += (player.fx / player.mass) * dt;
		player.vy += (player.fy / player.mass + game.gravity) * dt;

		if(player.y >= game.height) {
			player.vx *= ((game.gravity / player.mass)) * (1 - game.friction); //adding friction when on ground
		}
		else {
			//add air resistance
			player.vx *= (1-player.size/100);
			player.vy *= (1-player.size/100);
		}

		//change position
		player.x += player.vx * dt;
		player.y += player.vy * dt;

		//place player above ground
		if(player.y >= game.height) {
			player.vy = 0;			
			player.y = game.height;
		}
		//prevent leaving the map on left and right
		if(player.x < player.size/2) {
			player.vx = 0;
			player.x =  player.size/2;
		}
		else if(player.x > game.width - player.size/2) {
			player.vx = 0;
			player.x = game.width - player.size/2;
		}
	}
	lastUpdate = new Date().getTime();
	game.lastUpdate = lastUpdate;

	postMessage(game);
}

onmessage = function(e) {
	if(e.data[0] == "init") {
		game = e.data[1];
		lastUpdate=new Date().getTime();
		setInterval(update, 1000/fps);
	}
	else if(e.data[0] == "move") {
		var keyboardState = e.data[1];

		//player 1
		var _dir = 0;
		if(keyboardState.left)
			_dir = -1;
		if(keyboardState.right)
			_dir = 1;

		game.players[0].jump = keyboardState.jump;
		game.players[0].dir = _dir;

		//player 2
		var _dir2 = 0;
		if(keyboardState.p2left)
			_dir2 = -1;
		if(keyboardState.p2right)
			_dir2 = 1;

		game.players[1].jump = keyboardState.p2jump;
		game.players[1].dir = _dir2;
	}
};
