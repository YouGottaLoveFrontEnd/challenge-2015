var Game = function () {
	var board = document.createElement('div');
	var boardId = 'board';
	var inited = false;
	var bricksManager;
	var player;
	var messageData;
	var messenger;

	function addPlayer() {
		player = new Player();
		player.create(boardId);
	}

	function clearBoard () {
		inited = false;
		board.parentNode.removeChild(board);
	}

	function message (data) {
		switch(data) {
			case 1:
				bricksManager.killAll();
				setTimeout(clearBoard , 1000);
			break;
			case 2:
				
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

		addPlayer();

		bricksManager = new Bricks();
		bricksManager.init(document.getElementsByClassName('letter'), boardId, message, player);

		messenger = new Message();
		messageData = messenger.data;
		board.appendChild(messenger.create());

	}

	return {
		init: init
	}

}