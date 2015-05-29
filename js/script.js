
var sound = document.getElementById("track");

function createSparks () {
	var numOfSparks = 50;
	var i = 0;
	while ( i < numOfSparks) {
		var spark = new Spark();
		spark.add('.black');
		i++;
	}
}

var charectersArr = [{name: 'intro', duration: 12},
					 {name:'hulk', duration: 6},
					 {name:'capt-arr',duration: 14},
					 {name:'black', action:['createSparks','playBlackVid'], duration: 10},
					 {name:'iron-thor', duration: 18},
					 {name: 'closer', action:['decVol'], duration: .01}];

var sceneTimer = 10 * 1000;
var playIndex;
var forceStop = false;
var blackVideo = document.getElementById('blackBgVideo');

function playBlackVid () {
	
	if($('.black-video').hasClass('is-playing')) {
		blackVideo.pause();
		blackVideo.currentTime = 10;
		$('.black-video').removeClass('is-playing')
		$('.fire-spark').remove();
	}else{
		blackVideo.currentTime = 10;
		blackVideo.playbackRate = 1.5;
		blackVideo.play();
		$('.black-video').addClass('is-playing')
	}
}

function animateOut () {
	if($('.black-video').hasClass('is-playing')) {
		setTimeout(playBlackVid,1900);
	}
	
	$('.animate-in').removeClass('animate-in').addClass('animate-out');
	playIndex++;
	setTimeout(animateIn,2000);
}

function animateIn() {
	$('.play').removeClass('play');
	$('.animate-out').removeClass('animate-out');
	if(playIndex === charectersArr.length || forceStop) {
		
		$('.charecters').removeClass('show');
		$('#billboard').show();
		setTimeout(function() {
			sound.pause();
			sound.currentTime = 0;
		},500);
		return;
	}
	$('.'+charectersArr[playIndex].name).addClass('play').addClass('animate-in');
	if(charectersArr[playIndex].action) {
		charectersArr[playIndex].action.forEach(function (fnc) {
			window[fnc]();
		});
	}
	setTimeout(animateOut,charectersArr[playIndex].duration * 1000);
}

function incVol () {
	if(sound.volume === 0.7) {
		return;
	}

	sound.volume += 0.1;
	setTimeout(incVol, 150);
}

function decVol () {
	if(sound.volume <= 0.2) {
		sound.volume = 0.1;
		return;
	}

	sound.volume -= 0.1;
	setTimeout(decVol, 150);
}

function clip(play) {
	if(play) {
		$('#billboard').hide();
		sound.volume = 0.1;
		incVol();
		sound.play();
		playIndex = 0;
		$('.charecters').addClass('show');
		animateIn(0);
	}else{ 
		animateOut();
	}
	
}

$(document).ready(function () {

	$('#loader-wrapper').hide();
	$('.wrapper').show();
	$('.g.btn').on('click', function () {
		clip(true);
	});

	new ChasingItem().capture('chase1', 'billboard');
	new ChasingItem().capture('chase2', 'billboard');
	new ChasingItem().capture('chase3', 'billboard');
	
	$('.game-start-btn').on('click', function () {
		new Game().init();
	});
});

