'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var intro = {};

    intro.loaded = false;

    intro.speakers = [{
        name: 'Alex Wolkov',
        src: 'alex_wolkov.jpg'
    }, {
        name: 'Alexander Kotliarskyi',
        src: 'alexander_kotliarskyi.jpg'
    }, {
        name: 'Benjamin Gruenbaum',
        src: 'benjamin_gruenbaum.jpg'
    }, {
        name: 'Douglas Crockford',
        src: 'Douglas_Crockford_February_2013.jpg'
    }, {
        name: 'Efim Dimenstein',
        src: 'efim-dimenstein.jpg'
    }, {
        name: 'Eran Zinman',
        src: 'eran-z.jpg'
    }, {
        name: 'Gil Tayar',
        src: 'gil_tayar.jpg'
    }, {
        name: 'Igal Steklov',
        src: 'igal.jpg'
    }, {
        name: 'Itai Chejanovsky',
        src: 'itai-chejanovsky.jpg'
    }, {
        name: 'Lea Verou',
        src: 'lea_verou.jpg'
    }, {
        name: 'Martin Kleppe',
        src: 'Martin_Kleppe_Square.jpg'
    }, {
        name: 'Matthieu Mayran',
        src: 'matthieu-mayran.jpg'
    }, {
        name: 'Or Hiltch',
        src: 'or-h.jpg'
    }, {
        name: 'Serge Krul',
        src: 'serge_krul.jpg'
    }, {
        name: 'Sergey Bolshchikov',
        src: 'sergey_bolshchikov.jpg'
    }, {
        name: 'Tal Mozes',
        src: 'tal-mozes.jpg'
    }, {
        name: 'Vladimir Grinenko',
        src: 'vladimir.jpg'
    }, {
        name: 'Yelena Jetpyspayeva',
        src: 'yelena.jpg'
    }];

    var isLoaded = function() {
        var isLoaded = true;
        intro.speakers.forEach(function(speaker) {
            if (!speaker.loaded) isLoaded = false;
        })
        return isLoaded;
    }

    intro.preload = function() {

        intro.audio = new Audio();
        intro.audio.src = 'sounds/Jamie_xx-Far_Nearer.mp3';
        intro.audio.load();

        yglf.utils.shuffle(intro.speakers).forEach(function(speaker) {
            speaker.image = new Image();
            speaker.image.addEventListener('load', function() {
                speaker.loaded = true;
            });
            speaker.image.src = 'speakers/' + speaker.src;
        });

        intro.movieClip = new createjs.MovieClip(null, 0, false);
        yglf.logoContainer.addChildAt(intro.movieClip, 0);

    }

    intro.ready = function() {

        var time = 25;
        var sleep = 100;

        intro.speakers.forEach(function(speaker, index) {

            speaker.title = new createjs.Text();
            speaker.title.font = '300 36px futura-pt';
            speaker.title.color = '#FFF';
            speaker.title.text = speaker.name;
            speaker.title.y = yglf._logoHeight + (speaker.title.getMeasuredHeight() / 2);
            speaker.title.x = (yglf._logoWidth - speaker.title.getMeasuredWidth()) / 2;

            var titleTween = createjs.Tween.get(speaker.title);
            titleTween.to({
                    alpha: 0
                })
                .wait(sleep * index)
                .to({
                    alpha: 1
                }, time)
                .wait(sleep - time)
                .to({
                    alpha: 0
                }, time);

            intro.movieClip.timeline.addTween(titleTween);

            speaker.bitmap = new createjs.Bitmap(speaker.image);

            // var Grayscale = new createjs.ColorMatrixFilter([
            //     0.30, 0.30, 0.30, 0, 0, // red component
            //     0.30, 0.30, 0.30, 0, 0, // green component
            //     0.30, 0.30, 0.30, 0, 0, // blue component
            //     0, 0, 0, 1, 0 // alpha
            // ]);
            // speaker.bitmap.filters = [Grayscale];

            speaker.bitmap.cache(0, 0, speaker.image.width, speaker.image.height);

            var tween = createjs.Tween.get(speaker.bitmap).to({
                    alpha: 0
                })
                .wait(sleep * index)
                .to({
                    alpha: 0.5
                }, time)
                .wait(sleep - time)
                .to({
                    alpha: 0
                }, time);

            intro.movieClip.timeline.addTween(tween);

        });

    }

    var _starrted = false;

    var animateLatters = function() {
        
        yglf.utils.showLetters();
        yglf.fireworks.start();
    }
    
    intro.progress = function() {

        console.log(intro.audio.currentTime);

        if (intro.audio.currentTime > 31) {
            if(!_starrted) animateLatters();
            _starrted = true;
        };


    }

    intro.start = function() {
        intro.ready();
        intro.audio.currentTime = 30;
        intro.audio.play();
        intro.movieClip.gotoAndPlay(0);
        yglf.utils.hideLetters();
        createjs.Ticker.addEventListener('tick', yglf.stage);
        intro.audio.addEventListener('timeupdate', intro.progress);
        intro.audio.addEventListener('ended', yglf.stop);
    }

    intro.timeUpdateHandler = function(e) {
        console.log(intro.video.currentTime);
    }

    intro.stop = function() {
        intro.audio.pause();
        intro.movieClip.gotoAndStop(0);
        yglf.utils.showLetters();
        createjs.Ticker.removeEventListener('tick', yglf.stage);
    }


    yglf.intro = intro;

})(yglf, createjs);
