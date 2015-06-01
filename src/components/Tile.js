/**
 * Created by nikhilbaradwaj on 5/28/15.
 */
import {tiletype} from '../constants/AppConstants';


export default class Tile extends React.Component {
    render () {
        var style = "letter";
        if (this.props.type === tileType.BLANK) {
            style += " blank";
        } else if (this.props.type === tiletype.LETTER) {
            style = style + " " + {this.props.style};
        }
        return (
            <span className={style}> {this.props.value} </span>
        );
    }
}
