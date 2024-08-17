import { board, CELL_DEFAULT_COLOR } from "./main";
import { renderBoard, renderStatusInfo } from "./render";
let moves = 1;

export default function handleInput(e: KeyboardEvent) {
  if (e.key == "0" && moves == 1) {
    board.moveToRowStart();
  } else {
    const num = parseInt(e.key);
    if (!isNaN(num)) {
      moves = moves == 0 ? num : moves * 10 + num;
    }
  }

  switch (e.key) {
    case "i": {
      if (board.cursor.inAnyVisualMode()) {
        board.drawVisualMask();
      } else {
        board.cursor.switchToInsert();
      }
    } break;
    case "Escape": {
      board.visualMaskReset();
      board.cursor.switchToNormal();
    } break;
    case "l": {
      board.moveCursorRight(moves);
      moves = 1;
    } break;
    case "h": {
      board.moveCursorLeft(moves);
      moves = 1;
    } break;
    case "k": {
      board.moveCursorUp(moves);
      moves = 1;
    } break;
    case "j": {
      board.moveCursorDown(moves);
      moves = 1;
    } break;
    case "x": {
      if (board.cursor.inAnyVisualMode()) {
        board.deleteVisualMask()
      } else {
        const boardArray = board.getCurrentBoardAndUpdateHistory();
        boardArray[board.cursor.x][board.cursor.y] = CELL_DEFAULT_COLOR;
      }
    } break;
    case "D": board.deleteArea(board.cursor.x, board.cursor.x, board.cursor.y, board.rows - 1); break;
    case "$": board.moveToRowEnd(); break;
    case "d": {
      if (board.cursor.inAnyVisualMode()) {
        board.deleteVisualMask()
      } else if (board.cursor.inDeleteMode()) {
        board.deleteArea(board.cursor.x, board.cursor.x, 0, board.rows - 1);
      } else {
        board.cursor.switchToDelete();
      }
    } break;
    case "V": {
      if (board.cursor.inAnyVisualMode()) {
        board.visualMaskReset();
        board.cursor.switchToNormal();
      } else {
        board.cursor.switchToVisualLine();
        board.fillVisualMask(board.cursor.x, board.cursor.y);
      }
    } break;
    case "v": {
      if (board.cursor.inAnyVisualMode()) {
        board.visualMaskReset();
        board.cursor.switchToNormal();
      } else if (e.ctrlKey) {
        board.cursor.switchToVisualBlock();
      } else {
        board.cursor.switchToVisual();
        board.fillVisualMask(board.cursor.x, board.cursor.y);
      }
    } break;
    case "u": {
      board.historyIndex = Math.max(board.historyIndex - 1, 0);
    } break;
    case "r": {
      if (e.ctrlKey) {
        board.historyIndex = Math.min(board.history.length - 1, board.historyIndex + 1);
      }
    } break;
  }

  renderBoard(board);
  renderStatusInfo(board.cursor.getCursorLineInfo(), "orange");
}
