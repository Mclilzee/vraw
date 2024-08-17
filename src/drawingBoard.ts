import { Cursor } from "./cursor";
import { CELL_DEFAULT_COLOR, CLEAR_COLOR, NORMAL_COLOR, VISUAL_COLOR } from "./main";
export class Board {
  rows: number;
  columns: number;
  cursor = new Cursor();
  drawingColor = "red";
  visualMask: string[][];
  historyIndex = 0;
  history: string[][][] = [[]];

  constructor(columns: number, rows: number) {
    this.history[0] = Array(columns).fill(0).map(() => Array(rows).fill(CELL_DEFAULT_COLOR));
    this.rows = columns;
    this.columns = rows;
    this.visualMask = Array(columns).fill(0).map(() => Array(rows).fill(CLEAR_COLOR));
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
    const moves = this.cursor.y;
    this.moveCursorLeft(moves);
  }

  moveToRowEnd() {
    const moves = this.rows - 1 - this.cursor.y;
    this.moveCursorRight(moves);
  }

  moveCursorRight(moves: number) {
    if (this.cursor.y < this.columns - 1) {
      const newPos = Math.min(this.cursor.y + moves, this.rows - 1);
      this.handleBoardChanges(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
      this.cursor.y = newPos;
    }
  }

  moveCursorLeft(moves: number) {
    const newPos = Math.max(0, this.cursor.y - moves);
    this.handleBoardChanges(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
    this.cursor.y = newPos;
  }

  moveCursorUp(moves: number) {
    const newPos = Math.max(0, this.cursor.x - moves);
    this.handleBoardChanges(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
    this.cursor.x = newPos;
  }

  moveCursorDown(moves: number) {
    const newPos = Math.min(this.cursor.x + moves, this.columns);
    this.handleBoardChanges(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
    this.cursor.x = newPos;
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
}
