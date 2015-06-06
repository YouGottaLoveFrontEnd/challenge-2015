var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

class LogoActions {
    move(source) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_CREATE,
            text: text
        });
    }
}

var TodoActions = {

    /**
     * @param  {string} text
     */
    create: function(text) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_CREATE,
            text: text
        });
    },

    /**
     * @param  {string} id
     */
    destroy: function(id) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_DESTROY,
            id: id
        });
    },

};

module.exports = TodoActions;