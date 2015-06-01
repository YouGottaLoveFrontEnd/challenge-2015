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
