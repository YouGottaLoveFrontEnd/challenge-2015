$.fn.random = function () { return this.eq(Math.floor(Math.random() * this.length)); }
function Random(min, max) {
    min = min || 0;
    max = max || 100;
    return Math.random() * (max - min) + min;
}
window.requestAnimFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
$(document).on('ready', function () {
    var $doc = $(this), $spaceShip = $('.spaceship'), spacePos = 50;

    var _sendFire = function () {
        var fire = $('<div/>').addClass('fireball').appendTo('body');
        setTimeout(function () {
            fire.css({ 'top': 0, 'left': spacePos + '%', 'width': 50, 'height': 77, 'margin-top': -77 });
            setTimeout(function () {
                fire.remove();
            }, 1001);
        })
    }

    var _spaceShipTimeout;
    var _moveSpaceShip = function (direction) {
        if (_spaceShipTimeout) return;
        spacePos += direction * 3;
        spacePos = Math.min(spacePos, 100);
        spacePos = Math.max(spacePos, 0);
        $spaceShip.css({ 'left': spacePos + '%' });
        _spaceShipTimeout = setTimeout(function () { _spaceShipTimeout = null; _moveSpaceShip(direction) }, 100);
    }

    $doc.on('keydown', function (e) {
        if (e.keyCode == 32) _sendFire();
        if (e.keyCode == 37) _moveSpaceShip(-1);
        if (e.keyCode == 39) _moveSpaceShip(1);
    });

    $doc.on('keyup', function (e) { clearTimeout(_spaceShipTimeout); _spaceShipTimeout = null });

    var _winGame = function () {
        var fire = $('<div/>').addClass('fireball').css({ left: spacePos + '%', top: 'auto', bottom: 0 }).appendTo('body');
        $spaceShip.css({ bottom: 25 });
        TweenMax.staggerFromTo($('.fireball,.spaceship'), 2, { bottom: '0%' }, { bottom: '100%' }, 0, function () {
            $('body').addClass('success');
            TweenMax.staggerFromTo($letters, 0.2, { autoAlpha: 0, scale: 7, x: Random(-1000, 1000), y: Random(-1000, 1000) }, { autoAlpha: 1, scale: 1, x: 0, y: 0 }, 0.1);
        });
    }


    var _answer = function (correct) {
        TweenMax.staggerFromTo($letter, 0.4, { autoAlpha: 1, scale: 1, }, { autoAlpha: 0, scale: 5 }, 0.2, function () {
            if (correct)
                TweenMax.staggerFromTo(currentLetter.addClass('active'), 0.4, { autoAlpha: 0, scale: 7, x: Random(-1000, 1000), y: Random(-1000, 1000) }, { autoAlpha: 1, scale: 1, x: 0, y: 0 }, 0.2);

            $letter.remove();
            $letter = null;
            _callDropLetter();
        });
    }

    var wrongLetters = ['b', 'h', 'j', 'k'];
    var currentLetter, $letters = $('.logo span'), $letter, letterTimeout, letterClearTimeout, letterPos = 50;
    var _dropLetter = function () {
        if ($letter) {
            _callDropLetter();
            return;
        }
        if (Random() > 75) {
            currentLetter = $('<span/>').text(wrongLetters[Math.floor(Random(0, 4))]);
        } else {
            currentLetter = $letters.not('.active').random();
        }
        if (!(currentLetter && currentLetter.length)) {
            clearTimeout(letterTimeout);
            _winGame();
            return;
        }
        $letter = $('<div/>').addClass('letter').appendTo('body');
        setTimeout(function () {
            letterPos = Random();
            $letter.css({ 'background-image': 'url(letter/' + currentLetter.text() + '.png)', 'bottom': 0, 'left': letterPos + '%', 'margin-left': (letterPos > 50 ? -1 : 1) * 50 });
            if (letterPos > 50) $letter.addClass('left');
            letterClearTimeout = setTimeout(function () {
                if ($letter) _answer(false);
            }, 5001);
        }, 50);

    }

    var _callDropLetter = function () {
        if (letterTimeout) clearTimeout(letterTimeout);
        if (letterClearTimeout) clearTimeout(letterClearTimeout);
        letterClearTimeout
        letterTimeout = setTimeout(_dropLetter, 1000);
    }

    var _fireMeetLetter = function () {
        if ($letter) {
            var letter = $letter.position();
            letter.isleft = $letter.hasClass('left');
            $('.fireball').each(function () {
                var $this = $(this), pos = $this.position();
                if (Math.abs(letter.top - pos.top) <= 50 && Math.abs(letter.left - pos.left) - (letter.isleft ? 0 : 50) <= 100) {
                    $this.remove();
                    $letter.css($letter.position()).addClass('no_transition');
                    _answer(!!(currentLetter && currentLetter.parents('body').length));
                }
            });
        }
        window.requestAnimFrame(_fireMeetLetter);
    }

    window.requestAnimFrame(_fireMeetLetter);
    _callDropLetter();

});