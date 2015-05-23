
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
					 {name:'hulk', duration: 5},
					 {name:'capt-arr',duration: 14},
					 {name:'black', action:['createSparks','playBlackVid'], duration: 10},
					 {name:'iron-thor', action:['lightning'], duration: 18},
					 {name: 'closer', action:['decVol'], duration: 1}];

var sceneTimer = 10 * 1000;
var playIndex;
var forceStop = false;
var blackVideo = document.getElementById('blackBgVideo');
var canvas = document.getElementById('lightning');
var context = canvas.getContext('2d');
var lightningOver = false;

function strike (shine) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	if($('.iron-thor').hasClass('animate-out'))
	{
		return;
	}
	
	context.lineWidth = 2;
	var mode = shine;
	if(shine) {
		context.beginPath();
		context.moveTo(20, 150);
		context.lineTo(30, 140);
		context.lineTo(20, 135);
		context.lineTo(40, 130);
		context.lineTo(50, 120);
		context.lineTo(55, 125);
		context.lineTo(65, 115);
		context.strokeStyle = 'rgba(250,249,247, .7)';
		context.stroke();

		context.beginPath();
		context.moveTo(80, 140);
		context.lineTo(75, 135);
		context.lineTo(83, 125);
		context.lineTo(75, 110);
		context.lineTo(80, 105);
		context.lineTo(73, 100);
		context.lineTo(90, 97);
		context.strokeStyle = 'rgba(250,249,247, .7)';
		context.stroke();
	}else{
		context.beginPath();
		context.moveTo(30, 150);
		context.lineTo(20, 140);
		context.lineTo(30, 135);
		context.lineTo(50, 130);
		context.lineTo(40, 120);
		context.lineTo(45, 125);
		context.lineTo(55, 115);
		context.strokeStyle = 'rgba(250,249,247, .7)';
		context.stroke();

		context.beginPath();
		context.moveTo(70, 140);
		context.lineTo(85, 135);
		context.lineTo(73, 125);
		context.lineTo(85, 110);
		context.lineTo(70, 105);
		context.lineTo(83, 100);
		context.lineTo(90, 97);
		context.strokeStyle = 'rgba(250,249,247, .7)';
		context.stroke();
	}
	setTimeout(function () {strike(mode ? false : true );},20);
}

function lightning () {
	setTimeout(strike,11000);
}

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
	$('.g.btn').on('click', function () {
		clip(true);
	});

	
});

