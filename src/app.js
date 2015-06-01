"use strict";

import * as p from 'babel-core/polyfill'
import React from 'react';
import Tile from './components/Tile';
import {TileType} from './constants/AppConstants';
import {CSSTransitionGroup} from 'react/addons';

var getNextKey = function *() {
    let id = 0;
    while (true) {
        yield id++;
    }
};

class Logo extends React.Component {
    componentWillMount() {
        this.state = {
            logo: [[
                {letter: 'y', style: "row1"},
                {letter: 'o', style: "row1"},
                {letter: 'u', style: "row1"},
                {letter: ' ', style: "row1", type: TileType.BLANK},
                {letter: ' ', style: "row1"},
                {letter: ' ', style: "row1"},
                {letter: ' ', style: "row1"},
                {letter: ' ', style: "row1"}
            ], [
                {letter: 'g', style: "row2"},
                {letter: 'o', style: "row2"},
                {letter: 't', style: "row2"},
                {letter: 't', style: "row2"},
                {letter: 'a', style: "row2"},
                {letter: ' ', style: "row2"},
                {letter: ' ', style: "row2"},
                {letter: ' ', style: "row2"}
            ], [
                {letter: 'l', style: "row3"},
                {letter: 'o', style: "row3"},
                {letter: 'v', style: "row3"},
                {letter: 'e', style: "row3"},
                {letter: ' ', style: "row3"},
                {letter: ' ', style: "row3"},
                {letter: ' ', style: "row3"},
                {letter: ' ', style: "row3"}
            ], [
                {letter: 'f', style: "row4"},
                {letter: 'r', style: "row4"},
                {letter: 'o', style: "row4"},
                {letter: 'n', style: "row4"},
                {letter: 't', style: "row4"},
                {letter: 'e', style: "row4"},
                {letter: 'n', style: "row4"},
                {letter: 'd', style: "row4"}
            ]]
        };
    }

    render() {
        var ReactCSSTransitionGroup = CSSTransitionGroup;
        var tiles = this.state.logo.map(function (rows) {
            let letters = rows.map(function(tile) {
                return <Tile value={tile.letter} style={tile.style} key={Logo.makeKey.next().value} type={tile.type} />;
            });
            return (
                <div key={Logo.makeKey.next().value}>
                    {letters}
                </div>
            );
        });

        return (
            <div className="logo" key={Logo.makeKey.next().value}>
                {tiles}
            </div>
        );
    }
}

Logo.makeKey = getNextKey();

React.render(<Logo />, document.getElementById('content'));