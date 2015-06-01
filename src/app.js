"use strict";

import * as p from 'babel-core/polyfill'
import React from 'react';
import Tile from './components/Tile';
import * as constants from './constants/AppConstants';
import {addons} from 'react/addons';
import LogoStore from './stores/LogoStore';
import AppDispatcher from './dispatchers/AppDispatcher';

var getNextKey = function *() {
    let id = 0;
    while (true) {
        yield id++;
    }
};

var store = new LogoStore;
var dispatcher = new AppDispatcher;
dispatcher.register(store.performAction.bind(store));

//Scramble to start with
dispatcher.handleViewAction(constants.Actions.SCRAMBLE);

dispatcher.handleViewAction(constants.Actions.ORGANIZE);

function handleScramble() {
    dispatcher.handleViewAction(constants.Actions.SCRAMBLE);
}

function handleOrganize() {
    dispatcher.handleViewAction(constants.Actions.ORGANIZE);
}

class Logo extends React.Component {
    componentWillMount() {
        this.state = {
            logo: store.getState()
        };

        store.addChangeListener(this.adjust.bind(this));

    }

    componentWillUnmount() {
        store.removeChangeListener(this.adjust.bind(this));
    }

    adjust() {
        this.setState({logo: store.getState()});
    }

    render() {
        var ReactCSSTransitionGroup = addons.CSSTransitionGroup;
        var tiles = this.state.logo.map(function (rows, rowIndex) {
            let letters = rows.map(function(tile, columnIndex) {
                return <Tile row={rowIndex} column={columnIndex} dispatcher={dispatcher} value={tile.letter} style={tile.style} key={Logo.makeKey.next().value} type={tile.type} />;
            });
            return (
                <div>
                    <div key={Logo.makeKey.next().value}>
                        {letters}
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="div-center">
                    <button className="btn btn-default" onClick={handleScramble} > Scramble </button>
                    <button className="btn btn-default" onClick={handleOrganize} > Organize </button>
                    <p> Or click the tiles around the blank (White) tile to move them and organize the logo yourself </p>
                </div>
                <div className="logo" key={Logo.makeKey.next().value}>
                    <ReactCSSTransitionGroup transitionName="animate">
                        {tiles}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
}

Logo.makeKey = getNextKey();

React.render(<Logo />, document.getElementById('content'));

