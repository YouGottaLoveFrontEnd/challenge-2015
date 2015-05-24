var Player = function () {
	var board;

	var player = document.createElement('div');
	var playerStyle = player.style;
	var speed = 50;
	var playerWidth = 50;
	var creationTimer = 200;
	var stopScale = false;
	
	var arrows = {
		97: 'left',
		100: 'right',
		115: 'speed'
	}

	var onTheMove = false;
	var movementDirection;
	var moveTimeout;

	function movePlayer() {
		 var newLeft = parseInt(playerStyle.left) + (movementDirection * speed);
		if(newLeft <= 0) {
			playerStyle.left = '0px';
			return;
		}

		if(newLeft >= board.offsetWidth - parseInt(playerStyle.width) - 16) {
			playerStyle.left = board.offsetWidth - parseInt(playerStyle.width) - 16  +'px';
			return;
		}
		playerStyle.left = newLeft +'px';
		moveTimeout = setTimeout(movePlayer, creationTimer);
	}

	function setPlayerWidth () {
		playerStyle.width = playerWidth + 'px';
		var changeToLeft = parseInt(playerStyle.left) - 10;
		if(changeToLeft <= 0) {
			changeToLeft = 0;
		}
		playerStyle.left = changeToLeft + 'px';
		if(playerWidth + parseInt(playerStyle.left) > board.offsetWidth - 16) {
			playerStyle.left = board.offsetWidth - parseInt(playerStyle.width) - 16 + 'px';
		}
	}

	function controller(e) {
		if(arrows[e.keyCode]) {
			switch(arrows[e.keyCode]) {
				case 'right':
					movementDirection = 1;
					if(!onTheMove){
						onTheMove = true;
						movePlayer();
					}
				break;
				case 'left':
					movementDirection = -1;
					if(!onTheMove){
						onTheMove = true;
						movePlayer();
					}
				break;
				case 'speed':
					if(stopScale) {
						return;
					}
					playerWidth += 20;
					if(playerWidth >= 350) {
						playerWidth = 350;
						stopScale = true;
					}
					setPlayerWidth();
				break;
			}
		}
	}

	function controllerDone(e) {
		clearTimeout(moveTimeout);
		onTheMove = false;
	}

	function getPlayerLocations () {
		return {
			x: parseInt(playerStyle.left),
			y: board.offsetHeight - parseInt(playerStyle.bottom),
			width: parseInt(playerStyle.width),
			height: parseInt(playerStyle.height)
		}
	}

	function create(boardId) {
		board = document.getElementById(boardId);
		setPlayerWidth();
		playerStyle.height = '15px';
		playerStyle.backgroundColor = '#ff0000';
		playerStyle.bottom = '10px';
		playerStyle.position = 'absolute';
		playerStyle.left = Math.floor(Math.random() * (board.offsetWidth - 16 - playerWidth)) + 'px';
		playerStyle.transition = 'left .2s linear';
		player.id = 'player';
		board.appendChild(player);

		document.addEventListener('keypress', controller);
		document.addEventListener('keyup', controllerDone);
	}

	return {
		create: create,
		getPlayerLocations: getPlayerLocations
	}
}