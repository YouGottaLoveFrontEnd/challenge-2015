define(['jquery'], function ($) {

    var PowerMeter = function (options) {
        var defaults = {
            power: 0,
            height: {
                min: 50,
                max: 250
            },
            tip: {
                min: {
                    width: 20,
                    height: 10,
                    margin: 5
                },
                max: {
                    width: 50,
                    height: 30,
                    margin: 5
                }
            },
            dash: [6, 2]
        }
        this.options = _.defaults(options, defaults);

        this.canvas = document.getElementById(options.el);

        if (!this.canvas || this.canvas.nodeName.toLowerCase() !== 'canvas') {
            throw 'options.el must be given and should be a canvas element.';
        }

        this.width = this.getMaxWidth();
        this.height = this.getMaxHeight();
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');

        this.setPower(this.options.power);
    }

    PowerMeter.prototype = {

        render: function () {
            if (this.shouldDraw) {
                this.draw();
            }

            if (this.shouldRotate) {
                this.rotate();
            }
        },

        draw: function () {
            var middleX, lineStartPoint, lineEndPoint,
                arrow = this.extrapolateArrowValues();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;

            if (this.options.dash) {
                this.ctx.setLineDash(this.options.dash);
            }

            this.ctx.beginPath();

            middleX = this.width / 2;
            lineStartPoint = {
                x: middleX,
                y: this.height - 1
            };
            lineEndPoint = {
                x: middleX,
                y: lineStartPoint.y - arrow.height + arrow.tip.height + arrow.tip.margin
            };

            this.ctx.moveTo(lineStartPoint.x, lineStartPoint.y);
            this.ctx.lineTo(lineEndPoint.x, lineEndPoint.y);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(middleX - arrow.tip.width / 2, lineEndPoint.y - arrow.tip.margin);
            this.ctx.lineTo(middleX + arrow.tip.width / 2, lineEndPoint.y - arrow.tip.margin);
            this.ctx.lineTo(middleX, lineEndPoint.y - arrow.tip.margin - arrow.tip.height);
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

            this.ctx.fill();

            this.shouldDraw = false;
        },

        rotate: function () {
            var transformString = 'rotate(' + this.rotation + 'rad)';

            this.canvas.style.webkitTransform = transformString;
            this.canvas.style.transform = transformString;
            this.shouldRotate = false;
        },

        extrapolateArrowValues: function () {
            var powerPercent = this.power / 100;

            return {
                height: Math.round(this.options.height.min + powerPercent * (this.options.height.max - this.options.height.min)),
                tip: {
                    width: Math.round(this.options.tip.min.width + powerPercent * (this.options.tip.max.width - this.options.tip.min.width)),
                    height: Math.round(this.options.tip.min.height + powerPercent * (this.options.tip.max.height - this.options.tip.min.height)),
                    margin: Math.round(this.options.tip.min.margin + powerPercent * (this.options.tip.max.margin - this.options.tip.min.margin)),
                }
            };
        },

        getPower: function () {
            return this.power;
        },

        setPower: function (power) {
            if (power < 0 || power > 100) {
                throw 'power has to be between 0 and 100.';
            }

            this.power = power;
            this.shouldDraw = true;

            return this;
        },

        shouldRender: function () {
            return this.shouldDraw || this.shouldRotate;
        },

        getMaxWidth: function () {
            return this.options.tip.max.width;
        },

        getMaxHeight: function () {
            return this.options.height.max;
        },

        show: function () {
            $(this.canvas).show();

            return this;
        },

        hide: function () {
            $(this.canvas).hide();

            return this;
        },

        fadeOut: function (duration, complete) {
            $(this.canvas).fadeOut(duration, complete);

            return this;
        },

        position: function (pos) {
            $(this.canvas).css({
                'top': pos.y - this.height,
                'left': pos.x - this.width / 2,
                'transform-origin': 'bottom center',
                '-webkit-transform-origin': 'bottom center'
            });

            return this;
        },

        setRotation: function (ang) {
            this.rotation = ang;
            this.shouldRotate = true;
        }
    }

    return PowerMeter;
});
