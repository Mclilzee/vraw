import { Cursor } from "./cursor";
const CELL_DEFAULT_COLOR = "#a5a5a5";
const NORMAL_COLOR = "#00000080";
const VISUAL_COLOR = "#0000F080";
const CLEAR_COLOR = "#00000000";

export class DrawingBoard {
  cursor = new Cursor();
  width: number;
  height: number;
  board: string[][];
  moves = 1;
  drawingColor = "red";
  visualMask: string[][];
  controlHeld = false;

  constructor(width: number, height: number) {
    this.board = Array(height).fill(0).map(() => Array(width).fill(CELL_DEFAULT_COLOR));
    this.width = width;
    this.height = height;
    this.visualMask = Array(height).fill(0).map(() => Array(width).fill(CLEAR_COLOR));
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
    this.moves = this.width - 1 - this.cursor.y;
    this.moveCursorRight();
  }

  moveCursorRight() {
    let newPos = this.cursor.y + (this.moves == 0 ? 1 : this.moves);
    if (newPos > this.width - 1) {
      newPos = this.width - 1;
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
    if (newPos > this.height - 1) {
      newPos = this.height - 1;
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
    this.fillArea(xStart, xEnd, yStart, yEnd, this.drawingColor, this.board);
  }

  deleteArea(xStart: number, xEnd: number, yStart: number, yEnd: number) {
    this.fillArea(xStart, xEnd, yStart, yEnd, CELL_DEFAULT_COLOR, this.board);
    this.cursor.switchToNormal();
  }

  visualMaskReset() {
    this.visualMask = Array(this.height).fill(0).map(() => Array(this.width).fill(CLEAR_COLOR));
  }

  fillVisualMask(endX: number, endY: number) {
    this.visualMaskReset();
    const startX = this.cursor.visualStartIndex[0];
    const startY = this.cursor.visualStartIndex[1];
    if (this.cursor.inVisualBlockMode()) {
      this.fillArea(startX, endX, startY, endY, VISUAL_COLOR, this.visualMask);
    } else if (this.cursor.inVisualLineMode()) {
      this.fillArea(startX, endX, 0, this.width - 1, VISUAL_COLOR, this.visualMask);
    } else {
      this.fillVisualNormalMode(startX, endX, startY, endY);
    }
  }

  fillVisualNormalMode(startX: number, endX: number, startY: number, endY: number) {
    const startRow = Math.min(startX, endX);
    const endRow = Math.max(startX, endX);
    for (let i = startRow + 1; i < endRow; ++i) {
      this.fillArea(i, i, 0, this.width - 1, VISUAL_COLOR, this.visualMask);
    }

    //for (let i = startX; i <= endX; ++i) {
    //  for (let j = startY; j <= endY; ++j) {
    //    if (i === endX) {
    //      this.fillArea(startX, endX, startY, endY, VISUAL_COLOR, this.visualMask);
    //    }
    //  }
    //}
  }

  drawVisualMask() {
    this.visualMask.forEach((row, i) => row.forEach((color, j) => {
      if (color === VISUAL_COLOR) {
        this.board[i][j] = this.drawingColor;
      }
    }));
    this.visualMaskReset();
    this.cursor.switchToNormal();
  }

  deleteVisualMask() {
    this.visualMask.forEach((row, i) => row.forEach((color, j) => {
      if (color === VISUAL_COLOR) {
        this.board[i][j] = CELL_DEFAULT_COLOR;
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
          this.board[this.cursor.x][this.cursor.y] = CELL_DEFAULT_COLOR;
        }
      } break;
      case "D": this.deleteArea(this.cursor.x, this.cursor.x, this.cursor.y, this.width - 1); break;
      case "$": this.moveToRowEnd(); break;
      case "d": {
        if (this.cursor.inAnyVisualMode()) {
          this.deleteVisualMask()
        } else if (this.cursor.inDeleteMode()) {
          this.deleteArea(this.cursor.x, this.cursor.x, 0, this.width - 1);
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
    }
  }
}
