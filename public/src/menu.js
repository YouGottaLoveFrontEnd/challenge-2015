'use strict';



var yglf = yglf || {};


(function(yglf, createjs) {

    var menu = {};

    var buttonSize = 32 * window.devicePixelRatio;

    menu.setMenuPosition = function(isVertical) {

        var posX = 0;
        var posY = 0;
        if (isVertical) {
            yglf.menuButtons.forEach(function(button) {
                button.object.x = posX;
                button.object.y = posY;
                posY += buttonSize * 1.5;
            });
            yglf.menuContainer.x = 16;
            yglf.menuContainer.y = (yglf.canvas.height - (buttonSize * yglf.menuButtons.length)) / 2;
        } else {
            yglf.menuButtons.forEach(function(button) {
                button.object.x = posX;
                button.object.y = posY;
                posX += buttonSize * 1.5;
            });
            yglf.menuContainer.x = (yglf.canvas.width - (buttonSize * 1.5 * yglf.menuButtons.length)) / 2;
            yglf.menuContainer.y = yglf.canvas.height - (buttonSize * 1.5);
        }

    }

    menu.init = function() {

        yglf.menuContainer = new createjs.Container();

        yglf.menuButtons = [ {
            icon: '\uf43a',
            hoverIcon: '\uf43b',
            action: function() {
                yglf.intro.stop();
                yglf.customAnimation.stop();
                yglf.game.start();
            }
        },{
            icon: '\uf4b2',
            hoverIcon: '\uf4b3',
            action: function(event) {
                yglf.game.stop();
                yglf.customAnimation.stop();
                yglf.intro.start();
                event.target.text = '\uf4b3';
            }
        }];
        // {
        //     icon: '\uf459',
        //     hoverIcon: '\uf459',
        //     action: function() {
        //         yglf.game.stop();
        //         yglf.intro.stop();
        //         yglf.customAnimation.start()
        //     }
        // }

        var createButton = function(_button) {

            var button = new createjs.Text();
            _button.object = button;
            button.font = 'normal ' + buttonSize + 'px Ionicons';
            button.color = '#FFF';
            button.alpha = 0.5;
            button.text = _button.icon;

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill('#000').drawRect(0, 0, buttonSize, buttonSize);
            button.hitArea = hitArea;

            yglf.menuContainer.addChild(button);

            button.addEventListener('click', _button.action, false);

            button.addEventListener('mouseover', function() {
                button.alpha = 1;
                button.cursor = 'pointer';
                button.text = _button.hoverIcon;
                yglf.stage.update();
            });

            button.addEventListener('mouseout', function() {
                button.alpha = 0.5;
                button.text = _button.icon;
                yglf.stage.update();
            });

            yglf.stage.update();

        }

        yglf.menuButtons.forEach(createButton);

        yglf.stage.addChild(yglf.menuContainer);

    }

    yglf.menu = menu;

})(yglf, createjs);
