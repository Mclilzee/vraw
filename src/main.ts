import './style.css'
import { Board as Board } from './board';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';
import handleCommandInput from './handleCommandInput';

let comandMode = false;
const ROWS = 40;
const COLUMNS = 40;
const board = new Board(ROWS, COLUMNS);
const modeSwitchingKeys = ["Enter", "Escape"];

document.addEventListener("keydown", (e) => {
    e.preventDefault();

    if (!comandMode && e.key === ":") {
        comandMode = true;
        handleCommandInput(e);
    } else if (comandMode && modeSwitchingKeys.includes(e.key)) {
        handleCommandInput(e);
        comandMode = false;
        handleNormalInput(e);
    } else if (comandMode) {
        handleCommandInput(e);
    } else {
        handleNormalInput(e);
    }
});

renderBoard(board);
renderStatusInfo(board.cursor.getCursorLineInfo(), "orange");
export { board }
