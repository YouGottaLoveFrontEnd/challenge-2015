var SoundManager = function (){
	var type = {
		1: 'bounce',
		2: 'gameOver',
		3: 'player'
	}

	var sound = {
		player: new Audio('audio/hitPlayer.wav'),
		bounce: new Audio('audio/bounce.wav'), 
		gameOver: new Audio('audio/gameOver.wav') 
	}
	

	function play(selected) {
		sound[type[selected]].play();
	}

	return {
		play: play
	}
}