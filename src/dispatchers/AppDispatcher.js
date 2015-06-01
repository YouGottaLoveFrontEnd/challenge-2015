import {Dispatcher} from 'flux';

export default class AppDispatcher extends Dispatcher {

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.
     * @param action
     * @param source
     */
    handleViewAction(action, source) {
        this.dispatch({
            action: action,
            source: source
        })
    }
}