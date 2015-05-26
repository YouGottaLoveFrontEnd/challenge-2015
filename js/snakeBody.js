/**
 * Created by Dima on 24/05/2015.
 */
define(['cell'], function (Cell) {
    'use strict';

    function SnakeBody(numOfCells) {
        this.body = [];
        for (; numOfCells > 0; numOfCells--) {
            this.body.push(new Cell(numOfCells, 2, this.style));
        }
    }

    SnakeBody.prototype.style = {
        border: '1px solid black',
        backgroundColor: 'yellow'
    };

    SnakeBody.directions = {
        up: 1,
        right: 2,
        down: 3,
        left: 4
    };

    SnakeBody.prototype.createBodyFragment = function () {
        var fragment = document.createDocumentFragment();
        this.body.forEach(function (cell) {
            fragment.appendChild(cell.createElement());
        });
        return fragment;
    };

    SnakeBody.prototype.step = function (direction) {
        var first = this.body[0];
        var newCell = this.createCellByDirection(first, direction);
        this.body.unshift(newCell);
        this.body.pop();
    };

    SnakeBody.prototype.createCellByDirection = function (baseCell, direction) {
        var top = baseCell.position.top;
        var left = baseCell.position.left;
        switch (direction) {
            case SnakeBody.directions.down:
                top += 1;
                break;
            case SnakeBody.directions.up:
                top -= 1;
                break;
            case SnakeBody.directions.right:
                left += 1;
                break;
            case SnakeBody.directions.left:
                left -= 1;
                break;
        }
        return new Cell(top, left, this.style);
    };

    SnakeBody.prototype.draw = function (board) {
        var fragment = this.createBodyFragment();
        board.appendChild(fragment);
    };

    SnakeBody.prototype.getHead = function () {
        return this.body[0];
    };

    SnakeBody.prototype.eat = function () {
        this.body.push(this.body[this.body.length - 1]);
    };

    SnakeBody.prototype.isOnBody = function (cell) {
        return this.body.some(function (bodyCell) {
            return bodyCell.onSamePositionWith(cell);
        });
    };

    SnakeBody.prototype.isHeadOnBody = function (cell) {
        return this.body.slice(1).some(function (bodyCell) {
            return bodyCell.onSamePositionWith(cell);
        });
    };

    return SnakeBody;
});