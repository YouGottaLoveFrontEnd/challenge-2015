(function () {
    "use strict";

    require.config({
        baseUrl: "scripts",

        paths: {
            'App': '.', /* Creating a nice namespace for the app, without actually having to create a useless folder */
            'jquery': '../bower_components/jquery/dist/jquery.min',
            'underscore': '../bower_components/underscore/underscore-min',
            'WebFontLoader': '../bower_components/webfontloader/webfontloader',
            'tween' : '../bower_components/tweenjs/src/Tween'
        },

        packages: [
            {
                name: 'physicsjs',
                location: '../bower_components/physicsjs/dist',
                main: 'physicsjs-full.min'
            }
        ],
    });

    require(['App/Game', 'WebFontLoader'], function (Game, WebFontLoader) {
        var game = new Game();
        window.game = game;

        WebFontLoader.load({
            custom: {
                families: ['Futura-pt'],
                urls: ['/styles/futura-pt.css']
            },
            active: function () {
                game.start("YOU GOTTA LOVE FRONTEND");
            }
        })
    });
}());
