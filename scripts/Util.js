define(['underscore'], function (_) {
    var Util = {
        nextBiggerMultiple: function(n, multiple) {
            return Math.ceil(n / multiple) * multiple;
        },

        nextSmallerMultiple: function(n, multiple) {
            return Math.floor(n / multiple) * multiple;
        },

        getInterpolatedPointArray: function (point, margin, randomStart) {
            var startFromEnd;

            if (randomStart) {
                startFromEnd = _.random(0, 1) == 0;
            }

            if (startFromEnd) {
                return [point + margin, point, point - margin, point];
            }

            return [point - margin, point, point + margin, point];

        }
    };

    return Util;
});
