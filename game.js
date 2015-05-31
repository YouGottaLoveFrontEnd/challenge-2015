var Game = function () {

}

Game.prototype.start = function () {
    this.initText("YOU GOTTA LOVE FRONTEND");
    this.initTargets();
    this.renderTargets();
    this.initBullets();
    this.renderBullets();
}

Game.prototype.initText = function (text) {
    this.words = text.split(" ").map(function (word) {
        letters = word.split("").map(function (letter) {
           return new Letter(letter);
        });

        return new Word(letters);
    });
}

Game.prototype.initTargets = function () {
    var letterSpacing = 130;
    var lineSpacing = 120;

    var startPoint = new Point(50, 50);

    targets = [];

    this.words.forEach(function (word, wordIndex) {
        var lineStartPoint = new Point(startPoint.x, startPoint.y + lineSpacing * wordIndex);

        word.letters.forEach(function (letter, letterIndex) {
            target = new Target();
            target.position = new Point(lineStartPoint.x + letterSpacing * letterIndex, lineStartPoint.y);
            target.letter = letter;
            targets.push(target);
        });
    });

    this.targets = targets;
}

Game.prototype.renderTargets = function () {
    this.targets.forEach(function (target) {
        $('<div class="target"><span class="target-letter">' + target.letter.char + '</span</div>').css({
            left: target.position.x,
            top: target.position.y
        }).appendTo('#container');
    });
}

Game.prototype.initBullets = function () {
    bullets = [];

    this.words.forEach(function (word) {
        bullets = bullets.concat(word.letters);
    })

    this.bullets = _.shuffle(bullets);
}

Game.prototype.renderBullets = function () {
    $('<div class="bullet">' + this.bullets[0].char + '</div>').appendTo('#container');
}

var Letter = function (char) {
    this.char = char;
}



var Word = function (letters) {
    this.letters = letters;
}



var Line = function (words) {
    this.words = words;
}



var Target = function () {

}

var Point = function (x, y) {
    this.x = x;
    this.y = y;
}
