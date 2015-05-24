var Message = function () {
	var messageData = {
		0: 'Game is about to start, press [A] [D] to move',
		1: 'Game Over! Better Luck next time',
		2: 'Press the letter [S] to increase player width',
		3: ''
	};

	var isInited = false;
	var elem = document.createElement('div');
	var id = 'message';
	function create () {
		elem.id = id;
		elem.style.position = 'absolute';
		elem.style.top = '-88px';
		elem.style.left = '0px';
		elem.style.width = 'calc(100% - 20px)';
		elem.style.height = '60px';
		elem.style.textAlign = 'center';
		elem.style.fontSize = '20px';
		elem.style.lineHeight = '24px';
		elem.style.backgroundColor = '#fbfaf8';
		elem.style.border = '1px solid #1eb1d2';
		elem.style.borderBottom = 'transparent';
		elem.style.borderRadius = '10px 10px 0 0';
		elem.style.padding = '10px';
		elem.style.fontFamily = 'Futura-pt, Arial';


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