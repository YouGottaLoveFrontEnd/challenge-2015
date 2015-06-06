"use strict";

import React from 'react';
import Logo from './components/Logo';
import Controls from './components/Controls';
import * as constants from './constants/AppConstants';
import LogoStore from './stores/LogoStore';
import AppDispatcher from './dispatchers/AppDispatcher';

var dispatcher = new AppDispatcher;
var store = new LogoStore(dispatcher);
//Scramble to start with
dispatcher.handleViewAction(constants.Actions.SCRAMBLE);
dispatcher.handleViewAction(constants.Actions.ORGANIZE);

class App extends React.Component {
    render() {
        return (
            <div>
                <Controls dispatcher={dispatcher} store={store}/>
                <Logo dispatcher={dispatcher} store={store}/>
            </div>
        );
    }
}

React.render(<App/>, document.getElementById('content'));
