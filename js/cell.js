/**
 * Created by Dima on 24/05/2015.
 */
define(['position', 'settings'], function (Position, settings) {
    'use strict';
    function shallowCopy(target, source) {
        for (var name in source) {
            target[name] = source[name];
        }
    }

    function Cell(top, left, style) {
        this.position = new Position(top, left);
        this.style = style;
    }

    Cell.prototype.createElement = function () {
        var element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = settings._cellSize + 'px';
        element.style.height = settings._cellSize + 'px';
        element.style.top = this.position.top * settings._cellSize + 'px';
        element.style.left = this.position.left * settings._cellSize + 'px';
        shallowCopy(element.style, this.style);
        return element;
    };

    Cell.prototype.onSamePositionWith = function (cell) {
        return this.position.top === cell.position.top && this.position.left === cell.position.left;
    };

    return Cell;
});