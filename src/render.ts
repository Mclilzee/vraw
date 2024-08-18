import { Board } from './board';
import { boardCanvas, boardCtx, statusInfo, statusInfoCtx } from './elements';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 600;
const RIGHT_TEXT_PADDING = 30;
const BAR_HEIGHT = 15;
const CURSOR_POSITION_RIGHT_PADDING = 15;
const TEXT_PADDING = 3;
const STATUS_BAR_INFO_HEIGHT = 20;

boardCanvas.width = BOARD_WIDTH + RIGHT_TEXT_PADDING * 2;
boardCanvas.height = BOARD_HEIGHT + RIGHT_TEXT_PADDING + BAR_HEIGHT;
statusInfo.width = boardCanvas.width;
statusInfo.height = STATUS_BAR_INFO_HEIGHT;

export function renderBoard(board: Board) {
  boardCtx.reset();
  const currentBoard = board.currentBoard();
  const width = BOARD_WIDTH / board.columns;
  const height = BOARD_HEIGHT / board.rows;
  for (let i = 0; i < board.rows; i++) {
    for (let j = 0; j < board.columns; j++) {
      const x = j * width + RIGHT_TEXT_PADDING;
      boardCtx.strokeRect(x, i * height, width, height);
      boardCtx.fillStyle = currentBoard[i][j];
      boardCtx.fillRect(x, i * height, width, height);
      boardCtx.fillStyle = board.visualMask[i][j];
      boardCtx.fillRect(x, i * height, width, height);
    }
  }

  boardCtx.fillStyle = board.cursorColor();
  boardCtx.fillRect(board.cursor.y * width + RIGHT_TEXT_PADDING, board.cursor.x * height, width, height);
  renderBoardNumbers(board);
  renderBoardStatusBar(board.cursor.x + 1, board.cursor.y + 1);
}

export function renderStatusInfo(info: string, color: string, secondInfo?: string, secondColor?: string) {
  statusInfoCtx.reset();
  statusInfoCtx.fillStyle = color;
  statusInfoCtx.font = "15px Fira Sans";
  statusInfoCtx.fillText(info, TEXT_PADDING, STATUS_BAR_INFO_HEIGHT);
  if (secondColor != undefined) {
    statusInfoCtx.fillStyle = color;
  }

  if (secondInfo != undefined) {
    statusInfoCtx.fillText(secondInfo,  statusInfo.width - RIGHT_TEXT_PADDING, STATUS_BAR_INFO_HEIGHT);
  }
}

function renderBoardNumbers(board: Board) {
  const verticalNumbers = getNumbers(board.cursor.x, board.rows);
  const height = BOARD_HEIGHT / board.rows;
  const width = BOARD_WIDTH / board.columns;

  for (let i = 0; i < verticalNumbers.length; i++) {
    const y = i * height + (RIGHT_TEXT_PADDING / 2) - TEXT_PADDING;
    boardCtx.fillStyle = "white";
    boardCtx.font = "12px Fira Sans";
    boardCtx.textAlign = "center";
    const number = verticalNumbers[i];
    if (number === 0) {
      boardCtx.fillStyle = "red";
    }
    boardCtx.fillText(number.toString(), RIGHT_TEXT_PADDING / 2, y);
  }

  const horizontalNumbers = getNumbers(board.cursor.y, board.columns);
  for (let i = 0; i < horizontalNumbers.length; i++) {
    const x = i * width + RIGHT_TEXT_PADDING + RIGHT_TEXT_PADDING / 4;
    boardCtx.fillStyle = "white";
    boardCtx.font = "10px Fira Sans";
    boardCtx.textAlign = "center";
    const number = horizontalNumbers[i];
    if (number === 0) {
      boardCtx.fillStyle = "red";
    }
    boardCtx.fillText(number.toString(), x, BOARD_WIDTH + RIGHT_TEXT_PADDING / 2);
  }
}

function getNumbers(anchor: number, size: number) {
  const array = [];
  for (let i = anchor; i > anchor - size; i--) {
    array.push(Math.abs(i));
  }

  return array;
}

function renderBoardStatusBar(cursorRow: number, cursorColumn: number) {
  const y = BOARD_WIDTH + RIGHT_TEXT_PADDING;
  boardCtx.fillStyle = "grey";
  boardCtx.fillRect(0, y, boardCanvas.width, BAR_HEIGHT);
  boardCtx.fillStyle = "white";
  boardCtx.font = "bold 11px Fira Sans";
  boardCtx.textAlign = "left";
  boardCtx.fillText("vim/drawing.ts", TEXT_PADDING, y + BAR_HEIGHT / 2 + TEXT_PADDING);

  boardCtx.fillText(`${cursorRow}, ${cursorColumn}`, BOARD_WIDTH - CURSOR_POSITION_RIGHT_PADDING, y + BAR_HEIGHT / 2 + TEXT_PADDING);
}
