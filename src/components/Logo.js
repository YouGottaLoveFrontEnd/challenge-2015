import * as p from 'babel-core/polyfill'
import React from 'react';
import Tile from '../components/Tile';
import * as constants from '../constants/AppConstants';
import {addons} from 'react/addons';

var getNextKey = function *() {
    let id = 0;
    while (true) {
        yield id++;
    }
};

export default class Logo extends React.Component {
    componentWillMount() {
        this.state = {
            logo: this.props.store.getState()
        };

        this.props.store.addChangeListener(this.adjust.bind(this));
        this.props.store.addOrganizeListener(this.adjust.bind(this));
        this.props.store.addScrambleListener(this.adjust.bind(this));

    }

    componentWillUnmount() {
        this.props.store.removeChangeListener(this.adjust.bind(this));
        this.props.store.removeOrganizeListener(this.adjust.bind(this));
        this.props.store.removeScrambleListener(this.adjust.bind(this));
    }

    adjust() {
        this.setState({logo: this.props.store.getState()});
    }

    render() {
        var that = this;
        var ReactCSSTransitionGroup = addons.CSSTransitionGroup;
        var tiles = this.state.logo.map(function (rows, rowIndex) {
            let letters = rows.map(function(tile, columnIndex) {
                return <Tile row={rowIndex} column={columnIndex} dispatcher={that.props.dispatcher} value={tile.letter} style={tile.style} key={Logo.makeKey.next().value} type={tile.type} />;
            });
            return (
                <div>
                    <div key={Logo.makeKey.next().value}>
                        <ReactCSSTransitionGroup transitionName="animate">
                            {letters}
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="logo" key={Logo.makeKey.next().value}>
                    {tiles}
                </div>
            </div>
        );
    }
}

Logo.makeKey = getNextKey();