import './style.css'
import { boardCanvas, boardCtx } from './elements';
import { DrawingBoard } from './drawingBoard';

const TILE_SIZE = 40;
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 600;
const NUMBER_PADDING = 30;
const BAR_HEIGHT = 15;
const CURSOR_POSITION_RIGHT_PADDING = 15;
const TEXT_PADDING = 3;
const STATUS_BAR_INFO_HEIGHT = 20;

const drawingBoard = new DrawingBoard(TILE_SIZE, TILE_SIZE);
boardCanvas.width = BOARD_WIDTH + NUMBER_PADDING * 2;
boardCanvas.height = BOARD_HEIGHT + NUMBER_PADDING + BAR_HEIGHT + STATUS_BAR_INFO_HEIGHT;

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
  boardCtx.reset();
  const width = BOARD_WIDTH / board.width;
  const height = BOARD_HEIGHT / board.height;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      const x = j * width + NUMBER_PADDING;
      boardCtx.strokeRect(x, i * height, width, height);
      boardCtx.fillStyle = board.board[i][j];
      boardCtx.fillRect(x, i * height, width, height);
      boardCtx.fillStyle = board.visualMask[i][j];
      boardCtx.fillRect(x, i * height, width, height);
    }
  }

  boardCtx.fillStyle = board.cursorColor();
  boardCtx.fillRect(board.cursor.y * width + NUMBER_PADDING, board.cursor.x * height, width, height);
  drawNumbers(board);
  drawStatusBar(board.cursor.x + 1, board.cursor.y + 1);
  drawStatusBarInfo(board);
}

function drawNumbers(board: DrawingBoard) {
  const verticalNumbers = getNumbers(board.cursor.x, board.height);
  const height = BOARD_HEIGHT / board.height;
  const width = BOARD_WIDTH / board.width;

  for (let i = 0; i < verticalNumbers.length; i++) {
    const y = i * height + (NUMBER_PADDING / 2) - TEXT_PADDING;
    boardCtx.fillStyle = "white";
    boardCtx.font = "12px Fira Sans";
    boardCtx.textAlign = "center";
    const number = verticalNumbers[i];
    if (number === 0) {
      boardCtx.fillStyle = "red";
    }
    boardCtx.fillText(number.toString(), NUMBER_PADDING / 2, y);
  }

  const horizontalNumbers = getNumbers(board.cursor.y, board.width);
  for (let i = 0; i < horizontalNumbers.length; i++) {
    const x = i * width + NUMBER_PADDING + NUMBER_PADDING / 4;
    boardCtx.fillStyle = "white";
    boardCtx.font = "10px Fira Sans";
    boardCtx.textAlign = "center";
    const number = horizontalNumbers[i];
    if (number === 0) {
      boardCtx.fillStyle = "red";
    }
    boardCtx.fillText(number.toString(), x, BOARD_WIDTH + NUMBER_PADDING / 2);
  }
}

function getNumbers(anchor: number, size: number) {
  const array = [];
  for (let i = anchor; i > anchor - size; i--) {
    array.push(Math.abs(i));
  }

  return array;
}

function drawStatusBar(cursorRow: number, cursorColumn: number) {
  const y = BOARD_WIDTH + NUMBER_PADDING;
  boardCtx.fillStyle = "grey";
  boardCtx.fillRect(0, y, boardCanvas.width, BAR_HEIGHT);
  boardCtx.fillStyle = "white";
  boardCtx.font = "bold 11px Fira Sans";
  boardCtx.textAlign = "left";
  boardCtx.fillText("vim/drawing.ts", TEXT_PADDING, y + BAR_HEIGHT / 2 + TEXT_PADDING);

  boardCtx.fillText(`${cursorRow}, ${cursorColumn}`, BOARD_WIDTH - CURSOR_POSITION_RIGHT_PADDING, y + BAR_HEIGHT / 2 + TEXT_PADDING);
}

function drawStatusBarInfo(board: DrawingBoard) {
  let mode = "NORMAL";
  if (board.cursor.inInsertMode()) {
    mode = "INSERT";
  } else if (board.cursor.inVisualMode()) {
    mode = "VISUAL";
  } else if (board.cursor.inVisualLineMode()) {
    mode = "VISUAL LINE";
  } else if (board.cursor.inVisualBlockMode()) {
    mode = "VISUAL BLOCK";
  }

  boardCtx.font = "15px Fira Sans";
  boardCtx.fillText(`-- ${mode} --`, TEXT_PADDING, boardCanvas.height, boardCanvas.width);
}
