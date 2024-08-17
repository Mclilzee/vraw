import './style.css'
import { Board as Board } from './drawingBoard';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';
import { Cursor } from './cursor';

export enum InputMode {
  Normal,
  Command
}

const currentInputMode = InputMode.Normal;
const ROWS = 40;
const COLUMNS = 40;
const board = new Board(ROWS, COLUMNS);
const cursor = new Cursor();

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (currentInputMode === InputMode.Normal) {
    handleNormalInput(e);
  }
});

renderBoard(board);
renderStatusInfo(cursor.getCursorLineInfo(), "orange");
export { board, cursor }
