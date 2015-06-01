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
