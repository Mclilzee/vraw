import './style.css'
import { DrawingBoard } from './drawingBoard';
import { renderBoard, renderStatusInfo } from "./render";
import handleNormalInput from './normalInputHandler';

export enum InputMode {
  Normal,
  Command
}

const currentInputMode = InputMode.Normal;
const ROWS = 40;
const COLUMNS = 40;
const board = new DrawingBoard(ROWS, COLUMNS);
const cursor = board.cursor;

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (currentInputMode === InputMode.Normal) {
    handleNormalInput(e);
  }
});

renderBoard(board);
renderStatusInfo(cursor.getCursorLineInfo(), "orange");
export { board, cursor }
