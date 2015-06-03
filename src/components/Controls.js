import React from 'react';
import * as constants from '../constants/AppConstants';

function handleScramble() {
    this.props.dispatcher.handleViewAction(constants.Actions.SCRAMBLE);
    this.setState({isScramble: false});
}

function handleOrganize() {
    this.props.dispatcher.handleViewAction(constants.Actions.ORGANIZE);
    this.setState({isScramble: true, disabled: true});
}

export default class Controls extends React.Component {
    componentWillMount() {
        this.state = {
            isScramble: true,
            disabled: true
        };
        this.props.store.addOrganizeListener(this.adjust.bind(this));

    }

    componentWillUnmount() {
        this.props.store.removeOrganizeListener(this.adjust.bind(this));
    }

    adjust() {
        this.setState({disabled: false});
    }

    render() {
        var caption;
        var handler;
        var description;
        if (this.state.isScramble) {
            caption = "Scramble";
            handler = handleScramble.bind(this);
            description = "";
        } else {
            caption = "Organize";
            handler = handleOrganize.bind(this);
            description = "Or click the tiles around the blank (White) tile to move them and organize the logo yourself";
        }
        var html;
        if (this.state.disabled) {
            html = <button className="btn btn-default" onClick={handler} disabled="true"> {caption} </button>
        } else {
            html = <button className="btn btn-default" onClick={handler}> {caption} </button>
        }
        return (
            <div>
                {html}
                <span style={{paddingLeft: 10 + 'px'}}>{description} </span>
            </div>
        )
    }
}
