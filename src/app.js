/**
 * Created by nikhilbaradwaj on 5/28/15.
 */

class Logo extends React.Component {

    componentWillMount() {
        this.state = {}
    }
    render() {
        return(
            <div class="logo">
            <div>
                <span class="letter row1"> Y </span>
                <span class="letter row1"> O </span>
                <span class="letter row1"> U </span>
                <span class="letter row1"> &nbsp; </span>
                <span class="letter row1"> &nbsp; </span>
                <span class="letter row1"> &nbsp; </span>
                <span class="letter row1"> &nbsp; </span>
                <span class="letter row1"> &nbsp; </span>
            </div>
            <div>
                <span class="letter row2"> G </span>
                <span class="letter row2"> O </span>
                <span class="letter row2"> T </span>
                <span class="letter row2"> T </span>
                <span class="letter row2"> A </span>
                <span class="letter row2"> &nbsp; </span>
                <span class="letter row2"> &nbsp; </span>
                <span class="letter row2"> &nbsp; </span>
            </div>
            <div>
                <span class="letter row3"> L </span>
                <span class="letter row3"> O </span>
                <span class="letter row3"> V </span>
                <span class="letter row3"> E </span>
                <span class="letter blank"> &nbsp; </span>
                <span class="letter row3"> &nbsp; </span>
                <span class="letter row3"> &nbsp; </span>
                <span class="letter row3"> &nbsp; </span>
            </div>
            <div>
                <span class="letter row4"> F </span>
                <span class="letter row4"> R </span>
                <span class="letter row4"> O </span>
                <span class="letter row4"> N </span>
                <span class="letter row4"> T </span>
                <span class="letter row4"> E </span>
                <span class="letter row4"> N </span>
                <span class="letter row4"> D </span>
            </div>
        </div>
        );
    }
}