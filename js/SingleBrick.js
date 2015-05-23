var SingleBrick = function () {

	var elem = document.createElement('div');
	var elemStyle = elem.style;
	var boundries;
	var flyToYDirection = -1;
	var flyToXDirection = (Math.random() * 3 ) -1 > 0 ? 1 : -1;
	var speed = 10;
	var ballSize = 25;
	var flyTimeout;
	var message;
	var player; 
	var playerLocation;

	function fly() {
		var newY = parseInt(elemStyle.top) + (speed * flyToYDirection);
		var newX = parseInt(elemStyle.left) + (speed * flyToXDirection);
		playerLocation = player.getPlayerLocations();

		if( newY <= 0) {
			flyToYDirection = flyToYDirection * -1;
			newY = parseInt(elemStyle.top) + (speed * flyToYDirection);
		}

		if(newX <=0 || newX >= boundries.width - ballSize) {
			flyToXDirection = flyToXDirection * -1;
			newX = parseInt(elemStyle.left) + (speed * flyToXDirection);
		}

		if(newY >= playerLocation.y - playerLocation.height - ballSize) {
			if(newX >= playerLocation.x + 5 && newX <= playerLocation.x + playerLocation.width - 5) {
				if(newX <= playerLocation.x + 30 ){
					flyToXDirection = -1;
					newX = parseInt(elemStyle.left) + (speed * flyToXDirection);
				}else if(newX >= playerLocation.x + playerLocation.width - 30) {
					flyToXDirection = 1;
					newX = parseInt(elemStyle.left) + (speed * flyToXDirection);
				}

				flyToYDirection = flyToYDirection * -1;
				newY = parseInt(elemStyle.top) + (speed * flyToYDirection);
			}
		}

		if(newY > playerLocation.y - playerLocation.height) {
			message(1);
			return;
		}
		var percentage = newY / (boundries.height / 2);
		elemStyle.backgroundColor = 'rgba(255, 255, 255, '+ percentage +')';
		elemStyle.top = newY + 'px';
		elemStyle.left = newX + 'px';

		flyTimeout = setTimeout(fly, 100);

	}

	function create (content, _boundries, _message, _player) {
		message = _message;
		boundries = _boundries;
		elemStyle.width = ballSize + 'px';
		elemStyle.height = ballSize + 'px';
		elemStyle.position = 'absolute';
		elemStyle.backgroundColor = '#ffffff';
		elemStyle.color = '#ffffff';
		elemStyle.fontFamily = 'Futura-pt, Arial';
		elemStyle.lineHeight = '25px';
		elemStyle.textAlign = 'center';
		elemStyle.borderRadius = '50%';
		elemStyle.top = Math.floor(Math.random() * (boundries.height /2)) + 'px';
		elemStyle.left = Math.floor(Math.random() * (boundries.width -16)) + 'px';
		elemStyle.transition = 'left .1s linear top .1s linear';
		elem.innerHTML = content.innerHTML;
		player = _player;

		fly();
		
	}

	function getElem () {
		return elem;
	}

	function kill () {
		clearTimeout(flyTimeout);
	}

	return {
		create: create,
		kill: kill,
		getElem: getElem
	}
}