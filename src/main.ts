import './style.css'
import { canvas, ctx } from './elements';
import { DrawingBoard } from './drawingBoard';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const drawingBoard = new DrawingBoard(TILE_SIZE, TILE_SIZE);
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

draw(drawingBoard);
addEventListener("keydown", (e) => {
  if (e.key == "Control") {
    drawingBoard.controlHeld = true;
  } else {
    drawingBoard.handleInput(e.key);
    draw(drawingBoard);
  }
});

addEventListener("keyup", (e) => {
  if (e.key == "Control") {
    drawingBoard.controlHeld = false;
  }
});

function draw(board: DrawingBoard) {
  const width = canvas.width / board.width;
  const height = canvas.height / board.height;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      ctx.strokeRect(j * width, i * height, width, height);
      ctx.fillStyle = board.board[i][j];
      ctx.fillRect(j * width, i * height, width, height);
      ctx.fillStyle = board.visualMask[i][j];
      ctx.fillRect(j * width, i * height, width, height);
    }
  }

  ctx.fillStyle = board.cursorColor();
  ctx.fillRect(board.cursor.y * width, board.cursor.x * height, width, height);
}
