function yglf() {

    function getRelativePosition(node, root) {
        var offsetTop = 0;
        var offsetLeft = 0;

        while (node !== root) {
            offsetTop += node.offsetTop;
            offsetLeft += node.offsetLeft;
            node = node.offsetParent;
        }

        return {
            top: offsetTop,
            left: offsetLeft
        };
    }

    function copyElement(node) {
        var tableNode = document.getElementById('table');
        var rect = getRelativePosition(node, tableNode);
        var newNode = document.createElement(node.tagName);
        newNode.className = 'copy copy_' + node.className;
        newNode.style.left = rect.left + 'px';
        newNode.style.top = rect.top + 'px';
        newNode.innerText = node.innerText;
        tableNode.appendChild(newNode);
        return newNode;
    }

    function addTrailingText(node, trailing) {
        var trailingNode = document.createElement('span');
        trailingNode.innerText = trailing;
        trailingNode.className = 'trailing';
        node.appendChild(trailingNode);
        setTimeout(function () {
            trailingNode.className += ' show';
        }, 1000);
    }

    function typeText(text, x, y, wait) {
        var char = text[0];
        var trailing = text.substr(1);
        var charNodes = document.getElementsByClassName('char_' + char);
        var randomChar = charNodes[_.random(0, charNodes.length - 1)];
        var copyOfRandomChar = copyElement(randomChar);
        setTimeout(function () {
            randomChar.parentNode.className += ' copied';
            randomChar.className += ' copied';
            copyOfRandomChar.className += ' moved';
            copyOfRandomChar.style.left = x + 'px';
            copyOfRandomChar.style.top = y + 'px';
            addTrailingText(copyOfRandomChar, trailing);
        }, wait);
    }

    function typeSentence(sentence, x, y, wait) {
        _.forEach(sentence.split(' '), function (word, index) {
            typeText(word, x, y + 50 * index, wait + 500 * index);
        });
    }

    document.getElementById('periodic').className = 'hidden';
    document.getElementById('about').className = 'shown';

    typeSentence('you gotta love frontend', 180, 10, 500);
}