var Player = function () {
	var board;

	var player = document.createElement('div');
	var playerStyle = player.style;
	var speed = 50;
	var playerWidth = 150;
	var creationTimer = 80;
	var stopScale = false;
	var message;

	var arrows = {
		68: 'double',
		83: 'slow'
	}

	var onTheMove = false;
	var movementDirection;
	var moveTimeout;
	var goSlow = false;

	function movePlayer(e) {
		playerWidth = parseInt(playerStyle.width);
		var mouseX = e.offsetX;
		var newLeft = mouseX - (playerWidth / 2);
		if(newLeft <= 0) {
			newLeft = 0;
		}

		if(mouseX + (playerWidth / 2) >= (board.offsetWidth -14)) {
			newLeft = board.offsetWidth - 14 - playerWidth;
		}
		playerStyle.left = newLeft +'px';
	}

	function setPlayerWidth () {
		var changeToLeft = parseInt(playerStyle.left) - 10;
		if(changeToLeft <= 0) {
			changeToLeft = 0;
		}
		
		if(changeToLeft >= board.offsetWidth - playerWidth - 16) {
			changeToLeft = board.offsetWidth - playerWidth - 16;
		}
		playerStyle.left = changeToLeft + 'px';
		playerStyle.width = playerWidth + 'px';

	}

	function changeBallSpeed() {
		message(goSlow ? 8 : 7);
		goSlow = goSlow ? goSlow = false : goSlow = true;
		if(goSlow) {
			setTimeout(changeBallSpeed, 1500);
		}
	}

	function controller(e) {
		if(arrows[e.keyCode]) {
			switch(arrows[e.keyCode]) {
				case 'double':
					playerWidth = parseInt(playerStyle.width) === 150 ? message(5) : message(6);
				break;
				case 'slow':
					changeBallSpeed();
				break;
			}
		}
	}

	function doubleSizeMe () {
		playerWidth = parseInt(playerStyle.width);
		playerWidth = playerWidth === 150 ? playerWidth * 2 : playerWidth / 2;
		playerStyle.width = playerWidth + 'px';
	}

	function getPlayerLocations () {
		return {
			x: parseInt(playerStyle.left),
			y: parseInt(playerStyle.top) ,
			width: parseInt(playerStyle.width),
			height: parseInt(playerStyle.height)
		}
	}

	function gameOver () {
		board.removeEventListener('mousemove', movePlayer);
		document.removeEventListener('keydown', controller);
	}

	function create(boardId, _message) {
		message = _message;
		board = document.getElementById(boardId);
		setPlayerWidth();
		playerStyle.height = '15px';
		playerStyle.backgroundColor = '#1eb1d2';
		playerStyle.top = (parseInt(board.offsetHeight) - 35) +'px';
		playerStyle.pointerEvents= 'none';
		playerStyle.position = 'absolute';
		playerStyle.left = Math.floor(Math.random() * (board.offsetWidth - 16 - playerWidth)) + 'px';
		playerStyle.transition = 'width .2s linear';
		player.id = 'player';
		board.appendChild(player);

		board.addEventListener('mousemove', movePlayer);
		document.addEventListener('keydown', controller);

	}

	return {
		create: create,
		getPlayerLocations: getPlayerLocations,
		doubleSizeMe: doubleSizeMe,
		gameOver: gameOver
	}
}