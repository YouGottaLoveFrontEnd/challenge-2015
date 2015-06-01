'use strict';


var challange = {};

(function(challange, createjs) {

    var letters = [{
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

    var logo = 'YOU\nGOTTA\nLOVE\nFRONTEND';
    var fontSize = 74;
    var lineHeight = fontSize * 1.34;
    var letterSpacing = fontSize * -0.1;

    var lines = [];
    var linesOfDisplayObjects = [];



    // function handleFileLoaded(event) {
    //     var item = event.item;
    //     var id = item.id;
    //     var result = event.result;
    //     result.play();

    // }

    // var preload = new createjs.LoadQueue(false);

    // createjs.Sound.alternateExtensions = ["wav"];
    // createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin]);
    // preload.installPlugin(createjs.Sound);
    // preload.addEventListener("fileload", handleFileLoaded);

    // preload.loadManifest([{
    //     id: "a",
    //     src: "sounds/a.wav"
    // }]);




    // Create a new queue.
    //preload = new createjs.LoadQueue(true, "assets/");





    var canvas;
    var stage;
    var background;
    var menu;
    var logoContainer;
    var movieClip;
    var info;

    var ratio = 1;
    var logoRatio = 592 / 478;


    var logoWidth;
    var logoHeight;


    var createDisplayObjects = function() {

        info = new createjs.Text();

        info.font = 'normal 17px Ionicons';
        info.color = '#FFF';
        info.align = 'right';

        info.x = 30;
        info.y = 30;

        stage.addChild(info);

        var rect = new createjs.Shape();

        rect.graphics
            .setStrokeStyle(9)
            .beginStroke("#FFF")
            .drawRect(0, 0, 592, 478);

        rect.x = 0;
        rect.y = 0;

        logoContainer.addChild(rect);

        letters.forEach(function(letter) {

            letter.pos.x += 42;
            letter.pos.y += 40;

            var textObject = new createjs.Text(letter.value);
            var textContainer = new createjs.Container();

            textObject.font = '300 ' + fontSize + 'px futura-pt';
            textObject.color = '#FFF';
            textObject.align = 'right';
            textContainer.x = letter.pos.x;
            textContainer.y = letter.pos.y;
            //textContainer.cache(0, 0, textObject.getMeasuredWidth(), textObject.getMeasuredHeight());


            var hit = new createjs.Shape();
            hit.graphics.beginFill("#000").drawRect(0, 0, textObject.getMeasuredWidth(), textObject.getMeasuredHeight());
            textObject.hitArea = hit;

            var textBackground = new createjs.Shape();
            textBackground.graphics.beginFill("red").drawCircle(0, 0, fontSize * .5);

            textBackground.x = letter.pos.x;
            textBackground.y = letter.pos.y;

            letter.textObject = textObject;
            letter.textContainer = textContainer;
            letter.textBackground = textBackground;


            var audio = new Audio();
            console.log(letter.audio);
            audio.src = 'sounds/' + letter.audio;

            console.log(audio.src);
            audio.load();

            letter.audio = audio;

            textObject.addEventListener('click', function(event) {
                //alert(letter.textObject.text);
                letter.audio.play();
            })

            textContainer.addChild(textObject);
            //logoContainer.addChild(textBackground);
            logoContainer.addChild(textContainer);

        });

    }

    var resize = function() {

        var canvasWidth = window.innerWidth * window.devicePixelRatio;
        var canvasHeight = window.innerHeight * window.devicePixelRatio;

        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);

        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        var context = canvas.getContext('2d');

        context.scale(window.devicePixelRatio, window.devicePixelRatio);

        var backgroundWidth = canvas.width;
        var backgroundHeight = canvas.height;

        background.graphics.beginLinearGradientFill(['rgb(9, 97, 197)', 'rgb(0, 208, 157)', 'rgb(0, 208, 157)'], [0, 0.5, 1], 0, 0, 0, backgroundHeight)
        background.graphics.drawRect(0, 0, backgroundWidth, backgroundHeight);
        background.cache(0, 0, backgroundWidth, backgroundHeight);

        var logoScale = 1;
        ratio = window.innerWidth / window.innerHeight;
        if (ratio >= 1) {
            // landscape
            logoScale = (window.innerHeight / 478 * window.devicePixelRatio) * .7;
        } else {
            // portrait
            logoScale = (window.innerWidth / 592 * window.devicePixelRatio) * .7;
        }

        if (info) {
            info.text += '\nlogoScale: ' + logoScale;
        }

        logoContainer.scaleX = logoContainer.scaleY = logoScale;

        logoContainer.x = (canvasWidth - (592 * logoScale)) / 2;
        logoContainer.y = (canvasHeight - (478 * logoScale)) / 2;

    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    challange.getRendom = function() {

        letters.forEach(function(letter) {
            letter.posFrom = {
                x: getRandomArbitrary(-(logoContainer.x), canvas.width / window.devicePixelRatio),
                y: getRandomArbitrary(-(logoContainer.y), canvas.height / window.devicePixelRatio)
            }
        });

    }


    var Tweens = {
        elasticOut: 0
    }

    challange.addTweens = function() {

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

        var getCustomEase = function() {
            var index = getRandomArbitrary(0, (easeProvider.length - 1));
            var ease = easeProvider[index].type;
            return ease;
        }

        var easeOut = getCustomEase();
        var easeIn = getCustomEase();

        letters.forEach(function(letter, index) {

            if (!letter.tween) {
                var tween = createjs.Tween.get(letter.textObject);
                tween
                    .to(letter.pos)
                    .to(letter.posFrom, 30, easeOut)
                    .to(letter.pos, 180, easeIn)
                letter.tween = tween;
                movieClip.timeline.addTween(tween);
            } else {
                createjs.Tween.get(letter.textObject, {
                    override: true
                })
                .to(letter.pos)
                .to(letter.posFrom, 1000, easeOut)
                .to(letter.pos, 2000, easeIn)
            }

        });

    }

    var tweens;
    var activeCount;
    var circleCount = 15;

    function initCircles() {

        tweens = [];

        for (var i = 0; i < circleCount; i++) {
            var circle = new createjs.Shape();
            circle.graphics.setStrokeStyle(10);
            circle.graphics.beginStroke("#FFF");
            circle.graphics.drawCircle(0, 0, (i + 1) * 3);
            circle.alpha = 1 - i * 0.02;
            circle.x = Math.random() * window.innerWidth;
            circle.y = Math.random() * window.innerHeight;
            circle.compositeOperation = "lighter";

            var tween = createjs.Tween.get(circle).to({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                alpha: 0
            }, (0.5 + i * 0.04) * 1500, createjs.Ease.bounceOut).call(tweenComplete);

            tweens.push({
                tween: tween,
                ref: circle
            });
            stage.addChild(circle);
        }

        activeCount = circleCount;
        stage.addEventListener("stagemouseup", handleMouseUp);

    }

    function handleMouseUp(event) {


        for (var i = 0; i < circleCount; i++) {
            var ref = tweens[i].ref;
            var tween = tweens[i].tween;
            createjs.Tween.get(ref, {
                    override: true
                })
                .to({
                    alpha: 0.5,
                    x: stage.mouseX,
                    y: stage.mouseY,
                })
                .to({
                    alpha: 0
                }, (0.5 + i * 0.04) * 500, createjs.Ease.bounceOut).call(tweenComplete);
        }

        activeCount = circleCount;

        challange.getRendom();
        challange.addTweens();
        movieClip.play();

    }

    function tweenComplete() {
        activeCount--;
    }

    challange.init = function() {

        canvas = document.getElementById('canvas');
        stage = new createjs.Stage(canvas);
        logoContainer = new createjs.Container();
        background = new createjs.Shape();
        movieClip = new createjs.MovieClip(null, 0, false);
        menu = new createjs.Container();

        stage.enableDOMEvents(true);

        stage.addChild(background);
        //stage.addChild(frame);
        stage.addChild(logoContainer);
        logoContainer.addChild(movieClip);

        resize();

        createDisplayObjects();
        initCircles();

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);

        createjs.Touch.enable(stage);

        stage.enableMouseOver(10);

        challange.getRendom();
        challange.addTweens();
        movieClip.play();



        createjs.Ticker.addEventListener("tick", handleTick);

        function handleTick(event) {
            if (info) {
                //info.text = Math.round(createjs.Ticker.getMeasuredFPS());
            }

            if (activeCount) {
                stage.update(event);
            }

        }

        var resizeTimeout;

        function doOnOrientationChange(e) {

            clearTimeout(resizeTimeout);

            resizeTimeout = setTimeout(function() {
                resize();
            }, 200)

            if (info) {
                info.text += '\n' + e.type;
            }
        }

        window.addEventListener('resize', doOnOrientationChange);
        window.addEventListener('orientationchange', doOnOrientationChange);

        function handleMotionEvent(event) {

            var x = event.accelerationIncludingGravity.x;
            var y = event.accelerationIncludingGravity.y;
            var z = event.accelerationIncludingGravity.z;

            info.x += x * 5;
            info.y -= y * 5;

        }

        window.addEventListener("devicemotion", handleMotionEvent, true);

    }



})(challange, createjs);

window.onerror = function() {
    alert("Error caught");
};


window.onload = challange.init;
