/**
 * Created by Dima on 25/05/2015.
 */
define(['TweenMax', 'TweenLight', 'CSSPlugin', 'SplitText', 'settings'],
    function (TweenMax, TweenLight, CSSPlugin, SplitText, settings) {
        'use strict';
        var rough = RoughEase.ease.config({strength: 2, clamp: true});

        function Animation(selector) {
            this.element = document.querySelector(selector);
            this.splitedText = null;
            this.splitText();
        }

        Animation.prototype.splitText = function () {
            if (this.splitedText && this.splitedText.revert) {
                this.splitedText.revert();
            }
            this.splitedText = new SplitText(this.element, {type: 'chars'});
        };

        Animation.prototype.setLettersGrey = function () {
            this.splitText();
            TweenMax.to(this.splitedText.chars, 0.6, {
                color: 'rgba(0, 0, 0, 0.3)'
            });
        };

        Animation.prototype.lettersDown = function () {
            var containerHeight = this.element.clientHeight;
            var tl = new TimelineMax();
            var split = this.splitedText;

            for (var i = 0; i < split.chars.length; i++) {
                var y = containerHeight - split.chars[i].offsetTop - split.chars[i].clientHeight;
                tl.to(split.chars[i], 0.8, {y: y, ease: Bounce.easeOut}, 0.6 + Math.random() * 0.6);
                tl.to(split.chars[i], 0.6, {autoAlpha: 0, ease: rough}, 2 + Math.random());
            }
        };

        Animation.prototype.letterToGold = function (data) {
            if (!isNaN(data.score)) {
                var index = data.score / settings._scoreStep - 1;
                var letter = this.splitedText.chars[index];
                var tl = new TimelineMax();
                if (letter) {
                    tl.to(letter, 0, {color: 'gold'});
                    tl.to(letter, 0.3, {textShadow: '4px 1px 4px rgba(252, 249, 3, 0.46)'});
                    tl.from(letter, 1.3, {transformOrigin: '38% 47%', rotation: 720});
                    tl.to(letter, 0.3, {textShadow: '4px 1px 4px rgba(252, 249, 3, 0)'});
                }
            }
        };

        Animation.prototype.win = function () {
            var tl = new TimelineMax();
            var containerHeight = this.element.clientHeight;
            var letterO = this.splitedText.chars[9];
            var y = containerHeight - letterO.offsetTop - 130;
            TweenMax.set(letterO, {clearProps:'transform'});
            var clone = letterO.cloneNode(true);
            clone.innerHTML = '';
            clone.className = 'heartbeat';

            TweenMax.staggerFromTo(this.splitedText.chars, 0.4, {autoAlpha: 0, scale: 7}, {
                autoAlpha: 1,
                scale: 1,
                color: 'white'
            }, 0.2, function(){
                tl.to(letterO, 2, {ease: Bounce.easeOut, transformOrigin: '38% 100%', rotation: 180});
                tl.to(letterO, 0.8, {y: y, ease: Bounce.easeOut}, 0.6 + Math.random() * 0.6);
                tl.to(letterO, 0.6, {autoAlpha: 0, ease: rough, onComplete: function(){
                    setTimeout(function(){
                        letterO.parentNode.replaceChild(clone, letterO)
                    }, 300);
                }}, 1.5);
            });

        };

        return Animation;
    });
