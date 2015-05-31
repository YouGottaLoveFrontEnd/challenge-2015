define([
    'jquery',
    'underscore',
    'physicsjs',
    'tween',
    'App/Collection',
    'App/Util',
    'App/Input',
    'App/PowerMeter',
    'App/behaviors/TargetLanding'
], function ($, _, Physics, TWEEN, Collection, Util, Input, PowerMeter) {

    window.Physics = Physics;

    var Game = function () {

        this.$viewport = $('#viewport');
        $window = $(window);
        this.viewportWidth = $window.width();
        this.viewportHeight = $window.height();

        this.shootingPosition = Physics.vector(this.viewportWidth / 2, this.viewportHeight - 115);

    }

    Game.prototype.start = function (text) {
        this.initText(text);
        this.finishedLetters = 0;

        this.initWorld();
        this.initPowerMeter();

        this.startTicker();

        this.loadNextLetter();

        this.powerMeter.show();
        this.allowInput();
    }

    Game.prototype.destroy = function () {
        Physics.util.ticker.stop();
        Physics.util.ticker.off(this.animateLoop);

      //  _.delay(function () {
            if (this.world) {
                this.world.destroy();
            }

            this.stopInput();

            this.world = this.input = this.powerMeter = this.text = this.behaviors = this.collections = this.fireAllowed = this.shootingAngle =
                this.currentLetter = this.nextLetter = this.finishedLetters = this.animateLoop = undefined;

            // Remove all DOM elements that we did not create.
            this.$viewport.children().not('#power-meter, #chamber-separator').remove();
    //    }.bind(this));
    }

    Game.prototype.startTicker = function () {
        this.animateLoop = function(time) {
            TWEEN.update();
            this.world.step(time);
            this.powerMeter.render();

        }.bind(this);

        // Subscribe to ticker to advance the game forward.
        Physics.util.ticker.on(this.animateLoop);

        // Start the ticker!
        Physics.util.ticker.start();
    }

    Game.prototype.initText = function (text) {
        this.text = {};
        this.text.words = text.split(" ").map(function (word) {
            chars = word.split("").map(function (char) {
                return char.toUpperCase();
            });

            return chars;
        });

        this.text.letters = _.flatten(this.text.words);
    }

    Game.prototype.initWorld = function () {
        this.world = Physics.world({
            timestep: 1000.0 / 160,
            maxIPF: 16,
            integrator: 'verlet'
        });

        this.initRenderer();
        this.initBehaviors();
        this.initCollections();

        this.world.on('step', function () {
            this.world.render();
        }.bind(this));
    }

    Game.prototype.initRenderer = function () {
        var renderer = Physics.renderer('canvas', {
            el: 'viewport',
            width: this.viewportWidth,
            height: this.viewportHeight,
            // meta: true
        });

        this.world.add(renderer);

        return this;
    }

    Game.prototype.initBehaviors = function () {
        this.behaviors = {};

        var viewportBounds = Physics.aabb(0, 0, this.viewportWidth, this.viewportHeight);
        this.behaviors.edgeCollision = Physics.behavior('edge-collision-detection', {
            channel: 'collisions-edge:detected',
            aabb: viewportBounds,
            restitution: 0.7,
            cof: 1
        }).applyTo(null);

        this.behaviors.edgeImpulseResponse = Physics.behavior('body-impulse-response', {
                check: this.behaviors.edgeCollision.options.channel
        });

        this.behaviors.targetCollision = Physics.behavior('body-collision-detection', {
            check: true,
            channel: 'target-collisions:detected'
        }).applyTo(null);

        this.behaviors.letterCollision = Physics.behavior('body-collision-detection', {
            check: true,
            channel: 'bullet-collisions:detected'
        }).applyTo(null);

        this.behaviors.letterImpulseResponse = Physics.behavior('body-impulse-response', {
            check: this.behaviors.letterCollision.options.channel
        });

        this.initTargetLandingBehavior();

        this.world.add(_.values(this.behaviors));
    }

    Game.prototype.initTargetLandingBehavior = function () {
        this.behaviors.targetLanding = Physics.behavior('target-landing', {
            check: 'target-collisions:detected',
            target: 'target',
            lander: 'letter'
        });

        this.world.on('landing:finished', this.verifyLanding, this);
    }

    Game.prototype.initCollections = function () {
        this.collections = {}

        this.collections.targets = new Collection(this.getTargets(), [this.behaviors.targetCollision]);
        this.collections.letters = new Collection(this.getLetters());
        this.collections.magazine = Collection.copy(this.collections.letters).shuffle();
        this.collections.inair = new Collection()
            .attachBehavior(this.behaviors.edgeCollision)
            .attachBehavior(this.behaviors.targetCollision);

        this.world.add(this.collections.targets.all());
    }

    Game.prototype.getTargets = function () {
        var targetSize = 100;
        var letterMargin = 30;
        var lineMargin = 20;
        var startPoint = new Point(50, 50);
        var targets = [];

        this.text.words.forEach(function (word, wordIndex) {
            var wordWidth = ((targetSize + letterMargin) * word.length) - letterMargin;
            var x = this.viewportWidth / 2 - wordWidth / 2;

            var lineStartPoint = new Point(x, startPoint.y + (lineMargin + targetSize) * wordIndex);

            word.forEach(function (letter, letterIndex) {
                var targetPosition = new Point(lineStartPoint.x + (letterMargin + targetSize) * letterIndex, lineStartPoint.y);

                var target = Physics.body('rectangle', {
                   x: targetPosition.x + targetSize / 2,
                   y: targetPosition.y + targetSize / 2,
                   width: targetSize,
                   height: targetSize,
                   treatment: 'static',
                   char: letter,
                   label: 'target',
                   view: this.getTargetImage(letter, targetSize)
                });

                targets.push(target);
            }, this);
        }, this);

        return targets;
    }

    Game.prototype.getLetters = function () {
        var letterSize = 80;

        var letters = this.text.letters.map(function (letter, index) {
            return Physics.body('circle', {
                'size': letterSize,
                'radius': letterSize / 2,
                'char': letter,
                'label': 'letter',
                'hitTarget': false,
                'target': null,
                'view': this.getLetterImage(letter, letterSize)
            });
        }, this);

        return letters;
    }

    Game.prototype.checkWinningStatus = function () {
        var won = this.finishedLetters == this.text.letters.length;

        if (!won) {
            return;
        }

        // User won, start winning sequence!
        this.startWinningSequence();
    }

    Game.prototype.startWinningSequence = function () {
        // Hide power meter and magazine graphics.
        _.delay(function () {
            this.powerMeter.fadeOut();
            $('#chamber-separator').fadeOut();
        }.bind(this), 500)

        // Fly all targets and letters out of the screen
        _.delay(function () {
            this.collections.letters.all().forEach(function (letter) {
                letter.treatment = 'static';
                letter.target.treatment = 'static';

                var pos = this.getRandomPosOutOfScreen();

                var flyTween = new TWEEN.Tween({x: letter.state.pos.get(0), y: letter.state.pos.get(1)})
                    .to({x: pos.x, y: pos.y}, 1500)
                    .easing(TWEEN.Easing.Elastic.In)
                    .onUpdate(function () {
                        letter.state.pos.set(this.x, this.y);
                        letter.target.state.pos.set(this.x, this.y);
                    })
                    .onComplete(function () {
                        this.showWinningText();
                    }.bind(this))
                    .start();
            }, this);
        }.bind(this), 1000);
    }

    Game.prototype.showWinningText = function () {
        var $winBanner = $('.win-banner');


        _.delay(function () {
            $winBanner.addClass('active');
        }, 1000);

        $winBanner.find('.start-button').one('click', function () {
            var text = $winBanner.find('input').val() || "You Gotta Love Frontend";
            $winBanner.removeClass('active');

            this.destroy();
            this.start(text);
        }.bind(this));
    }

    Game.prototype.getRandomPosOutOfScreen = function () {
        var x, y,
            minX = -200,
            maxX = this.viewportWidth + 200,
            minY = -200,
            maxY = this.viewportHeight + 200;
            direction = _.random(1, 4);

        switch (direction) {
            // Top
            case 1:
                x = _.random(minX, maxX);
                y = minY;
                break;
            // Bottom
            case 2:
                x = _.random(minX, maxX);
                y = maxY;
                break;
            // Left
            case 3:
                x = minX
                y = _.random(minY, maxY);
                break;
            // Right
            case 4:
                x = maxX
                y = _.random(minY, maxY);
                break;
        }

        return {
            'x': x,
            'y': y
        };
    }

    Game.prototype.verifyLanding = function (data) {
        var target = data.target;
        var letter = data.lander;

        this.collections.inair.remove(letter);

        if (letter.char === target.char) {
            this.handleSuccessfulLanding(target, letter);
        } else {
            this.handleFailedLanding(target, letter);
        }
    }

    Game.prototype.handleSuccessfulLanding = function (target, letter) {
        var color = 'rgba(0, 255, 0, 0.8)';

        letter.view = this.getLetterImage(letter.char, letter.size, color);

        this.finishedLetters++;

        _.delay(function () {
            this.checkWinningStatus();
        }.bind(this));
    }

    Game.prototype.handleFailedLanding = function (target, letter) {
        var color = 'rgba(255, 0, 0, 0.5)';

        letter.treatment = 'static';
        letter.view = this.getLetterImage(letter.char, letter.size, color);

        var wiggleTween = new TWEEN.Tween({x: letter.state.pos.get(0)})
            .to({
                x: Util.getInterpolatedPointArray(letter.state.pos.get(0), 20)
            }, 125)
            .repeat(2)
            .onUpdate(function () {
                letter.state.pos.set(this.x, letter.state.pos.get(1));
            })
            .easing(TWEEN.Easing.Cubic.InOut)

        var fallTween = new TWEEN.Tween({y: letter.state.pos.get(1)})
            .to({y: this.viewportHeight + letter.size}, 1000)
            .delay(500)
            .onStart(function () {
                target.occupied = false;
                letter.target = null;
                letter.view = this.getLetterImage(letter.char, letter.size, 'rgba(255, 255, 255, 0.5)');
            }.bind(this))
            .onUpdate(function () {
                letter.state.pos.set(letter.state.pos.get(0), this.y);
            })
            .onComplete(function () {
                letter.view = this.getLetterImage(letter.char, letter.size, 'rgb(255, 255, 255)');
                this.collections.magazine.add(letter);

                if (!this.fireAllowed) {
                    this.commenceFire();
                }
            }.bind(this))

        wiggleTween.chain(fallTween);

        _.delay(function () {
            wiggleTween.start()
        }, 500);
    }

    Game.prototype.ceaseFire = function () {
        this.stopInput();
        this.powerMeter.hide();
        this.fireAllowed = false;
    }

    Game.prototype.commenceFire = function () {
        this.allowInput();
        this.powerMeter.show();
        this.fireAllowed = true;

        if (!this.currentLetter && !this.collections.magazine.isEmpty()) {
            this.loadNextLetter();
        }
    }

    Game.prototype.loadNextLetter = function () {
        // Cease fire and don't load letter if there are no more letters in the magazine and there is no next letter to load.
        if (this.collections.magazine.isEmpty() && !this.nextLetter) {
            this.currentLetter = null;
            this.ceaseFire();
            return;
        }

        // Get the next letter from the magazine if we don't have a next one yet (first load).
        if (!this.nextLetter) {
            this.nextLetter = this.collections.magazine.shift();
        }

        this.currentLetter = this.nextLetter;
        this.nextLetter = this.collections.magazine.shift();

        this.prepareLetterForShooting(this.currentLetter);
        this.prepareNextLetter(this.nextLetter);

        this.world.add([this.currentLetter, this.nextLetter]);
    }

    Game.prototype.prepareLetterForShooting = function (letter) {
        if (!letter) {
            return;
        }

        letter.treatment = 'static';
        letter.state.pos = this.shootingPosition.clone();
        letter.state.angular.pos = this.shootingAngle;
    }

    Game.prototype.prepareNextLetter = function (nextLetter) {
        if (!nextLetter) {
            return;
        }

        nextLetter.treatment = 'static';
        nextLetter.state.pos = this.shootingPosition.clone().add(0, nextLetter.size);
    }

    Game.prototype.allowInput = function () {
        if (this.input) {
            this.input.stop();
        }

        this.input = new Input({
            el: 'viewport',
            prepareShot: this.prepareShot.bind(this),
            aim: this.aim.bind(this),
            shoot: this.shoot.bind(this)
        });
        this.input.listen();
    }

    Game.prototype.stopInput = function () {
        if (this.input) {
            this.input.stop();
        }

        return;
    }

    Game.prototype.prepareShot = function (pos) {
        if (this.powerMeterTween) {
            this.powerMeterTween.stop();
        }

        this.setShootingAngle(pos);

        this.powerMeterTween = this.createPowerMeterTween(this.minPower, 100, 750)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    Game.prototype.aim = function (pos) {
        this.setShootingAngle(pos);
    }

    Game.prototype.finishShot = function () {
        this.powerMeterTween.stop();

        var power = this.powerMeter.getPower();

        // Tween Power Meter back to zero.
        this.powerMeterTween = this.createPowerMeterTween(this.powerMeter.getPower(), this.minPower, 100).start();
    }

    Game.prototype.shoot = function (currentPos) {
        var damper = 4;
        var power = this.powerMeter.getPower();
        var strength = power / (100 * damper);
        var acceleration = currentPos.vsub(this.shootingPosition).normalize().mult(strength);

        /* Shoot letter to the air and add it to the in-air collection */
        this.currentLetter.treatment = 'dynamic';
        this.currentLetter.accelerate(acceleration);
        this.collections.inair.add(this.currentLetter);
        this.watchForStrayLetters(this.currentLetter);

        this.loadNextLetter();

        // Tween Power Meter back to zero.
        this.powerMeterTween.stop();
        this.powerMeterTween = this.createPowerMeterTween(this.powerMeter.getPower(), this.minPower, 150).start();
    }

    Game.prototype.setShootingAngle = function (mousePos) {
        this.shootingAngle = mousePos.vsub(this.shootingPosition).angle() + Math.PI / 2;

        this.powerMeter.setRotation(this.shootingAngle);
        this.currentLetter.state.angular.pos = this.shootingAngle;
    }

    Game.prototype.createPowerMeterTween = function (fromPower, toPower, duration) {
        var powerMeter = this.powerMeter;

        return new TWEEN.Tween({power: fromPower})
            .to({power: toPower}, duration)
            .onUpdate(function () {
                powerMeter.setPower(this.power);
            })
            .easing(TWEEN.Easing.Sinusoidal.InOut);
    }

    Game.prototype.initPowerMeter = function () {
        this.minPower = 5;

        this.powerMeter = new PowerMeter({
            el: 'power-meter'
        })
        .setPower(this.minPower)
        .position(this.shootingPosition.values())
        .hide();
    }

    Game.prototype.watchForStrayLetters = function (letter) {
        if (letter.target || !this.collections.inair.has(letter)) {
            return;
        }

        _.delay(function () {
            if (letter.target || !this.collections.inair.has(letter)) {
                return;
            }

            this.handleFailedLanding({}, letter);
        }.bind(this), 8000)
    }

    Game.prototype.getLetterImage = function (letter, letterSize, color) {
        color = color || 'white';

        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = letterSize;
        var ctx = canvas.getContext('2d');
        ctx.font = '64px Futura-pt';
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(letter.toUpperCase(), letterSize / 2, letterSize / 2);

        var image = new Image();
        image.src = canvas.toDataURL();

        return image;
    }

    Game.prototype.getTargetImage = function (letter, targetSize) {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = targetSize;
        var ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Letter
        ctx.font = '64px Futura-pt';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(letter.toUpperCase(), targetSize / 2, targetSize / 2);

        var image = new Image();
        image.src = canvas.toDataURL();

        return image;
    }

    /**
     * Point class
     */

    var Point = function (x, y) {
        this.x = x;
        this.y = y;
    }

    return Game;
});

