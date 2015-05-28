var Message = function () {
	var messageData = {
		0: 'Game is about to start, press <span class="big">[A]</span> <span class="big">[D]</span> to move',
		1: '<span class="big">Game Over!</span> Better Luck next time :)',
		2: 'I dare you not to press <span class="big">[S]</span>.',
		3: '',
		4: 'Seriously? you did it?'
	};

	var isInited = false;
	var elem = document.createElement('div');
	var id = 'message';
	function create () {
		elem.id = id;
		elem.style.position = 'absolute';
		elem.style.bottom = '-100px';
		elem.style.left = '0px';
		elem.style.width = 'calc(100% - 20px)';
		elem.style.height = '60px';
		elem.style.textAlign = 'center';
		elem.style.fontSize = '20px';
		elem.style.lineHeight = '24px';
		elem.style.backgroundColor = '#fbfaf8';
		elem.style.border = '1px solid #1eb1d2';
		elem.style.borderRadius = '5px';
		elem.style.padding = '10px';
		elem.style.color = 'rgba(0,0,0,0.5)';
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