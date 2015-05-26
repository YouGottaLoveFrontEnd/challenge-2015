/**
 * Created by Dima on 25/05/2015.
 */
define(function () {
    'use strict';
    function RulesBox() {
        this.element = this.createBoxElement();
    }

    RulesBox.prototype.createBoxElement = function () {
        var container = this.createContainer();
        var rules = document.createElement('div');
        rules.innerText = 'Use arrow keys to move\nPress P to Pause\nPress N to New Game\nPress M to Mute/Unmute';
        container.appendChild(rules);
        return container;
    };
    RulesBox.prototype.createContainer = function () {
        var el = document.createElement('div');
        el.className = 'start-box-container';
        el.style.position = 'absolute';
        return el;
    };

    RulesBox.prototype.show = function () {
        this.element.style.display = 'block';
    };

    RulesBox.prototype.hide = function () {
        this.element.style.display = 'none';
    };
    return RulesBox;
});
