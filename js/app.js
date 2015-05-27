/**  Created by Dima on 22/05/2015. **/
'use strict';
require.config({
    paths: {
        TweenMax: 'greensock/TweenMax',
        TweenLight: 'greensock/TweenLight',
        CSSPlugin: 'greensock/CSSPlugin',
        SplitText: 'plugins/SplitText'
    }
});

require(['snake', 'animation'],
    function (Snake, Animation) {
        setTimeout(function () {
            var snake = new Snake('#board', 30, 21);
            snake.init();

            var animation = new Animation('#animation-text');
            snake.on(Snake.events.start, animation.setLettersGrey.bind(animation));
            snake.on(Snake.events.fail, animation.lettersDown.bind(animation));
            snake.on(Snake.events.eating, animation.letterToGold.bind(animation));
            snake.on(Snake.events.win, animation.win.bind(animation));
        }, 700);
    });