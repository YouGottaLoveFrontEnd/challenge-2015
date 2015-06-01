import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {EventEmitter} from 'events';

let logo = [[
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
]];

export default class LogoStore extends EventEmitter {

    getState() {
        return logo;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb);
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }
}


AppDispatcher.register((payload) => {
    let action = payload.action;
    switch(action.type) {
        case HelloConstants.FETCHING:
            data = action.data;
            _HelloStore.emitChange();
            break;
        default:
            break;
    }
});