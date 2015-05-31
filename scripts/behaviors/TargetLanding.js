define(['physicsjs', 'App/Util'], function (Physics, Util) {
    /**
     * `Physics.behavior('target-landing')`.
     *
     * Behavior that guides landing dynamic bodies on-top of fixed ones.
     *
     * Additional options include:
     * - acc: The acceleration vector (Vectorish). (default: `{ x: 0, y: 0.0004 }`)
     **/
    Physics.behavior('target-landing', function( parent ){

        var defaults = {
            check: 'target-collisions:detected',
            channel: 'landing',
            target: 'target',
            lander: 'lander',
            maxLandingVelocity: 0.7,
            minOverlap: 40
        };

        return {

            // extended
            init: function (options) {

                parent.init.call(this);
                this.options.defaults(defaults);
                this.options(options);

                this.collisionQuery = Physics.query({
                    $or: [
                        { bodyA: { label: this.options.target }, bodyB: { label: this.options.lander } },
                        { bodyA: { label: this.options.lander }, bodyB: { label: this.options.target } }
                    ]
                });
            },

            // extended
            connect: function (world) {
                world.on(this.options.check, this.respond, this);
            },

            // extended
            disconnect: function (world) {
                world.off(this.options.check, this.respond, this);
            },

            respond: function (data) {
                var lander, target;
                var collision = Physics.util.find(data.collisions, this.collisionQuery);

                if (!collision) {
                    return;
                }

                if (collision.bodyA.label == this.options.target) {
                    target = collision.bodyA;
                    lander = collision.bodyB;
                } else {
                    target = collision.bodyB;
                    lander = collision.bodyA;
                }

                if (target.occupied || lander.state.vel.norm() > this.options.maxLandingVelocity || collision.overlap < this.options.minOverlap) {
                    return;
                }

                var landerAngle = lander.state.angular.pos;
                var isRotatingClockwise = lander.state.angular.vel > 0;

                lander.hitTarget = true;
                lander.treatment = 'static';
                lander.state.angular.pos = lander.state.angular.vel = lander.state.angular.acc = 0;
                lander.state.old.angular = lander.state.angular;
                lander.target = target;

                target.occupied = true;

                this._world.emit(this.options.channel + ':started', {'target': target, 'lander': lander});

                var tween = new TWEEN.Tween({
                    x: lander.state.pos.get(0),
                    y: lander.state.pos.get(1),
                    ang: landerAngle
                }).to({
                    x: target.state.pos.get(0),
                    y: target.state.pos.get(1),
                    ang: isRotatingClockwise ? Util.nextBiggerMultiple(landerAngle, 2 * Math.PI) : Util.nextSmallerMultiple(landerAngle, 2 * Math.PI)
                }, 200)
                .onUpdate(function () {
                    lander.state.angular.pos = this.ang;
                    lander.state.pos.set(this.x, this.y);
                })
                .onComplete(function () {
                    lander.treatment = 'dynamic';
                    this._world.emit(this.options.channel + ':finished', {'target': target, 'lander': lander});
                }.bind(this))
                .start();
            }
        };
    });
});
