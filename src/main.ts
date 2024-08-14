import './style.css'
import { canvas, ctx } from './elements';
import { DrawingBoard } from './drawingBoard';
const TILE_SIZE = 40;
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 600;
const NUMBER_PADDING = 30;
const BAR_HEIGHT = 15;
const TEXT_PADDING = 3;

const drawingBoard = new DrawingBoard(TILE_SIZE, TILE_SIZE);
canvas.width = BOARD_WIDTH + NUMBER_PADDING * 2;
canvas.height = BOARD_HEIGHT + NUMBER_PADDING + BAR_HEIGHT;

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
  const width = BOARD_WIDTH / board.width;
  const height = BOARD_HEIGHT / board.height;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      const x = j * width + NUMBER_PADDING;
      ctx.strokeRect(x, i * height, width, height);
      ctx.fillStyle = board.board[i][j];
      ctx.fillRect(x, i * height, width, height);
      ctx.fillStyle = board.visualMask[i][j];
      ctx.fillRect(x, i * height, width, height);
    }
  }

  ctx.fillStyle = board.cursorColor();
  ctx.fillRect(board.cursor.y * width + NUMBER_PADDING, board.cursor.x * height, width, height);
  drawNumbers(board);
  drawStatusBar(board);
}

function drawNumbers(board: DrawingBoard) {
  const verticalNumbers = getNumbers(board.cursor.x, board.height);
  const height = BOARD_HEIGHT / board.height;
  const width = BOARD_WIDTH / board.width;

  for (let i = 0; i < verticalNumbers.length; i++) {
    const y = i * height + (NUMBER_PADDING / 2) - TEXT_PADDING;
    ctx.fillStyle = "white";
    ctx.font = "12px Fira Sans";
    ctx.textAlign = "center";
    const number = verticalNumbers[i];
    if (number === 0) {
      ctx.fillStyle = "red";
    }
    ctx.fillText(number.toString(), NUMBER_PADDING / 2, y);
  }

  const horizontalNumbers = getNumbers(board.cursor.y, board.width);
  for (let i = 0; i < horizontalNumbers.length; i++) {
    const x = i * width + NUMBER_PADDING + NUMBER_PADDING / 4;
    ctx.fillStyle = "white";
    ctx.font = "10px Fira Sans";
    ctx.textAlign = "center";
    const number = horizontalNumbers[i];
    if (number === 0) {
      ctx.fillStyle = "red";
    }
    ctx.fillText(number.toString(), x, BOARD_WIDTH + NUMBER_PADDING / 2);
  }
}

function getNumbers(anchor: number, size: number) {
  const array = [];
  for (let i = anchor; i > anchor - size; i--) {
    array.push(Math.abs(i));
  }

  return array;
}

function drawStatusBar(board: DrawingBoard) {
  const y = BOARD_WIDTH + NUMBER_PADDING;
  ctx.fillStyle = "grey";
  ctx.fillRect(0, y, canvas.width, BAR_HEIGHT);
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("vim/drawing.ts", TEXT_PADDING, y + BAR_HEIGHT / 2 + TEXT_PADDING);
}
