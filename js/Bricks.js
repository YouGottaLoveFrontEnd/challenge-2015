var Bricks = function () {

	var bricksData;
	var bricksList;
	var board;
	var boundries = {};
	var message;
	var player;
	var addBrickTimer;
	var brickIndex = 0;

	function addBrick() {
		var brick = new SingleBrick();
		brick.create(bricksData[brickIndex], boundries, message, player);
		bricksList.push(brick);
		board.appendChild(brick.getElem());
		brickIndex++;
		addBrickTimer = setTimeout(addBrick , 4000);
		if(brickIndex === 3 ) {
			message(2);
		}
	}

	function init (bricksArr, boardId, _message, _player) {
		message =_message;
		bricksData = bricksArr;
		bricksList = [];
		board = document.getElementById(boardId);
		
		boundries.x = 0;
		boundries.y = 0;
		boundries.width = board.offsetWidth;
		boundries.height = board.offsetHeight;

		player = _player;

		addBrick();
		
	}

	function killAll () {
		clearTimeout(addBrickTimer);
		bricksList.forEach(function (elem) {
			elem.kill();
		});
	}

	return {
		init: init,
		killAll: killAll
	}
}