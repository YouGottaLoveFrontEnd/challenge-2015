define(['underscore'], function (_) {

    var Collection = function (items, behaviors) {
        this._items = [];
        this._behaviors = [];

        if (behaviors) {
            _.each(behaviors, function (behavior) {
                this.attachBehavior(behavior);
            }, this);
        }

        if (items) {
            _.each(items, function (items) {
                this.add(items);
            }, this);
        }
    }

    Collection.prototype.attachBehavior = function (behavior) {
        this._behaviors.push(behavior);

        return this;
    }

    Collection.prototype.applyToBehaviors = function () {
        this._behaviors.forEach(function (behavior) {
            // Apply the behaviors on all its existing bodies AND the bodies in this collection.
            behavior.applyTo(this._items.concat(behavior.getTargets()));
        }, this)

        return this;
    }

    Collection.prototype.add = function (item) {
        this._items.push(item);

        this.applyToBehaviors();

        return this;
    }

    Collection.prototype.remove = function (item) {
        this._items = _.without(this._items, item);
        this.applyToBehaviors();

        return this;
    }

    Collection.prototype.length = function () {
        return this._items.length;
    }

    Collection.prototype.isEmpty = function () {
        return this.length() == 0;
    }

    Collection.prototype.all = function () {
        return this._items;
    }

    Collection.prototype.has = function (item) {
        return _.indexOf(this._items, item) >= 0;
    }

    Collection.prototype.shift = function () {
        var item = this._items.shift();

        this.applyToBehaviors();

        return item;
    }

    Collection.prototype.unshift = function (item) {
        this._items.unshift(item);
        this.applyToBehaviors();

        return this.length();
    }

    Collection.prototype.shuffle = function () {
        this._items = _.shuffle(this._items);

        return this;
    }

    Collection.prototype.getBehaviors = function () {
        return this._behaviors;
    }

    /**
     * Static methods
     */

    Collection.copy = function (collection) {
        return new Collection(collection.all(), collection.getBehaviors());
    }

   return Collection;
});
