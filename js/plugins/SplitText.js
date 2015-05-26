/**
 * Created by Dima on 24/05/2015.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.amdWeb = factory();
    }
}(this, function () {
    function SplitText(element, options) {
        this.element = this.getElement(element);
        if (!this.element) {
            throw 'You should provide element or element selector'
        }
        this.originalHTML = this.element.innerHTML || '';
        this.originalText = this.element.innerText || '';
        this.chars = [];
        this.lines = [];
        this.words = [];
        this.options = options;
        this.split();
    }

    SplitText.htmlBlockTemplate = '<div style="position:relative;display:block;text-align:start"></div>';
    SplitText.htmlInlineTemplate = '<div style="position:relative;display:inline-block;"></div>';

    SplitText.prototype.getElement = function (elemOrSelector) {
        if (!elemOrSelector) {
            return null;
        }
        if (typeof elemOrSelector === 'string') {
            return document.querySelector(elemOrSelector);
        } else if (elemOrSelector instanceof HTMLElement) {
            return elemOrSelector;
        }
    };

    SplitText.prototype.createElementFromTemplate = function (htmlTemplate) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = htmlTemplate;
        return wrapper.children[0];
    };

    SplitText.prototype.wrapTextWithTemplate = function (innerText, htmlTemplate) {
        var wrapper = this.createElementFromTemplate(htmlTemplate);
        wrapper.innerText = innerText;
        return wrapper;
    };

    SplitText.prototype.appendChildren = function (targetElement, array, delimiter) {
        var fragment = document.createDocumentFragment();
        Array.prototype.forEach.call(array, function (element) {
            fragment.appendChild(element);
            if (delimiter && typeof delimiter === 'string') {
                fragment.appendChild(document.createTextNode(delimiter));
            }
        });
        targetElement.appendChild(fragment);
    };

    SplitText.prototype.split = function () {
        this.element.innerHTML = '';
        var splitByChars = this.options.type.indexOf('chars') > -1;
        var splitByWords = this.options.type.indexOf('words') > -1;
        var splitByLines = this.options.type.indexOf('lines') > -1;
        var lines = this.originalText.split('\n');
        lines.forEach(function (line) {
            var words = line.split(' ');
            var lineElement = this.wrapTextWithTemplate('', SplitText.htmlBlockTemplate);
            var wordElements = words.map(function (word) {
                var wordElement = this.wrapTextWithTemplate('', SplitText.htmlInlineTemplate);
                var charElements = Array.prototype.map.call(word, function (char) {
                    var charElement = this.wrapTextWithTemplate(char, SplitText.htmlInlineTemplate);
                    this.chars.push(charElement);
                    return charElement;
                }.bind(this));
                this.appendChildren(wordElement, charElements);
                this.words.push(wordElement);
                return wordElement;
            }.bind(this));
            this.appendChildren(lineElement, wordElements, ' ');
            this.lines.push(lineElement);
            return lineElement;
        }.bind(this));

        if ((!splitByChars && !splitByWords && !splitByLines) || (splitByChars && splitByWords && splitByLines)) {
            this.appendChildren(this.element, this.lines);
            return;
        }
        function switchInnerHtmlWithText(element) {
            element.innerHTML = element.innerText;
        }

        if (!splitByChars) {
            this.words.forEach(switchInnerHtmlWithText);
            this.chars = [];
            if (!splitByWords) {
                this.lines.forEach(switchInnerHtmlWithText);
                this.words = [];
                this.appendChildren(this.element, this.lines);
            } else if (!splitByLines) {
                this.lines = [];
                this.appendChildren(this.element, this.words, ' ');
            } else {
                this.appendChildren(this.element, this.lines);
            }
        } else {
            if (!splitByWords) {
                if (!splitByLines) {
                    var self = this;
                    self.lines.forEach(function (line) {
                        Array.prototype.forEach.call(line.children, function (word) {
                            self.appendChildren(self.element, Array.prototype.slice.call(word.children, 0));
                            self.element.appendChild(document.createTextNode(' '));
                        });
                        self.element.appendChild(document.createElement('br'));
                    });
                    self.lines = [];
                    self.words = [];
                } else {
                    this.lines.forEach(function (line) {
                        var words = line.children;
                        Array.prototype.forEach.call(words, function (word) {
                            line.innerHTML = '';
                            this.appendChildren(line, Array.prototype.slice.call(word.children, 0));
                        }.bind(this));
                    }.bind(this));
                    this.words = [];
                    this.appendChildren(this.element, this.lines);
                }
                this.words = [];
            } else {
                if (!splitByLines) {
                    this.lines = [];
                    this.appendChildren(this.element, this.words, ' ');
                }
            }
        }
    };

    SplitText.prototype.revert = function () {
        this.element.innerHTML = this.originalHTML;
        this.chars = [];
        this.words = [];
        this.lines = [];
    };

    return SplitText;
}));