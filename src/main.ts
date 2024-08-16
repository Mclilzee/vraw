import './style.css'
import { DrawingBoard } from './drawingBoard';
import {renderBoard, renderStatusInfo} from "./render";

enum Engine {
  Input,
  Command
}

const currentEngine = Engine.Input;
const ROWS = 40;
const COLUMNS = 40;
const drawingBoard = new DrawingBoard(ROWS, COLUMNS);

renderBoard(drawingBoard);
renderStatusInfo(drawingBoard);
addEventListener("keydown", (e) => {
  e.preventDefault();
  if (currentEngine === Engine.Input) {
    if (e.key == "Control") {
      drawingBoard.controlHeld = true;
    } else {
      drawingBoard.handleInput(e.key);
      renderBoard(drawingBoard);
      renderStatusInfo(drawingBoard);
    }
  }
});

addEventListener("keyup", (e) => {
  if (e.key == "Control") {
    drawingBoard.controlHeld = false;
  }
});
