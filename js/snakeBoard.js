/**
 * Created by Dima on 24/05/2015.
 */

define(['settings'], function (settings) {
    'use strict';

    function SnakeBoard(selector, width, height) {
        this.width = width;
        this.height = height;
        this.element = this.getBoard(selector, width, height);
    }

    SnakeBoard.prototype.getBoard = function (selector, width, height) {
        var board = document.createElement('div');
        var container =document.querySelector(selector);
        board.style.position = 'relative';
        board.style.width = width * settings._cellSize + 'px';
        board.style.height = height * settings._cellSize + 'px';
        container.style.position = 'absolute';
        container.appendChild(board);
        return board;
    };

    return SnakeBoard;
});
