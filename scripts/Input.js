define(['jquery', 'underscore', 'physicsjs'], function ($, _, Physics) {

    var Input = function (options) {
        var defaults = {
            el: null,
            prepareShot: null,
            aim: null,
            shoot: null
        };

        this.options = _.defaults(options, defaults);

        this.$el = $('#' + this.options.el);

        if (!this.$el) {
            throw 'options.el must be given and must be an existing DOM element.';
        }

        this.currentPos = Physics.vector();
        this.lastPos = Physics.vector();
    }


    Input.prototype.listen = function () {
        this.$el
            .on('mousedown.gameInput', this.mouseDown.bind(this))
            .on('mousemove.gameInput', this.mouseMove.bind(this))
            .on('mouseup.gameInput', this.mouseUp.bind(this));

        return this;
    }

    Input.prototype.stop = function () {
        this.$el.off('.gameInput');

        return this;
    }

    Input.prototype.mouseDown = function (e) {
        this.mousePressed = true;

        this.currentPos.clone(this.getMousePosition(e));
        this.lastPos.clone(this.currentPos);

        if (typeof this.options.prepareShot == 'function') {
            this.options.prepareShot(this.currentPos.clone());
        }
    }

    Input.prototype.mouseMove = function (e) {
        this.lastPos.clone(this.currentPos);
        this.currentPos.clone(this.getMousePosition(e));

        if (typeof this.options.aim == 'function') {
            this.options.aim(this.currentPos.clone());
        }
    }

    Input.prototype.mouseUp = function (e) {
        if (!this.mousePressed) {
            return;
        }

        this.mousePressed = false;

        if (typeof this.options.shoot == 'function') {
            this.options.shoot(this.currentPos.clone(), this.lastPos.clone());
        }
    }

    Input.prototype.getMousePosition = function (e) {
        var offset = this.$el.offset();

        return {
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
        };
    }


    return Input;
});
