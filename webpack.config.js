/*'use strict';

var webpack = require('webpack');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }

    return sources;
}

module.exports = {
    entry: './src/app.js',/!*{
        app: getEntrySources([
            './src/app.js'
        ])
    },*!/
    output: {
        publicPath: 'http://localhost:8080/',
        filename: 'public/app.js'
    },
    /!*resolve: {
        // you can now require('file') instead of require('file.jsx')
        extensions: ['', '.js', '.json', '.jsx']
    },*!/
    loaders: [
        {
            test: /\.jsx?$/,
            loader: ['react-hot', 'jsx?harmony', 'babel-loader'],
            exclude: /node_modules/
        }
    ]
};*/

var path = require('path');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        /*sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');*/
    }

    return sources;
}

module.exports = {
    entry: {
        app: getEntrySources([
            './src/app.js'
        ])
    },
    output: {
        publicPath: 'http://localhost:8080/',
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {
        modulesDirectories: [
            'shared',
            'node_modules',
            'config'
        ],
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'src'),
                loader: 'babel-loader' }
        ]
    }
};
