import './style.css'
import { canvas, ctx } from './elements';
import { DrawingBoard } from './drawingBoard';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const RELATIVE_NUMBER_PADDING = 30;

const drawingBoard = new DrawingBoard(TILE_SIZE, TILE_SIZE);
canvas.width = CANVAS_WIDTH + RELATIVE_NUMBER_PADDING;
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
  ctx.reset();
  const width = CANVAS_WIDTH / board.width;
  const height = canvas.height / board.height;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      const x = j * width + RELATIVE_NUMBER_PADDING;
      ctx.strokeRect(x, i * height, width + RELATIVE_NUMBER_PADDING, height);
      ctx.fillStyle = board.board[i][j];
      ctx.fillRect(x, i * height, width, height);
      ctx.fillStyle = board.visualMask[i][j];
      ctx.fillRect(x, i * height, width, height);
    }
  }

  ctx.fillStyle = board.cursorColor();
  ctx.fillRect(board.cursor.y * width + RELATIVE_NUMBER_PADDING, board.cursor.x * height, width, height);
  drawVerticalRelativeNumbers(board);
}

function drawVerticalRelativeNumbers(board: DrawingBoard) {
  const height = canvas.height / board.height;
  for (let i = 0; i <= board.height; i++) {
    ctx.fillStyle = "white";
    ctx.font = "14px Fira Sans";
    ctx.textAlign = "center";
    ctx.fillText(i.toString(), RELATIVE_NUMBER_PADDING / 2, (i * height) - height / 4);
  }
}

