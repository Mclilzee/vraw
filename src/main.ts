import './style.css'
import { Board as Board } from './board';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';

const CELL_DEFAULT_COLOR = "#a5a5a5";
const NORMAL_COLOR = "#00000080";
const VISUAL_COLOR = "#0000F080";
const CLEAR_COLOR = "#00000000";

export enum InputMode {
  Normal,
  Command
}

const currentInputMode = InputMode.Normal;
const ROWS = 40;
const COLUMNS = 40;
const board = new Board(ROWS, COLUMNS);

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (currentInputMode === InputMode.Normal) {
    handleNormalInput(e);
  }
});

renderBoard(board);
renderStatusInfo(board.cursor.getCursorLineInfo(), "orange");
export { board, CELL_DEFAULT_COLOR, NORMAL_COLOR, VISUAL_COLOR, CLEAR_COLOR }
