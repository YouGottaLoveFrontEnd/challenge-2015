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
