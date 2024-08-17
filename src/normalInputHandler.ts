import { board, cursor } from "./main";
import { renderBoard, renderStatusInfo } from "./render";
let moves = 1;

export default function handleInput(e: KeyboardEvent) {
  if (e.key == "0" && this.moves == 0) {
    this.moveToRowStart();
  } else {
    const num = parseInt(input);
    if (!isNaN(num)) {
      this.moves = this.moves == 0 ? num : this.moves * 10 + num;
    }
  }

  switch (input) {
    case "i": {
      if (this.cursor.inAnyVisualMode()) {
        this.drawVisualMask();
      } else {
        this.cursor.switchToInsert();
      }
    } break;
    case "Escape": {
      this.visualMaskReset();
      this.cursor.switchToNormal();
    } break;
    case "l": this.moveCursorRight(); break;
    case "h": this.moveCursorLeft(); break;
    case "k": this.moveCursorUp(); break;
    case "j": this.moveCursorDown(); break;
    case "x": {
      if (this.cursor.inAnyVisualMode()) {
        this.deleteVisualMask()
      } else {
        const board = this.getCurrentBoardAndUpdateHistory();
        board[this.cursor.x][this.cursor.y] = CELL_DEFAULT_COLOR;
      }
    } break;
    case "D": this.deleteArea(this.cursor.x, this.cursor.x, this.cursor.y, this.rows - 1); break;
    case "$": this.moveToRowEnd(); break;
    case "d": {
      if (this.cursor.inAnyVisualMode()) {
        this.deleteVisualMask()
      } else if (this.cursor.inDeleteMode()) {
        this.deleteArea(this.cursor.x, this.cursor.x, 0, this.rows - 1);
      } else {
        this.cursor.switchToDelete();
      }
    } break;
    case "V": {
      if (this.cursor.inAnyVisualMode()) {
        this.visualMaskReset();
        this.cursor.switchToNormal();
      } else {
        this.cursor.switchToVisualLine();
        this.fillVisualMask(this.cursor.x, this.cursor.y);
      }
    } break;
    case "v": {
      if (this.cursor.inAnyVisualMode()) {
        this.visualMaskReset();
        this.cursor.switchToNormal();
      } else if (this.controlHeld) {
        this.cursor.switchToVisualBlock();
      } else {
        this.cursor.switchToVisual();
        this.fillVisualMask(this.cursor.x, this.cursor.y);
      }
    } break;
    case "u": {
      this.historyIndex = Math.max(this.historyIndex - 1, 0);
    } break;
    case "r": {
      if (this.controlHeld) {
        this.historyIndex = Math.min(this.history.length - 1, this.historyIndex + 1);
      }
    } break;
  }

  renderBoard(board);
  renderStatusInfo(cursor.getCursorLineInfo(), "orange");
}
