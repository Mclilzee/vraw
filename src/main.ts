import './style.css'
import { canvas, ctx } from './elements';
import { DrawingBoard } from './drawingBoard';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const V_NUMBER_PADDING = 30;

const drawingBoard = new DrawingBoard(TILE_SIZE, TILE_SIZE);
canvas.width = CANVAS_WIDTH + V_NUMBER_PADDING;
canvas.height = CANVAS_HEIGHT + V_NUMBER_PADDING;

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
  const height = CANVAS_HEIGHT / board.height;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      const x = j * width + V_NUMBER_PADDING;
      ctx.strokeRect(x, i * height, width + V_NUMBER_PADDING, height);
      ctx.fillStyle = board.board[i][j];
      ctx.fillRect(x, i * height, width, height);
      ctx.fillStyle = board.visualMask[i][j];
      ctx.fillRect(x, i * height, width, height);
    }
  }

  ctx.fillStyle = board.cursorColor();
  ctx.fillRect(board.cursor.y * width + V_NUMBER_PADDING, board.cursor.x * height, width, height);
  drawNumbers(board);
}
getNumbers(20, TILE_SIZE);

function drawNumbers(board: DrawingBoard) {
  const verticalNumbers = getNumbers(board.cursor.x, board.height);
  const height = CANVAS_HEIGHT / board.height;
  const width = CANVAS_WIDTH / board.width;

  for (let i = 0; i < verticalNumbers.length; i++) {
    const y = i * height + (V_NUMBER_PADDING / 2) - 3;
    ctx.fillStyle = "white";
    ctx.font = "12px Fira Sans";
    ctx.textAlign = "center";
    ctx.fillText(verticalNumbers[i].toString(), 0 + V_NUMBER_PADDING / 2, y);
  }

  const horizontalNumbers = getNumbers(board.cursor.y, board.width);
  for (let i = 0; i < horizontalNumbers.length; i++) {
    const x = i * width + V_NUMBER_PADDING + V_NUMBER_PADDING / 4;
    ctx.fillStyle = "white";
    ctx.font = "12px Fira Sans";
    ctx.textAlign = "center";
    ctx.fillText(horizontalNumbers[i].toString(), x, CANVAS_WIDTH + V_NUMBER_PADDING / 2);
  }
}

function getNumbers(anchor: number, size: number) {
  const array = [];
  for (let i = anchor; i > anchor - size; i--) {
    array.push(Math.abs(i));
  }

  return array;
}
