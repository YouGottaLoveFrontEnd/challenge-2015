import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {EventEmitter} from 'events';
import * as constants from '../constants/AppConstants'

const initialLogo = [[
    {letter: 'y', style: "row1"},
    {letter: 'o', style: "row1"},
    {letter: 'u', style: "row1"},
    {letter: ' ', style: "row1", type: constants.TileType.BLANK},
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

let logo = initialLogo;

var actions= [];

var blankTile = {row: 0, column: 3};

const MAX_ROW = 3;
const MAX_COLUMN = 7;

const MOVE_UP = 1;
const MOVE_DOWN = 2;
const MOVE_LEFT = 3;
const MOVE_RIGHT = 4;


function swap(row1, column1, row2, column2) {
    let tempTile = logo[row1][column1];
    logo[row1][column1] = logo[row2][column2];
    logo[row2][column2] = tempTile;
}

function getNextMove() {
    return Math.floor(Math.random() * 11) + 1;
}

function scramble() {
    logo = initialLogo;
    actions = [];
    blankTile = {row: 0, column: 3};
    let tile = logo[0][3];
    tile.type = constants.TileType.BLANK;
    for(var i=0; i< 100; i++) {
        switch(getNextMove()) {
            case MOVE_LEFT:
            case 8:
            case 9:
                if (blankTile.column > 0 && moveTile({row: blankTile.row, column: blankTile.column - 1})) {
                    blankTile.column--;
                    actions.push(MOVE_RIGHT);
                }
                break;
            case MOVE_RIGHT:
            case 5:
            case 6:
                if (blankTile.column < MAX_COLUMN && moveTile({row: blankTile.row, column: blankTile.column + 1})) {
                    blankTile.column++;
                    actions.push(MOVE_LEFT);
                }
                break;
            case MOVE_UP:
            case 10:
            case 12:
                if (blankTile.row > 0 &&  moveTile({row: blankTile.row - 1, column: blankTile.column})) {
                    blankTile.row--;
                    actions.push(MOVE_DOWN);
                }
                break;
            case MOVE_DOWN:
            case 7:
            case 11:
                if (blankTile.row < MAX_ROW && moveTile({row: blankTile.row + 1, column: blankTile.column})) {
                    blankTile.row++;
                    actions.push(MOVE_UP);
                }
                break;
        }
    }
}

function organize() {
    switch(actions.pop()) {
        case MOVE_LEFT:
            moveTile({row: blankTile.row, column: blankTile.column - 1});
            blankTile.column--;
            break;
        case MOVE_RIGHT:
            moveTile({row: blankTile.row, column: blankTile.column + 1});
            blankTile.column++;
            break;
        case MOVE_UP:
            moveTile({row: blankTile.row - 1, column: blankTile.column});
            blankTile.row--;
            break;
        case MOVE_DOWN:
            moveTile({row: blankTile.row + 1, column: blankTile.column});
            blankTile.row++;
            break;
    }
}

function moveTile(source) {
    let hasMoved = 0;
    let row = source.row;
    let column = source.column;
    if(row < MAX_ROW && logo[row+1][column].type === constants.TileType.BLANK) {
        swap(row, column, row+1, column);
        hasMoved = MOVE_DOWN;
    }
    if(column < MAX_COLUMN && logo[row][column+1].type === constants.TileType.BLANK) {
        swap(row, column, row, column+1);
        hasMoved = MOVE_RIGHT;
    }
    if(row>0 && logo[row-1][column].type === constants.TileType.BLANK) {
        swap(row, column, row-1, column);
        hasMoved = MOVE_UP;
    }
    if(column > 0 && logo[row][column-1].type === constants.TileType.BLANK) {
        swap(row, column, row, column-1);
        hasMoved = MOVE_LEFT;
    }
    return hasMoved;
}

export default class LogoStore extends EventEmitter {

    getState() {
        return logo;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on('CHANGE', callback);
    }

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener('CHANGE', callback);
    }

    performAction(payload) {
        var action = payload.action;

        switch(action) {
            case constants.Actions.MOVE:
                var move = moveTile(payload.source);
                if (move) {
                    actions.push(move);
                    switch (move) {
                        case MOVE_DOWN:
                            blankTile.row--;
                            break;
                        case MOVE_UP:
                            blankTile.row++;
                            break;
                        case MOVE_LEFT:
                            blankTile.column++;
                            break;
                        case MOVE_RIGHT:
                            blankTile.column--;
                            break;
                    }
                    this.emitChange();
                }
                break;
            case constants.Actions.SCRAMBLE:
                scramble();
                this.emitChange();
                break;
            case constants.Actions.ORGANIZE:
                let that = this;
                let intervalId = setInterval(function() {
                    if (actions.length > 0) {
                        organize();
                        that.emitChange();
                    } else {
                        let tile = logo[0][3];
                        tile.type = constants.TileType.LETTER;
                        that.emitChange();
                        clearInterval(intervalId);
                    }
                }, 200);
                break;
        }

        return true; // No errors. Needed by promise in Dispatcher.
    }
}