var Game = function () {
	var board = document.createElement('div');
	var boardId = 'board';
	var inited = false;
	var bricksManager;
	var player;
	var messageData;
	var messenger;
	var soundManager = new SoundManager();

	function addPlayer() {
		player = new Player();
		player.create(boardId, message);
	}

	function clearBoard () {
		if(!inited) {
			return;
		}
		inited = false;
		board.parentNode.removeChild(board);
	}

	function message (data) {
		switch(data) {
			case 1:
				bricksManager.killAll(false);
				player.gameOver();
				setTimeout(clearBoard , 2500);
			break;
			case 4:
				player.gameOver();
				bricksManager.killAll(true);
				setTimeout(clearBoard , 2500);
			break;
			case 5:
			case 6:
				player.doubleSizeMe();
			break;
			case 8:
			case 7:
				bricksManager.changeSpeed();
			break;
			
		}
		new Message().send(data);
	}

	function init() {
		if(inited) {
			return;
		}
		inited = true;
		board.className = 'container';
		board.id = boardId;
		board.style.background = 'rgba(0,0,0,.5)';
		board.style.zIndex = 999999999;
		document.getElementsByTagName('body')[0].appendChild(board);

		
		
		setTimeout(function () {
			bricksManager = new Bricks();
			bricksManager.init(document.getElementsByClassName('letter'), boardId, message, player, soundManager);

		},1500);
		
		messenger = new Message();
		messageData = messenger.data;
		board.appendChild(messenger.create());
		message(0);

		addPlayer();

	}

	return {
		init: init
	}

}