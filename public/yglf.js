'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var customAnimation = {};

    var Ease = createjs.Ease;

    var easeProvider = [{
        type: Ease.backIn
    }, {
        type: Ease.backInOut
    }, {
        type: Ease.backOut
    }, {
        type: Ease.bounceIn
    }, {
        type: Ease.bounceInOut
    }, {
        type: Ease.bounceOut
    }, {
        type: Ease.circIn
    }, {
        type: Ease.circInOut
    }, {
        type: Ease.circOut
    }, {
        type: Ease.cubicIn
    }, {
        type: Ease.cubicInOut
    }, {
        type: Ease.cubicOut
    }, {
        type: Ease.elasticIn
    }, {
        type: Ease.elasticInOut
    }, {
        type: Ease.elasticOut
    }, {
        type: Ease.linear
    }, {
        type: Ease.quadIn
    }, {
        type: Ease.quadInOut
    }, {
        type: Ease.quadOut
    }, {
        type: Ease.quartIn
    }, {
        type: Ease.quartInOut
    }, {
        type: Ease.quartOut
    }, {
        type: Ease.quintIn
    }, {
        type: Ease.quintInOut
    }, {
        type: Ease.quintOut
    }, {
        type: Ease.sineIn
    }, {
        type: Ease.sineInOut
    }, {
        type: Ease.sineOut
    }, {
        type: Ease.getBackIn(2.5)
    }, {
        type: Ease.getBackInOut(2.5)
    }, {
        type: Ease.getBackOut(2.5)
    }, {
        type: Ease.getElasticIn(2, 5)
    }, {
        type: Ease.getElasticInOut(2, 5)
    }, {
        type: Ease.getElasticOut(2, 5)
    }, {
        type: Ease.getPowIn(2.5)
    }, {
        type: Ease.getPowInOut(20.5)
    }, {
        type: Ease.getPowOut(2.5)
    }];

    var movieClip;

    customAnimation.start = function() {

    	if (movieClip == null) {
	        movieClip = new createjs.MovieClip(null, 0, false);
	        yglf.logoContainer.addChild(movieClip);
    	};

        var getCustomEase = function() {
            var index = yglf.utils.random(0, (easeProvider.length - 1));
            var ease = easeProvider[index].type;
            return ease;
        }

        var easeOut = getCustomEase();
        var easeIn = getCustomEase();


        yglf.letters.forEach(function(letter, index) {

            var positionFrom = letter.pos

            yglf.utils.setRandomPosition(letter);

            var positionTo = {
                x: letter.textObject.x,
                y: letter.textObject.y
            };

            console.log(positionFrom);
            console.log(positionTo);

            if (!letter.tween) {
                var tween = createjs.Tween.get(letter.textObject);
                tween
                    .to(positionFrom)
                    .to(positionTo, 30, easeOut)
                    .to(positionFrom, 180, easeIn)
                letter.tween = tween;
                movieClip.timeline.addTween(tween);
            } else {
                createjs.Tween.get(letter.textObject, {
                        override: true
                    })
                    .to(positionFrom)
                    .to(positionTo, 1000, easeOut)
                    .to(positionFrom, 2000, easeIn)
            }

        });

        createjs.Ticker.addEventListener('tick', yglf.stage);

        movieClip.play();

    }

    customAnimation.stop = function() {

        createjs.Ticker.removeEventListener('tick', yglf.stage);
        
    }



    yglf.customAnimation = customAnimation;

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var fireworks = {};

    var audio = new Audio();
    audio.src = 'sounds/fireworks.mp3';
    audio.load();
    audio.loop = true;
    fireworks.audio = audio;
    
    var imgSeq = new Image();
    var bmpAnim;
    var fireworksContainer;
    var motionLength = 5;
    var addSpark1 = 3;
    var addSpark2 = 100;
    var addSparkX = 7;

    fireworks.start = function() {

        fireworksContainer = new createjs.Container();
        yglf.stage.addChild(fireworksContainer);
        var data = {
            images: ['fireworks.png'],
            frames: {
                width: 21,
                height: 23,
                regX: 10,
                regY: 11
            }
        };
        bmpAnim = new createjs.Sprite(new createjs.SpriteSheet(data));
        createjs.Ticker.addEventListener('tick', fireworks.tick);
        for (var i = 0; i < motionLength; i++) {
            setTimeout(fireworks.motionSet, 10000 * Math.random() + 1000);
        }
        
        audio.play();

    }

    fireworks.motionSet = function() {
        var posX = window.innerWidth * Math.random();
        var posY = window.innerHeight;
        var endY = window.innerHeight * Math.random() - 200;
        var addX = Math.cos(Math.PI * Math.random()) * addSparkX;
        var speed = Math.random() * 50 + 10;
        fireworks.motion(posX, posY, endY, speed, addX);
    }

    fireworks.motion = function(posX, posY, endY, speed, addX) {
        fireworks.addSparkles(addSpark1, posX, posY, 1);
        posY -= speed;
        posX += addX;
        if (posY > endY) {
            setTimeout(function() {
                fireworks.motion(posX, posY, endY, speed, addX)
            }, 50);
        } else {
            fireworks.addSparkles(addSpark2 * Math.random() + 100, posX, posY, 2);
            setTimeout(fireworks.motionSet, 10000 * Math.random() + 1000);
        }
    }

    fireworks.tick = function(event) {
        var l = fireworksContainer.getNumChildren();
        for (var i = l - 1; i > 0; i--) {
            var sparkle = fireworksContainer.getChildAt(i);
            sparkle.vY += 1;
            sparkle.vX *= 0.98;
            sparkle.x += sparkle.vX;
            sparkle.y += sparkle.vY;
            sparkle.scaleX = sparkle.scaleY = sparkle.scaleX + sparkle.vS;
            sparkle.alpha += sparkle.vA;
            if (sparkle.alpha <= 0 || sparkle.y > yglf.canvas.height || sparkle.y < -200) {
                fireworksContainer.removeChildAt(i);
            }
        }
        yglf.stage.update(event);
    }

    fireworks.addSparkles = function(count, x, y, speed) {
        for (var i = 0; i < count; i++) {
            var sparkle = bmpAnim.clone();
            sparkle.x = x;
            sparkle.y = y;
            sparkle.alpha = Math.random() * 0.5 + 0.5;
            sparkle.scaleX = sparkle.scaleY = Math.random() + 0.3;
            var a = Math.PI * 2 * Math.random();
            var v = (Math.random() - 0.5) * 30 * speed;
            sparkle.vX = Math.cos(a) * v;
            sparkle.vY = Math.sin(a) * v;
            sparkle.vS = (Math.random() - 0.5) * 0.2;
            sparkle.vA = -Math.random() * 0.05 - 0.01;
            sparkle.gotoAndPlay(Math.random() * sparkle.spriteSheet.getNumFrames() | 0);
            fireworksContainer.addChild(sparkle);
        }
    }

    fireworks.stop = function () {
        yglf.stage.removeChild(fireworksContainer);
        createjs.Ticker.removeEventListener('tick', fireworks.tick);
        audio.pause();
    }

    yglf.fireworks = fireworks;

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var game = {};

    game.started = false;
    game.lettersInHole = 0;

    game.addHoles = function() {
        yglf.letters.forEach(function(letter) {
            var hole = new createjs.Shape();
            hole.graphics.beginFill('rgba(255,255,255,0.2)').drawCircle(0, 0, 40);
            hole.x = 25;
            hole.y = 45;
            letter.hole = hole;

            var ball = new createjs.Shape();
            ball.graphics.beginRadialGradientFill(["rgba(255,255,255,1)", 'rgba(220,220,220,1)'], [0, 1], -15, -15, 0, 0, 0, 30).drawCircle(0, 0, 30)
            letter.ball = ball;

            letter.textContainer.addChildAt(hole, 0);
            letter.textContainer.addChildAt(ball, 1);
            letter.textObject.y -= 100;
        });
    }

    var step;
    var currentTextObject;
    var currentHole;
    var currentBall;
    var currentTextObjectWidth;
    var relativeX;
    var relativeY;


    var cancelCurrent = function() {
        currentHole.visible =
            currentBall.visible = false;
        currentTextObject.visible = true;
        currentTextObject.x = currentTextObject.y = 0;
        currentTextObject.font = '300 ' + yglf._fontsize + 'px futura-pt';
        currentTextObject.updateCache();

    }

    var handleMotion = function (event) {
        if (!currentTextObject) return;
        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        var z = event.accelerationIncludingGravity.z;

        var currentX = currentTextObject.x;
        var currentY = currentTextObject.y;

        switch (yglf.orientation) {
            case 0:
                if (yglf.utils.isAndroid) {
                    currentX -= x * step;
                    currentY += y * step;
                } else {
                    currentX += x * step;
                    currentY -= y * step;
                }
                break;
            case -90:
                if (yglf.utils.isAndroid) {
                    currentY -= x * step;
                    currentX -= y * step;
                } else {
                    currentY += x * step;
                    currentX += y * step;
                }
                break;
            case 90:
                if (yglf.utils.isAndroid) {
                    currentY += x * step;
                    currentX += y * step;
                } else {
                    currentY -= x * step;
                    currentX -= y * step;
                }
                break;
        }


        if (currentX < -(relativeX)) {
            currentX = relativeX * -1;
        };


        if (currentY < -(relativeY)) {
            currentY = relativeY * -1;
        };

        if (currentX > (window.innerWidth * window.devicePixelRatio)) {
            currentX = window.innerWidth * window.devicePixelRatio;
        };

        if (currentY > (window.innerHeight * window.devicePixelRatio)) {
            currentY = window.innerHeight * window.devicePixelRatio;
        };

        currentTextObject.x = currentX;
        currentTextObject.y = currentY;

        currentBall.x = currentX + currentTextObjectWidth - 10;
        currentBall.y = currentY + 23;

        var diff = 20;

        if ((currentTextObject.y < diff && currentTextObject.y > -(diff)) && (currentTextObject.x < diff && currentTextObject.x > -(diff))) {

            cancelCurrent();

            window.removeEventListener('devicemotion', handleMotion, true);

            game.lettersInHole++;

            if (game.lettersInHole === yglf.letters.length) {
                game.win();
            } else {
                game.startPlayWithLetter(game.lettersInHole);
            }
        };

    }

    game.startPlayWithLetter = function(index) {

        var letter = yglf.letters[index];
        currentTextObject = letter.textObject;
        currentHole = letter.hole;
        currentBall = letter.ball;
        relativeX = yglf.logoContainer.x + letter.textContainer.x;
        relativeY = yglf.logoContainer.y + letter.textContainer.y;

        letter.textContainer.visible = true;
        currentTextObject.visable = false;
        currentTextObject.font = '300 ' + (yglf._fontsize / 2) + 'px futura-pt';
        currentTextObject.updateCache();

        currentTextObjectWidth = currentTextObject.getMeasuredWidth();

        yglf.utils.setRandomPosition(letter);

        step = yglf.utils.isAndroid ? 5 : 10

        window.addEventListener('devicemotion', handleMotion, true);

    }

    var playFireworksSound = function() {

        yglf.fireworks.audio.play();

    }

    game.win = function() {

        yglf.fireworks.start();

        yglf.stage.addEventListener('click', playFireworksSound);

    }

    game.start = function() {
        
        if (game.started) return;
        
        game.started = true;

        game.addHoles();

        yglf.utils.hideLetters();

        game.lettersInHole = 0;

        game.startPlayWithLetter(game.lettersInHole);

        createjs.Ticker.addEventListener('tick', yglf.stage);

    }

    game.stop = function() {

        if (!game.started) return;
        
        game.started = false;

        yglf.letters.forEach(function(letter) {
            letter.textContainer.removeChild(letter.hole);
            letter.textContainer.removeChild(letter.ball);
        });

        yglf.utils.showLetters();

        yglf.fireworks.stop();
        
        if(currentTextObject != null) cancelCurrent();

        window.removeEventListener('devicemotion', handleMotion, true);

        createjs.Ticker.removeEventListener('tick', yglf.stage);
        yglf.stage.removeEventListener('click', playFireworksSound);

    }


    yglf.game = game;


})(yglf, createjs);

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
        intro.audio.currentTime = 0;
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

'use strict';



var yglf = yglf || {};


(function(yglf) {

    yglf.letters = [{
        value: 'Y',
        audio: 'a.wav',
        pos: {
            x: 0,
            y: 0
        }
    }, {
        value: 'O',
        audio: 'b.wav',
        pos: {
            x: 61,
            y: 0
        }
    }, {
        value: 'U',
        audio: 'bb.wav',
        pos: {
            x: 137,
            y: 0
        }
    }, {
        value: 'G',
        audio: 'c.wav',
        pos: {
            x: -9,
            y: 99
        }
    }, {
        value: 'O',
        audio: 'c1.wav',
        pos: {
            x: 61,
            y: 99
        }
    }, {
        value: 'T',
        audio: 'd.wav',
        pos: {
            x: 146,
            y: 99
        }
    }, {
        value: 'T',
        audio: 'e.wav',
        pos: {
            x: 214,
            y: 99
        }
    }, {
        value: 'A',
        audio: 'eb.wav',
        pos: {
            x: 277,
            y: 99
        }
    }, {
        value: 'L',
        audio: 'f.wav',
        pos: {
            x: 7,
            y: 198
        }
    }, {
        value: 'O',
        audio: 'f1.wav',
        pos: {
            x: 61,
            y: 198
        }
    }, {
        value: 'V',
        audio: 'g.wav',
        pos: {
            x: 140,
            y: 198
        }
    }, {
        value: 'E',
        audio: 'g1.wav',
        pos: {
            x: 213,
            y: 198
        }
    }, {
        value: 'F',
        audio: 'a.wav',
        pos: {
            x: 4,
            y: 297
        }
    }, {
        value: 'R',
        audio: 'b.wav',
        pos: {
            x: 72,
            y: 297
        }
    }, {
        value: 'O',
        audio: 'bb.wav',
        pos: {
            x: 132,
            y: 297
        }
    }, {
        value: 'N',
        audio: 'c.wav',
        pos: {
            x: 202,
            y: 297
        }
    }, {
        value: 'T',
        audio: 'c1.wav',
        pos: {
            x: 284,
            y: 297
        }
    }, {
        value: 'E',
        audio: 'd.wav',
        pos: {
            x: 340,
            y: 297
        }
    }, {
        value: 'N',
        audio: 'e.wav',
        pos: {
            x: 396,
            y: 297
        }
    }, {
        value: 'D',
        audio: 'eb.wav',
        pos: {
            x: 470,
            y: 297
        }
    }];

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    yglf._logoWidth = 592;
    yglf._logoHeight = 478;
    yglf._logoScale = 0.7;
    yglf._fontsize = 74;
    yglf._logoGreenColor = 'rgb(0, 208, 157)';
    yglf._logoBlueColor = 'rgb(9, 97, 197)';
    yglf.orientation = window.orientation

    yglf.createDisplayObjects = function() {

        // logo rectangle
        var rect = new createjs.Shape();
        rect.graphics
            .setStrokeStyle(9)
            .beginStroke("#FFF")
            .drawRect(0, 0, yglf._logoWidth, yglf._logoHeight);

        rect.x = 0;
        rect.y = 0;

        yglf.logoContainer.addChild(rect);


        // letters
        yglf.letters.forEach(function(letter) {

            letter.pos.x += 42;
            letter.pos.y += 40;

            var textObject = new createjs.Text(letter.value);
            var textContainer = new createjs.Container();

            textObject.font = '300 ' + yglf._fontsize + 'px futura-pt';
            textObject.color = '#FFF';
            textObject.align = 'right';
            textContainer.x = letter.pos.x;
            textContainer.y = letter.pos.y;
            if (yglf.utils.isMobile) textObject.cache(0, 0, textObject.getMeasuredWidth(), textObject.getMeasuredHeight());

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").drawRect(0, 0, textObject.getMeasuredWidth(), textObject.getMeasuredHeight());
            textObject.hitArea = hitArea;

            var textBackground = new createjs.Shape();
            textBackground.graphics.beginFill("red").drawCircle(0, 0, yglf._fontsize * .5);

            textBackground.x = letter.pos.x;
            textBackground.y = letter.pos.y;

            letter.textObject = textObject;
            letter.textContainer = textContainer;
            letter.textBackground = textBackground;

            // var audio = new Audio();
            // audio.src = 'sounds/' + letter.audio;
            // audio.load();
            // letter.audio = audio;

            // textObject.addEventListener('click', function(event) {
            //     //alert(letter.textObject.text);
            //     letter.audio.play();
            // })

            textContainer.addChild(textObject);
            //logoContainer.addChild(textBackground);
            yglf.logoContainer.addChild(textContainer);

        });

    };

    yglf.loadFonts = function() {


        // WebFont not loading typekit on mobile devices
        Typekit.load({
            fontactive: function() {
                if (yglf.stage) yglf.stage.update();
            }
        });

        WebFont.load({
            custom: {
                families: ['Ionicons'],
                urls: ['css/ionicons.min.css'],
                testStrings: {
                    Ionicons: '\uf10c\uf109'
                }
            },
            fontactive: function() {
                if (yglf.stage) yglf.stage.update();
            }
        });

    };

    yglf.resize = function() {

        // canvas size
        var canvasWidth = window.innerWidth * window.devicePixelRatio;
        var canvasHeight = window.innerHeight * window.devicePixelRatio;

        yglf.canvas.setAttribute('width', canvasWidth);
        yglf.canvas.setAttribute('height', canvasHeight);

        yglf.canvas.style.width = window.innerWidth + 'px';
        yglf.canvas.style.height = window.innerHeight + 'px';

        // set ctx scale
        var context = yglf.canvas.getContext('2d');
        context.scale(window.devicePixelRatio, window.devicePixelRatio);

        // set background size
        yglf.background.graphics.beginLinearGradientFill([yglf._logoBlueColor, yglf._logoGreenColor, yglf._logoGreenColor], [0, 0.5, 1], 0, 0, 0, yglf.canvas.height)
        yglf.background.graphics.drawRect(0, 0, yglf.canvas.width, yglf.canvas.height);
        yglf.background.cache(0, 0, yglf.canvas.width, yglf.canvas.height);


        // set logo container size
        var logoScale = 1;
        var windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio >= 1) {
            // landscape
            logoScale = (window.innerHeight / yglf._logoHeight * window.devicePixelRatio) * yglf._logoScale;
        } else {
            // portrait
            logoScale = (window.innerWidth / yglf._logoWidth * window.devicePixelRatio) * yglf._logoScale;
        }

        yglf.logoScale = logoScale;

        yglf.logoContainer.scaleX = yglf.logoContainer.scaleY = logoScale;

        yglf.logoContainerWidth = yglf._logoWidth * logoScale;
        yglf.logoContainerHeight = yglf._logoHeight * logoScale;

        // set logo container position
        yglf.logoContainer.x = (yglf.canvas.width - yglf.logoContainerWidth) / 2;
        yglf.logoContainer.y = (yglf.canvas.height - yglf.logoContainerHeight) / 2;

        yglf.menu.setMenuPosition(windowRatio >= 1);

        yglf.stage.update();

    };


    yglf.init = function() {

        yglf.loadFonts();

        // main objects
        yglf.canvas = document.getElementById('canvas');
        yglf.stage = new createjs.Stage(yglf.canvas);
        yglf.logoContainer = new createjs.Container();
        yglf.background = new createjs.Shape();
        yglf.movieClip = new createjs.MovieClip(null, 0, false);

        yglf.stage.addChild(yglf.background);
        yglf.stage.addChild(yglf.logoContainer);

        // events
        yglf.stage.enableMouseOver(10);
        createjs.Touch.enable(yglf.stage);
        createjs.Ticker.setFPS(60);

        // resize and orentation
        yglf.createDisplayObjects();
        yglf.menu.init();
        yglf.resize();
        //yglf.game.start();

        var resizeTimeout;

        //yglf.utils.setRandomPosition(yglf.letters[0]);

        // yglf.letters.forEach(function(letter) {
        //     yglf.utils.setRandomPosition(letter);
        // });

        yglf.intro.preload();

        function doResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(yglf.resize, 200)
        }

        function doOrientationChange(event) {
            yglf.orientation = window.orientation;
        }
        window.addEventListener('resize', doResize);
        window.addEventListener('orientationchange', doOrientationChange, false);

        yglf.shake.init();
        
        yglf.stage.update();


    };

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var menu = {};

    var buttonSize = 32 * window.devicePixelRatio;

    menu.setMenuPosition = function(isVertical) {

        var posX = 0;
        var posY = 0;
        if (isVertical) {
            yglf.menuButtons.forEach(function(button) {
                button.object.x = posX;
                button.object.y = posY;
                posY += buttonSize * 1.5;
            });
            yglf.menuContainer.x = 16;
            yglf.menuContainer.y = (yglf.canvas.height - (buttonSize * yglf.menuButtons.length)) / 2;
        } else {
            yglf.menuButtons.forEach(function(button) {
                button.object.x = posX;
                button.object.y = posY;
                posX += buttonSize * 1.5;
            });
            yglf.menuContainer.x = (yglf.canvas.width - (buttonSize * 1.5 * yglf.menuButtons.length)) / 2;
            yglf.menuContainer.y = yglf.canvas.height - (buttonSize * 1.5);
        }

    }

    menu.init = function() {

        if (!yglf.utils.isMobile) {
            alert('This is mobile app. Please, visit from your mobile phone.');
            return;
        };

        yglf.menuContainer = new createjs.Container();

        yglf.menuButtons = [ {
            icon: '\uf43a',
            hoverIcon: '\uf43b',
            action: function() {
                yglf.intro.stop();
                yglf.customAnimation.stop();
                yglf.game.start();
            }
        },{
            icon: '\uf4b2',
            hoverIcon: '\uf4b3',
            action: function(event) {
                yglf.game.stop();
                yglf.customAnimation.stop();
                yglf.intro.start();
                event.target.text = '\uf4b3';
            }
        }];
        // {
        //     icon: '\uf459',
        //     hoverIcon: '\uf459',
        //     action: function() {
        //         yglf.game.stop();
        //         yglf.intro.stop();
        //         yglf.customAnimation.start()
        //     }
        // }

        var createButton = function(_button) {

            var button = new createjs.Text();
            _button.object = button;
            button.font = 'normal ' + buttonSize + 'px Ionicons';
            button.color = '#FFF';
            button.alpha = 0.5;
            button.text = _button.icon;

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill('#000').drawRect(0, 0, buttonSize, buttonSize);
            button.hitArea = hitArea;

            yglf.menuContainer.addChild(button);

            button.addEventListener('click', _button.action, false);

            button.addEventListener('mouseover', function() {
                button.alpha = 1;
                button.cursor = 'pointer';
                button.text = _button.hoverIcon;
                yglf.stage.update();
            });

            button.addEventListener('mouseout', function() {
                button.alpha = 0.5;
                button.text = _button.icon;
                yglf.stage.update();
            });

            yglf.stage.update();

        }

        yglf.menuButtons.forEach(createButton);

        yglf.stage.addChild(yglf.menuContainer);

    }

    yglf.menu = menu;

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var shake = {};

    shake.shaking = false;

    shake.init = function() {

        var yglfShakeEvent = new Shake({
            threshold: 15,
            timeout: 0
        });

        yglfShakeEvent.start();

        window.addEventListener('shake', shake.start, false);

    }

    shake.start = function() {
        
        if (shake.shaking) return;

        shake.shaking = true;

        createjs.Ticker.addEventListener('tick', yglf.stage);

        var movieClip = new createjs.MovieClip(null, 0, false);

        yglf.letters.forEach(function(letter) {

            var tween = createjs.Tween.get(letter.textContainer);

            if (yglf.orientation === 0) {
                tween.to({
                    y: yglf.utils.random(window.innerHeight * -4, window.innerHeight * 4)
                }).to({
                    y: letter.pos.y
                }, 100, createjs.Ease.elasticOut).call(shake.stop);

            } else {

                tween.to({
                    x: yglf.utils.random(window.innerHeight * -4, window.innerHeight * 4)
                }).to({
                    x: letter.pos.x
                }, 100, createjs.Ease.elasticOut).call(shake.stop);

            }


            movieClip.timeline.addTween(tween);

        });

        yglf.logoContainer.addChild(movieClip);

        movieClip.play();

    }

    shake.stop = function() {

        if (!shake.shaking) return;

        shake.shaking = false;
        
        createjs.Ticker.removeEventListener('tick', yglf.stage);

    }

    yglf.shake = shake;

})(yglf, createjs);

'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var utils = {};

    utils.isMobile = (function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent);
        return check;
    })();

    utils.isAndroid = (function() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("android") > -1;
    })();

    utils.random = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    utils.hideLetters = function() {
        yglf.letters.forEach(function(letter) {
            letter.textContainer.visible = false;
        });
    };

    utils.showLetters = function() {
        yglf.letters.forEach(function(letter) {
            letter.textContainer.visible = true;
        });
    };

    utils.setRandomPosition = function(letter) {

        var relativeX = yglf.logoContainer.x + letter.textContainer.x;
        var relativeY = yglf.logoContainer.y + letter.textContainer.y;

        var x = 0;
        var y = 0;

        var sections = [{
            minX: 0,
            minY: 0,
            maxX: yglf.logoContainer.x,
            maxY: window.innerHeight
        }, {
            minX: yglf.logoContainer.x,
            minY: 0,
            maxX: yglf.logoContainerWidth,
            maxY: yglf.logoContainer.y
        }, {
            minX: yglf.logoContainer.x,
            minY: (yglf.logoContainer.y + yglf.logoContainerHeight),
            maxX: (yglf.logoContainer.x + yglf.logoContainerWidth),
            maxY: window.innerHeight
        }, {
            minX: (yglf.logoContainer.x + yglf.logoContainerWidth),
            minY: 0,
            maxX: window.innerWidth,
            maxY: window.innerHeight
        }];

        var section = sections[utils.random(0, sections.length)];

        var x = utils.random(section.minX, section.maxX)
        var y = utils.random(section.minY, section.maxY)

        console.log(x, y);


        letter.textObject.x = (x - relativeX) / yglf.logoScale;
        letter.textObject.y = (y - relativeY) / yglf.logoScale;
        
    };



    utils.shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }


    yglf.utils = utils;

})(yglf, createjs);
