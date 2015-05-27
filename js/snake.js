/**
 * Created by Dima on 24/05/2015.
 */

define(['snakeBoard', 'snakeBody', 'score', 'food', 'cell', 'rulesBox', 'settings', 'logger'],
    function (SnakeBoard, SnakeBody, Score, Food, Cell, RulesBox, settings) {
        'use strict';
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function Snake(selector, width, height) {
            this.board = new SnakeBoard(selector, width, height);
            this.direction = SnakeBody.directions.down;
            this.isPaused = false;
            this.isFailed = false;
            this.isMuted = false;
            this.isWon = false;
            this.speedDelay = settings.speedDelay;
            this.speedStep = settings.speedStep;
            this.food = null;
            this.body = null;
            this.score = new Score();
            this.rules = new RulesBox();
            this.animationTimeout = null;
            this.subscribers = {};
        }

        Snake.soundMap = {
            eat: new Audio('sounds/eat.wav'),
            fail: new Audio('sounds/crash.wav'),
            sadTrombone: new Audio('sounds/sad-trombone.mp3')
        };

        Snake.events = {
            start: 'start',
            fail: 'fail',
            eating: 'eating',
            win: 'win'
        };

        Snake.prototype.setNewGame = function () {
            this.food = new Food(0, 0);
            this.body = new SnakeBody(3);
            this.speedDelay = settings.speedDelay;
            this.isPaused = false;
            this.isFailed = false;
            this.isWon = false;
            this.direction = SnakeBody.directions.down;
            this.score.reset();
            this.randomizeFoodPosition();
        };

        Snake.prototype.start = function () {
            this.rules.hide();
            this.trigger(Snake.events.start);
            this.run();
        };

        Snake.prototype.init = function () {
            this.addEventListeners();
            this.renderScore();
            this.renderRules();
        };

        Snake.prototype.renderHelperElement = function (el) {
            var boardEl = this.board.element;
            if (boardEl.nextSibling) {
                boardEl.parentNode.insertBefore(el, boardEl.nextSibling);
            } else {
                boardEl.parentNode.appendChild(el);
            }
        };

        Snake.prototype.renderScore = function () {
            this.renderHelperElement(this.score.element);
        };

        Snake.prototype.renderRules = function () {
            this.renderHelperElement(this.rules.element);
        };

        Snake.prototype.clearBoard = function () {
            this.board.element.innerHTML = '';
        };

        Snake.prototype.redraw = function () {
            this.handleFeed();
            this.clearBoard();
            if (!this.isWon) {
                this.body.draw(this.board.element);
                this.food.draw(this.board.element);
            }
        };

        Snake.prototype.handleFeed = function (flag) {
            var head = this.body.getHead();
            if (head.onSamePositionWith(this.food.body) || flag) {
                this.body.eat();
                this.score.addScore(settings._scoreStep);
                this.playSound(Snake.soundMap.eat);
                this.randomizeFoodPosition();
                this.speedUp();
                this.trigger(Snake.events.eating, {score: this.score.getScore()});
                if (this.body.body.length === (settings.stepsToWin + 3)) {
                    this.win();
                }
            }
        };

        Snake.prototype.speedUp = function () {
            this.speedDelay -= this.speedStep;
        };

        Snake.prototype.randomizeFoodPosition = function () {
            var top = getRandomInt(0, this.board.height - 1);
            var left = getRandomInt(0, this.board.width - 1);
            if (!this.body.isOnBody(new Cell(top, left))) {
                this.food.setPosition(top, left);
            } else {
                this.randomizeFoodPosition();
            }
        };

        Snake.prototype.run = function () {
            this.body.step(this.direction);
            this.validateFailing();
            if (!this.isPaused && !this.isFailed && !this.isWon) {
                this.redraw();
                clearTimeout(this.animationTimeout);
                this.animationTimeout = setTimeout(this.run.bind(this), this.speedDelay);
            }
        };

        Snake.prototype.validateFailing = function () {
            var head = this.body.getHead();
            if (head.position.top < 0 || head.position.top >= this.board.height
                || head.position.left < 0 || head.position.left >= this.board.width) {
                this.fail();
            } else if (this.body.isHeadOnBody(head)) {
                this.fail();
            }
        };

        Snake.prototype.fail = function () {
            this.isFailed = true;
            this.rules.show();
            this.trigger(Snake.events.fail);
            this.playSound(Snake.soundMap.fail);
            this.playSound(Snake.soundMap.sadTrombone);
        };

        Snake.prototype.win = function () {
            this.isWon = true;
            this.trigger(Snake.events.win);
        };

        Snake.prototype.smartDevWin = function () {
            if (!this.body || this.isFailed) {
                this.setNewGame();
                this.start();
            }
            var self = this;
            self.isPaused = true;
            for (var i = this.body.body.length; i < settings.stepsToWin + 3; i++) {
                setTimeout(function () {
                    self.handleFeed(true);
                }, 120 * i);
            }
        };

        Snake.prototype.addEventListeners = function () {
            document.addEventListener('keyup', function (event) {
                switch (event.which) {
                    case 37: // left
                        this.setDirection(SnakeBody.directions.left);
                        break;
                    case 38: // up
                        this.setDirection(SnakeBody.directions.up);
                        break;
                    case 39: // right
                        this.setDirection(SnakeBody.directions.right);
                        break;
                    case 40: // down
                        this.setDirection(SnakeBody.directions.down);
                        break;
                    case 80:  // p - pause
                        this.handlePause();
                        break;
                    case 78:  // n - new game
                        this.handleNewGame();
                        break;
                    case 87: // w - win :-)
                        this.smartDevWin();
                        break;
                    case 77: // m - mute/unmute
                        this.toggleMute();
                        break;
                }
            }.bind(this));
        };

        Snake.prototype.playSound = function (sound) {
            if (!this.isMuted) {
                sound.play();
            }
        };

        Snake.prototype.toggleMute = function () {
            this.isMuted = !this.isMuted;
        };

        Snake.prototype.handlePause = function () {
            if (this.isPaused) {
                this.isPaused = false;
                this.run();
            } else {
                this.isPaused = true;
            }
        };

        Snake.prototype.handleNewGame = function () {
            this.setNewGame();
            this.start();
        };

        Snake.prototype.setDirection = function (direction) {
            if (this.isPaused) {
                return;
            }
            if (Math.abs(this.direction - direction) % 2 === 1) {
                this.direction = direction;
            }
        };

        Snake.prototype.on = function (eventName, callback) {
            if (!this.subscribers[eventName]) {
                this.subscribers[eventName] = [];
            }
            if (callback && typeof callback === 'function') {
                this.subscribers[eventName].push(callback);
            }
        };

        Snake.prototype.trigger = function (eventName, args) {
            if (this.subscribers[eventName]) {
                this.subscribers[eventName].forEach(function (callback) {
                    callback.call(null, args);
                });
            }
        };

        return Snake;
    });
