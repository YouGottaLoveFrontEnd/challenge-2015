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
