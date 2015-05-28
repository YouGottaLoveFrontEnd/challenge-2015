var SoundManager = function (){
	var type = {
		1: 'bounce',
		2: 'gameOver',
		3: 'player',
		4: 'win'
	}

	var sound = {
		player: new Audio('audio/hitPlayer.wav'),
		bounce: new Audio('audio/bounce.wav'), 
		gameOver: new Audio('audio/gameOver.wav') ,
		win: new Audio('audio/applause3.mp3') 
	}
	

	function play(selected) {
		sound[type[selected]].play();
	}

	return {
		play: play
	}
}