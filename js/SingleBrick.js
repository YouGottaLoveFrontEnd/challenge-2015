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
	var checkHitTimeout = 10;
	var soundManager;

	function lookForHit () {
		var currentY = parseInt(elemStyle.top) + parseInt(elemStyle.height);
		var currentX = parseInt(elemStyle.left);
		
		playerLocation = player.getPlayerLocations();
		if(currentY >= playerLocation.y) {
			if(currentX >= playerLocation.x && currentX <= playerLocation.x + playerLocation.width) {
				if(currentX <= playerLocation.x + 30 ){
					flyToXDirection = -1;
				}else if(currentX >= playerLocation.x + playerLocation.width - 30) {
					flyToXDirection = 1;
				}
				flyToYDirection = flyToYDirection * -1;
				soundManager.play(3);
				elemStyle.top = parseInt(elemStyle.top) + (speed * flyToYDirection) + 'px';
				elemStyle.left = parseInt(elemStyle.left) + (speed * flyToXDirection) + 'px';
			}
		}
		
		checkHitTimeout = setTimeout(lookForHit, 10);
	}

	function fly() {

		var newY = parseInt(elemStyle.top) + (speed * flyToYDirection);
		var newX = parseInt(elemStyle.left) + (speed * flyToXDirection);
		if( newY <= 0) {
			flyToYDirection = flyToYDirection * -1;
			newY = parseInt(elemStyle.top) + (speed * flyToYDirection);
		}
		if(newX <=0 || newX >= boundries.width) {
			flyToXDirection = flyToXDirection * -1;
		}

		if(newX <= 0) {
			newX = speed * flyToXDirection;
		}

		if(newX >= boundries.width) {
			newX = (boundries.width - 13) + (speed * flyToXDirection);
		}
		
		var percentage = newY / (boundries.height / 2);
		elemStyle.backgroundColor = 'rgba(255, 255, 255, '+ percentage +')';
		elemStyle.top = newY + 'px';
		elemStyle.left = newX + 'px';
		if(newY > (playerLocation.y + playerLocation.height) && (newX < playerLocation.x || newX > (playerLocation.x + playerLocation.width))) {
			kill();
			message(1);
			return;
		}else {
			flyTimeout = setTimeout(fly, 100);
		}
	}

	function create (content, _boundries, _message, _player, _soundManager, _defaultSpeed) {
		speed = _defaultSpeed;
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
		elemStyle.pointerEvents= 'none';
		elemStyle.top = Math.floor(Math.random() * (boundries.height /2)) + 'px';
		elemStyle.left = Math.floor(Math.random() * (boundries.width -16)) + 'px';
		elemStyle.transition = 'left .1s linear top .1s linear';
		elem.innerHTML = content.innerHTML;
		player = _player;
		soundManager = _soundManager;
		lookForHit();
		fly();

	}

	function changeSpeed () {
		speed = speed === 10 ? 1 : 10;
	}

	function getElem () {
		return elem;
	}

	function kill () {
		
		clearTimeout(flyTimeout);
		clearTimeout(checkHitTimeout);
	}

	return {
		create: create,
		kill: kill,
		getElem: getElem,
		changeSpeed: changeSpeed
	}
}