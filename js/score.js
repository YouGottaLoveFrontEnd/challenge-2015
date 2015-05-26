/**
 * Created by Dima on 24/05/2015.
 */
define(function () {
    'use strict';

    function Score() {
        this.element = this.createScoreElement();
        var counter = 0;
        var scoreHolder = this.element.querySelector('.score-place-holder');
        this.getScore = function () {
            return counter;
        };
        this.addScore = function (numberToAdd) {
            counter += numberToAdd;
            scoreHolder.innerText = counter;
        };
        this.reset = function () {
            counter = 0;
            scoreHolder.innerText = counter;
        };
    }

    Score.prototype.createScoreElement = function () {
        var el = document.createElement('div');
        el.className = 'score-container';
        var label = document.createElement('span');
        label.className = 'score-label';
        label.innerText = 'Your score: ';
        var scorePlaceHolder = document.createElement('b');
        scorePlaceHolder.className = 'score-place-holder';
        scorePlaceHolder.innerText = '0';
        el.appendChild(label);
        el.appendChild(scorePlaceHolder);
        return el;
    };

    return Score;
});
