/**
 * Created by nikhilbaradwaj on 5/28/15.
 */
import {TileType} from '../constants/AppConstants';
import React from 'react';

export default class Tile extends React.Component {
    getStyle() {
        var style = "letter";
        if (this.props.type === TileType.BLANK) {
            style += " blank";
        } else {
            style = "letter " + this.props.style;
        }
        return style;
    }

    handleClick(evt) {

    }

    render () {
        var html;
        if (this.props.value === " ") {
            html = <div className={this.getStyle()} onclick={this.handleClick} dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
        } else {
            html = <div className={this.getStyle()} onclick={this.handleClick}> {this.props.value} </div>
        }
        return html;
    }
}
