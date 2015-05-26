/**
 * Created by Dima on 24/05/2015.
 */
define(['cell'], function (Cell) {
    'use strict';
    function Food(top, left) {
        this.body = new Cell(top, left, {
            border: '1px solid black',
            backgroundColor: 'red'
        });
    }

    Food.prototype.setPosition = function (top, left) {
        this.body.position.top = top;
        this.body.position.left = left;
    };

    Food.prototype.draw = function (board) {
        board.appendChild(this.body.createElement());
    };

    return Food;
});

