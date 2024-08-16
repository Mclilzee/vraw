import { Cursor } from "./cursor";
const CELL_DEFAULT_COLOR = "#a5a5a5";
const NORMAL_COLOR = "#00000080";
const VISUAL_COLOR = "#0000F080";
const CLEAR_COLOR = "#00000000";

export class DrawingBoard {
  cursor = new Cursor();
  rows: number;
  columns: number;
  moves = 1;
  drawingColor = "red";
  visualMask: string[][];
  controlHeld = false;
  historyIndex = 0;
  history: string[][][] = [[]];

  constructor(height: number, width: number) {
    this.history[0] = Array(height).fill(0).map(() => Array(width).fill(CELL_DEFAULT_COLOR));
    this.rows = height;
    this.columns = width;
    this.visualMask = Array(height).fill(0).map(() => Array(width).fill(CLEAR_COLOR));
  }

  getCurrentBoard(): string[][] {
    const array: string[][] = [];
    const board = this.history[this.historyIndex];

    for (let i = 0; i < board.length; i++) {
      array[i] = [];
      for (let j = 0; j < board[i].length; j++) {
        array[i][j] = board[i][j];
      }
    }

    return array;
  }

  getCurrentBoardAndUpdateHistory(): string[][] {
    const board = this.getCurrentBoard();
    this.history[++this.historyIndex] = board;
    this.history = this.history.slice(0, this.historyIndex + 1);
    console.log(this.history);
    return board;
  }

  cursorColor(): string {
    if (this.cursor.inInsertMode()) {
      return this.drawingColor;
    } else if (this.cursor.inAnyVisualMode()) {
      return VISUAL_COLOR;
    } else {
      return NORMAL_COLOR;
    }
  }

  moveToRowStart() {
    this.moves = this.cursor.y;
    this.moveCursorLeft();
  }

  moveToRowEnd() {
    this.moves = this.rows - 1 - this.cursor.y;
    this.moveCursorRight();
  }

  moveCursorRight() {
    if (this.cursor.y === this.columns - 1) {
      return;
    }

    let newPos = this.cursor.y + (this.moves == 0 ? 1 : this.moves);
    if (newPos > this.rows - 1) {
      newPos = this.rows - 1;
    }

    this.handleBoardChanges(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
    this.cursor.y = newPos;
    this.moves = 0;
  }

  moveCursorLeft() {
    let newPos = this.cursor.y - (this.moves == 0 ? 1 : this.moves);
    if (newPos < 0) {
      newPos = 0;
    }

    this.handleBoardChanges(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
    this.cursor.y = newPos;
    this.moves = 0;
  }

  moveCursorUp() {
    let newPos = this.cursor.x - (this.moves == 0 ? 1 : this.moves);
    if (newPos < 0) {
      newPos = 0;
    }

    this.handleBoardChanges(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
    this.cursor.x = newPos;
    this.moves = 0;
  }

  moveCursorDown() {
    let newPos = this.cursor.x + (this.moves == 0 ? 1 : this.moves);
    if (newPos > this.columns - 1) {
      newPos = this.columns - 1;
    }

    this.handleBoardChanges(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
    this.cursor.x = newPos;
    this.moves = 0;
  }

  handleBoardChanges(cursorOldX: number, cursorNewX: number, cursorOldY: number, cursorNewY: number) {
    if (this.cursor.inInsertMode()) {
      this.drawBoard(cursorOldX, cursorNewX, cursorOldY, cursorNewY);
    } else if (this.cursor.inAnyVisualMode()) {
      this.fillVisualMask(cursorNewX, cursorNewY);
    } else if (this.cursor.inDeleteMode()) {
      this.deleteArea(cursorOldX, cursorNewX, cursorOldY, cursorNewY);
    }
  }

  drawBoard(xStart: number, xEnd: number, yStart: number, yEnd: number) {
    const board = this.getCurrentBoardAndUpdateHistory();
    this.fillArea(xStart, xEnd, yStart, yEnd, this.drawingColor, board);
  }

  deleteArea(xStart: number, xEnd: number, yStart: number, yEnd: number) {
    const board = this.getCurrentBoardAndUpdateHistory();
    this.fillArea(xStart, xEnd, yStart, yEnd, CELL_DEFAULT_COLOR, board);
    this.cursor.switchToNormal();
  }

  visualMaskReset() {
    this.visualMask = Array(this.columns).fill(0).map(() => Array(this.rows).fill(CLEAR_COLOR));
  }

  fillVisualMask(endX: number, endY: number) {
    this.visualMaskReset();
    const startX = this.cursor.visualStartIndex[0];
    const startY = this.cursor.visualStartIndex[1];
    if (this.cursor.inVisualBlockMode()) {
      this.fillArea(startX, endX, startY, endY, VISUAL_COLOR, this.visualMask);
    } else if (this.cursor.inVisualLineMode()) {
      this.fillArea(startX, endX, 0, this.rows - 1, VISUAL_COLOR, this.visualMask);
    } else {
      this.fillVisualNormalMode(startX, endX, startY, endY);
    }
  }

  fillVisualNormalMode(startX: number, endX: number, startY: number, endY: number) {
    const startRow = Math.min(startX, endX);
    const endRow = Math.max(startX, endX);
    for (let i = startRow + 1; i < endRow; ++i) {
      this.fillArea(i, i, 0, this.rows - 1, VISUAL_COLOR, this.visualMask);
    }

    if (startX > endX) {
      this.fillArea(startX, startX, 0, startY, VISUAL_COLOR, this.visualMask);
      this.fillArea(endX, endX, endY, this.rows - 1, VISUAL_COLOR, this.visualMask);
    } else if (startX < endX) {
      this.fillArea(startX, startX, startY, this.rows - 1, VISUAL_COLOR, this.visualMask);
      this.fillArea(endX, endX, 0, endY, VISUAL_COLOR, this.visualMask);
    } else {
      this.fillArea(startX, endX, startY, endY, VISUAL_COLOR, this.visualMask);
    }
  }

  drawVisualMask() {
    const board = this.getCurrentBoardAndUpdateHistory();
    this.visualMask.forEach((row, i) => row.forEach((color, j) => {
      if (color === VISUAL_COLOR) {
        board[i][j] = this.drawingColor;
      }
    }));
    this.visualMaskReset();
    this.cursor.switchToNormal();
  }

  deleteVisualMask() {
    const board = this.getCurrentBoardAndUpdateHistory();
    this.visualMask.forEach((row, i) => row.forEach((color, j) => {
      if (color === VISUAL_COLOR) {
        board[i][j] = CELL_DEFAULT_COLOR;
      }
    }));
    this.visualMaskReset();
    this.cursor.switchToNormal();
  }

  fillArea(xStart: number, xEnd: number, yStart: number, yEnd: number, color: string, array: string[][]) {
    const iStart = Math.min(xStart, xEnd);
    const iEnd = Math.max(xStart, xEnd);
    const jStart = Math.min(yStart, yEnd);
    const jEnd = Math.max(yStart, yEnd);
    for (let i = iStart; i <= iEnd; i++) {
      for (let j = jStart; j <= jEnd; j++) {
        array[i][j] = color;
      }
    }
  }

  handleInput(input: string) {
    if (input == "0" && this.moves == 0) {
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
  }
}
