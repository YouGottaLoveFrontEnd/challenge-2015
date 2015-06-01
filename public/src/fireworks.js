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
