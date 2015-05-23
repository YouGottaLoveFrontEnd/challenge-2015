var Message = function () {
	var messageData = {
		1: 'Game Over! Better Luck next time',
		2: 'Speed Hint: Press the letter S to increase player width'
	};

	var isInited = false;
	var elem = document.createElement('div');
	var id = 'message';
	function create () {
		elem.id = id;
		elem.style.position = 'absolute';
		elem.style.top = '-30px';
		elem.style.left = '0px';
		elem.style.width = '100%';
		elem.style.textAlign = 'center';
		elem.style.fontSize = '16px';
		elem.style.lineHeight = '20px';
		elem.style.backgroundColor = '#fbfaf8';
		elem.style.border = '1px solid #fffaf8';

		return elem;
	}

	function send (messageType) {
		document.getElementById(id).innerHTML = messageData[messageType];
	}

	return {
		data: messageData,
		send: send,
		create: create
	}

}