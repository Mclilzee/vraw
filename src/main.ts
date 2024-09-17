import './style.css'
import { Board as Board } from './board';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';

enum InputMode {
    Normal,
    Command
}

let currentInputMode = InputMode.Normal;
const ROWS = 40;
const COLUMNS = 40;
const board = new Board(ROWS, COLUMNS);

document.addEventListener("keydown", (e) => {
    e.preventDefault();

    if (e.key === ":" && currentInputMode === InputMode.Normal) {
        currentInputMode = InputMode.Command;
    } else if (currentInputMode === InputMode.Normal) {
        handleNormalInput(e);
    }
});

renderBoard(board);
renderStatusInfo(board.cursor.getCursorLineInfo(), "orange");
export { board }
