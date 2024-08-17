import './style.css'
import { Board as Board } from './board';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';

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
export { board }
