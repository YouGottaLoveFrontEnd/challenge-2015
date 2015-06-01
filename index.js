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

    createjs.Sound.initializeDefaultPlugins();
    var SOUNDS = {
        WIN: 'audio/Game-Win.ogg',
        SHOOT: 'audio/Game-Shot.ogg',
        ANSWER_GOOD: 'audio/Game-Spawn.ogg',
        ANSWER_BAD: 'audio/Game-Bad.ogg'
    }
    for (var key in SOUNDS) createjs.Sound.registerSound(SOUNDS[key]);


    var $doc = $(this), $spaceShip = $('.spaceship'), spacePos = 50, _won;

    var _sendFire = function () {
        var fire = $('<div/>').addClass('fireball').appendTo('body');
        setTimeout(function () {
            createjs.Sound.play(SOUNDS.SHOOT);
            fire.css({ 'top': 0, 'left': spacePos + '%', 'width': 50, 'height': 50, 'margin-top': -77 });
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

    var $keys = $('.instructions .keys span'), keyMaps = { 32: 1, 37: 2, 39: 3 };
    $doc.on('keydown', function (e) {
        if (_won) return;
        if (e.keyCode == 32) _sendFire();
        if (e.keyCode == 37) _moveSpaceShip(-1);
        if (e.keyCode == 39) _moveSpaceShip(1);
        if (e.keyCode && keyMaps[e.keyCode])
            TweenMax.staggerFromTo($keys.eq(keyMaps[e.keyCode] - 1), 0.4, { 'background-color': 'rgba(0, 208, 157,1)' }, { 'background-color': 'rgba(255, 255, 255, 0.8)' }, 0);
    });

    $doc.on('keyup', function (e) { clearTimeout(_spaceShipTimeout); _spaceShipTimeout = null });

    var wrongLetters = ['b', 'h', 'j', 'k'];
    var currentLetter, $letters = $('.logo span'), $letter, letterTimeout, letterClearTimeout, letterPos = 50;


    var _winGame = function () {
        //TweenMax.staggerFromTo($spaceShip, 2, { bottom: '0%' }, { bottom: '100%' }, 0, function () {
        createjs.Sound.play(SOUNDS.WIN);
        $('body').addClass('success');
        _won = true;
        TweenMax.staggerFromTo($letters, 0.2, { autoAlpha: 0, scale: 7, x: Random(-1000, 1000), y: Random(-1000, 1000) }, { autoAlpha: 1, scale: 1, x: 0, y: 0 }, 0.1);
        //});
    }


    var _answer = function (correct) {
        createjs.Sound.play(correct ? SOUNDS.ANSWER_GOOD : SOUNDS.ANSWER_BAD);
        if (letterClearTimeout) clearTimeout(letterClearTimeout);
        if (correct) {
            TweenMax.staggerFromTo($letter, 0.4, { autoAlpha: 1, scale: 1, }, { autoAlpha: 0, scale: 5 }, 0.2, function () {
                TweenMax.staggerFromTo(currentLetter.addClass('active'), 0.4, { autoAlpha: 0, scale: 7, x: Random(-1000, 1000), y: Random(-1000, 1000) }, { autoAlpha: 1, scale: 1, x: 0, y: 0 }, 0.2);
                _callDropLetter();
            });
        } else {
            var _letter = $letters.filter('.active').random().css({ 'color': '#ff0000' });
            TweenMax.staggerFromTo($letter, 0.4, { autoAlpha: 1, scale: 1, x: 0, y: 0 }, { autoAlpha: 0, scale: 5, x: Random(-1000, 1000), y: Random(-1000, 1000) }, 0.2, function () {
                _callDropLetter();
                TweenMax.staggerFromTo(_letter, 1, { autoAlpha: 1, scale: 1, x: 0, y: 0, 'color': '#ff0000' }, { autoAlpha: 0, scale: 5, x: Random(-1000, 1000), y: Random(-1000, 1000), 'color': '#ff0000' }, 0.2, function () {
                    _letter.attr('style', '').removeClass('active');
                });
            });
        }
    }

    var _setProgress = function () {
        $('.progressBar b').html($letters.filter('.active').length + '/' + $letters.length);
        $('.progressBar span').css({ 'width': (100 * $letters.filter('.active').length / $letters.length) + '%' });
    }

    var _checkForWin = function () {
        _setProgress();
        if (!($letters.not('.active').length)) {
            clearTimeout(letterTimeout);
            _winGame();
            return true;
        }
        return false;
    }

    var _clearLetter = function () {
        if ($letter) $letter.remove();
        $letter = null;
    }

    var _dropLetter = function () {
        if (_checkForWin()) return;
        if ($letter) {
            if (!letterTimeout) _callDropLetter();
            return;
        }
        if (Random() > 75) {
            currentLetter = $('<span/>').text(wrongLetters[Math.floor(Random(0, 4))]);
        } else {
            currentLetter = $letters.not('.active').random();
        }
        $letter = $('<div/>').addClass('letter').appendTo('body');
        setTimeout(function () {
            letterPos = Random();
            $letter.css({ 'background-image': 'url(letter/' + currentLetter.text().toLowerCase() + '.png)', 'bottom': 0, 'left': letterPos + '%', 'margin-left': (letterPos > 50 ? -1 : 1) * 50 });
            if (letterPos > 50) $letter.addClass('left');
            letterClearTimeout = setTimeout(function () {
                if ($letter) _callDropLetter();
            }, 3001);
        }, 50);

    }

    var _callDropLetter = function () {
        if (_checkForWin()) return;
        _clearLetter();
        if (letterTimeout) clearTimeout(letterTimeout);
        if (letterClearTimeout) clearTimeout(letterClearTimeout);
        letterTimeout = setTimeout(_dropLetter, 200);
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