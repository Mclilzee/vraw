import { board } from "./main";
import { renderBoard, renderStatusInfo } from "./render";

let moves = 0;
let previousKey = "";

export default function handleInput(e: KeyboardEvent) {
  if (e.key === "0" && moves === 0) {
    board.moveCursorToRowStart();
  } else {
    const num = parseInt(e.key);
    if (!isNaN(num)) {
      moves = moves * 10 + num;
    }
  }

  switch (e.key) {
    case "i": switchCursorToInsert(); break;
    case "Escape": switchCursorToNormal(); break;
    case "g": handleMovingToBottom(); break;
    case "G": board.moveCursorToTop(); break;
    case "l": {
      moves = moves === 0 ? 1 : moves;
      board.moveCursorRight(moves);
      moves = 0;
    } break;
    case "h": {
      moves = moves === 0 ? 1 : moves;
      board.moveCursorLeft(moves);
      moves = 0;
    } break;
    case "k": {
      moves = moves === 0 ? 1 : moves;
      board.moveCursorUp(moves);
      moves = 0;
    } break;
    case "j": {
      moves = moves === 0 ? 1 : moves;
      board.moveCursorDown(moves);
      moves = 0;
    } break;
    case "$": board.moveCursorToRowEnd(); break;
    case "x": handleDeleteCell(); break;
    case "D": handleDeleteFromCursorToRowEnd(); break;
    case "d": handleDeleteRow(); break;
    case "V": handleVisualLineMode(); break;
    case "w": handleFindingPaintForward(); break;
    case "w": handleFindingPaintBackward(); break;
    case "v": {
      if (e.ctrlKey) {
        handleVisualBlockMode()
      } else {
        handleVisualMode()
      };
    } break;
    case "u": board.moveToPreviousState(); break;
    case "r": {
      if (e.ctrlKey) {
        board.moveToNextState();
      }
    } break;
  }

  renderBoard(board);

  const secondInfo = moves > 0 ? moves.toString() : previousKey;
  renderStatusInfo(board.cursor.getCursorLineInfo(), "orange", secondInfo);
}


function switchCursorToInsert() {
  if (board.cursor.inAnyVisualMode()) {
    board.drawVisualMask();
  } else {
    board.cursor.switchToInsert();
  }
}

function switchCursorToNormal() {
  board.visualMaskReset();
  board.cursor.switchToNormal();
}

function handleVisualLineMode() {
  if (board.cursor.inAnyVisualMode()) {
    board.visualMaskReset();
    board.cursor.switchToNormal();
  } else {
    board.cursor.switchToVisualLine();
    board.fillVisualMask(board.cursor.x, board.cursor.y);
  }
}

function handleVisualBlockMode() {
  if (board.cursor.inAnyVisualMode()) {
    board.visualMaskReset();
    board.cursor.switchToNormal();
  } else {
    board.cursor.switchToVisualBlock();
  }
}

function handleVisualMode() {
  if (board.cursor.inAnyVisualMode()) {
    board.visualMaskReset();
    board.cursor.switchToNormal();
  } else {
    board.cursor.switchToVisual();
    board.fillVisualMask(board.cursor.x, board.cursor.y);
  }
}

function handleDeleteFromCursorToRowEnd() {
  board.deleteArea(board.cursor.x, board.cursor.x, board.cursor.y, board.rows - 1)
}

function handleDeleteRow() {
  if (board.cursor.inDeleteMode()) {
    board.deleteArea(board.cursor.x, board.cursor.x, 0, board.columns - 1);
  } else if (board.cursor.inAnyVisualMode()) {
    board.deleteVisualMask()
  } else {
    board.cursor.switchToDelete();
  }
}

function handleDeleteCell() {
  if (board.cursor.inAnyVisualMode()) {
    board.deleteVisualMask()
  } else {
    board.deleteCell();
  }
}

function handleMovingToBottom() {
  if (previousKey === "g") {
    board.moveCursorToBottom()
    previousKey = "";
  } else {
    previousKey = "g";
  }
}

function handleFindingPaintForward() {
  board.moveCursorToNextWord()
}

function handleFindingPaintBackward() {
  board.moveCursorToPreviousWord()
}
