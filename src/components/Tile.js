/**
 * Created by nikhilbaradwaj on 5/28/15.
 */
import * as constants from '../constants/AppConstants';
import React from 'react';

export default class Tile extends React.Component {
    getStyle() {
        var style = "letter";
        if (this.props.type === constants.TileType.BLANK) {
            style += " blank";
        } else {
            style = "letter " + this.props.style;
        }
        return style;
    }

    handleClick() {
        this.props.dispatcher.handleViewAction(constants.Actions.MOVE, {row: this.props.row, column: this.props.column});
    }

    render () {
        var html;
        if (this.props.value === " ") {
            html = <div className={this.getStyle()} onClick={this.handleClick.bind(this)} dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
        } else {
            html = <div className={this.getStyle()} onClick={this.handleClick.bind(this)}> {this.props.value} </div>
        }
        return html;
    }
}
