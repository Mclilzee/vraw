import './style.css'
import { Board as Board } from './board';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';
import handleCommandInput from './handleCommandInput';

let comandMode = false;
const ROWS = 40;
const COLUMNS = 40;
const board = new Board(ROWS, COLUMNS);

document.addEventListener("keydown", (e) => {
    e.preventDefault();

    if (e.key === ":" && !comandMode) {
        comandMode = true;
        handleCommandInput(e);
    } else if (e.key === "\n" && comandMode) {
        comandMode = false;
        handleCommandInput(e);
    } else if (comandMode) {
        handleCommandInput(e);
    } else {
        handleNormalInput(e);
    }
});

renderBoard(board);
renderStatusInfo(board.cursor.getCursorLineInfo(), "orange");
export { board }
