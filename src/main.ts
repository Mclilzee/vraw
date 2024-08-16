import './style.css'
import { DrawingBoard } from './drawingBoard';
import render from "./render";

enum Engine {
  Input,
  Command
}

const currentEngine = Engine.Input;
const ROWS = 40;
const COLUMNS = 40;
const drawingBoard = new DrawingBoard(ROWS, COLUMNS);

render(drawingBoard);
addEventListener("keydown", (e) => {
  if (currentEngine === Engine.Input) {
    if (e.key == "Control") {
      drawingBoard.controlHeld = true;
    } else {
      drawingBoard.handleInput(e.key);
      render(drawingBoard);
    }
  }
});

addEventListener("keyup", (e) => {
  if (e.key == "Control") {
    drawingBoard.controlHeld = false;
  }
});
