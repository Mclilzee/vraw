import { Cursor, CursorMode } from "./cursor";
import History, { HistoryRecord } from "./history";

const CELL_DEFAULT_COLOR = "#a5a5a5";
const NORMAL_COLOR = "#00000080";
const VISUAL_COLOR = "#0000F080";
const CLEAR_COLOR = "#00000000";

export class Board {
    rows: number;
    columns: number;
    cursor = new Cursor();
    drawingColor = "red";
    visualMask: string[][];
    private history: History;

    constructor(columns: number, rows: number) {
        this.rows = columns;
        this.columns = rows;
        this.visualMask = Array(columns).fill(0).map(() => Array(rows).fill(CLEAR_COLOR));
        const historyInit = Array(columns).fill(0).map(() => Array(rows).fill(CELL_DEFAULT_COLOR));
        this.history = new History(historyInit, this.cursor.x, this.cursor.y);
    }

    moveToPreviousState() {
        const record = this.history.getPreviousState();
        this.cursor.switchToNormal();
        this.cursor.x = record.cursorX;
        this.cursor.y = record.cursorY;
    }

    moveToNextState() {
        const record = this.history.getNextState();
        this.cursor.switchToNormal();
        this.cursor.x = record.cursorX;
        this.cursor.y = record.cursorY;
    }

    currentBoard() {
        return this.history.currentRecord().board;
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

    moveCursorToRowStart() {
        const moves = this.cursor.y;
        this.moveCursorLeft(moves);
    }

    moveCursorToRowEnd() {
        const moves = this.rows - 1 - this.cursor.y;
        this.moveCursorRight(moves);
    }

    moveCursorToBottom() {
        const moves = this.rows - 1 - this.cursor.x;
        this.moveCursorDown(moves);
    }

    moveCursorToTop() {
        const moves = this.cursor.x;
        this.moveCursorUp(moves);
    }

    moveCursorToNextWord() {
        const record = this.history.currentRecord();
        const cords = this.findFirstPaintedCellForward(record);
        if (cords == undefined) {
            return;
        }

        if (cords[0] === record.cursorX) {
            this.moveCursorRight(cords[1] - record.cursorY);
        } else {
            this.moveCursorToRowEnd();
            const previousMode = this.cursor.mode;
            this.cursor.mode = CursorMode.Normal;
            this.moveCursorToRowStart();
            this.cursor.mode = previousMode;
            this.moveCursorDown(1);
            this.moveCursorRight(cords[1] - record.cursorY);
        }
    }

    moveCursorToPreviousWord() {
        const record = this.history.currentRecord();
        const cords = this.findFirstPaintedCellBackward(record);
        if (cords == undefined) {
            return;
        }

        if (cords[0] === record.cursorX) {
            this.moveCursorLeft(record.cursorY - cords[1]);
        } else {
            this.moveCursorToRowStart();
            const previousMode = this.cursor.mode;
            this.cursor.mode = CursorMode.Normal;
            this.moveCursorToRowEnd();
            this.cursor.mode = previousMode;
            this.moveCursorUp(1);
            this.moveCursorLeft(record.cursorY - cords[1]);
        }
    }

    private findPreviousWordBeggining(row: string[], startColumn: number): number | undefined {
        let startedSearch = false;
        for (let y = startColumn - 1; y >= 0; y--) {
            if (y === 0 && startedSearch) {
                return y;
            }

            if (row[y] !== CELL_DEFAULT_COLOR) {
                startedSearch = true;
            } else if (row[y] === CELL_DEFAULT_COLOR) {
                if (startedSearch) {
                    return y + 1;
                }
            }
        }

        return undefined;
    }

    private findFirstPaintedCellBackward(record: HistoryRecord): [number, number] | undefined {
        let row = record.cursorX;
        const column = this.findPreviousWordBeggining(record.board[row], record.cursorY);
        if (column !== undefined) {
            return [row, column];
        }

        row -= 1;
        if (record.cursorX < 0) {
            return undefined;
        }

        const previousRowColumn = this.findPreviousWordBeggining(record.board[row], this.columns - 1);
        if (previousRowColumn !== undefined) {
            return [row, previousRowColumn]
        }

        return [row, 0];
    }

    private findFirstPaintedCellForward(record: HistoryRecord): [number, number] | undefined {
        let startedSearch = false;
        let x = record.cursorX;
        for (let y = record.cursorY; y < this.columns; y++) {
            if (record.board[x][y] === CELL_DEFAULT_COLOR) {
                startedSearch = true;
            } else {
                if (startedSearch) {
                    return [x, y]
                }
            }
        }

        x += 1;
        if (x >= this.rows) {
            return undefined;
        }

        for (let y = 0; y < this.columns; y++) {
            if (record.board[x][y] !== CELL_DEFAULT_COLOR) {
                return [x, y]
            }
        }

        return [x, 0];
    }

    private moveCursorToPosition(x: number, y: number) {
        x = Math.min(Math.max(0, x), this.columns - 1);
        y = Math.min(Math.max(0, y), this.columns - 1);
        this.handleDrawing(this.cursor.x, x, this.cursor.y, y);
    }


    moveCursorRight(moves: number) {
        if (this.cursor.y < this.columns - 1) {
            const newPos = Math.min(this.cursor.y + moves, this.rows - 1);
            this.handleDrawing(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
            this.cursor.y = newPos;
            this.history.currentRecord().cursorY = newPos;
        }
    }

    moveCursorLeft(moves: number) {
        const newPos = Math.max(0, this.cursor.y - moves);
        this.handleDrawing(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
        this.cursor.y = newPos;
        this.history.currentRecord().cursorY = newPos;
    }

    moveCursorUp(moves: number) {
        const newPos = Math.max(0, this.cursor.x - moves);
        this.handleDrawing(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        this.cursor.x = newPos;
        this.history.currentRecord().cursorX = newPos;
    }

    moveCursorDown(moves: number) {
        const newPos = Math.min(this.cursor.x + moves, this.columns);
        this.handleDrawing(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        this.cursor.x = newPos;
        this.history.currentRecord().cursorX = newPos;
    }

    private handleDrawing(cursorOldX: number, cursorNewX: number, cursorOldY: number, cursorNewY: number) {
        if (this.cursor.inInsertMode()) {
            this.drawBoard(cursorOldX, cursorNewX, cursorOldY, cursorNewY);
        } else if (this.cursor.inAnyVisualMode()) {
            this.fillVisualMask(cursorNewX, cursorNewY);
        } else if (this.cursor.inDeleteMode()) {
            this.deleteArea(cursorOldX, cursorNewX, cursorOldY, cursorNewY);
        }
    }

    private drawBoard(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        const record = this.history.newRecord();
        this.fillArea(xStart, xEnd, yStart, yEnd, this.drawingColor, record.board);
    }

    deleteCell() {
        const record = this.history.newRecord();
        record.board[this.cursor.x][this.cursor.y] = CELL_DEFAULT_COLOR;
    }

    deleteArea(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        const record = this.history.newRecord();
        this.fillArea(xStart, xEnd, yStart, yEnd, CELL_DEFAULT_COLOR, record.board);
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

    private fillVisualNormalMode(startX: number, endX: number, startY: number, endY: number) {
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
        const record = this.history.newRecord();
        this.visualMask.forEach((row, i) => row.forEach((color, j) => {
            if (color === VISUAL_COLOR) {
                record.board[i][j] = this.drawingColor;
            }
        }));
        this.visualMaskReset();
        this.cursor.switchToNormal();
    }

    deleteVisualMask() {
        const record = this.history.newRecord();
        this.visualMask.forEach((row, i) => row.forEach((color, j) => {
            if (color === VISUAL_COLOR) {
                record.board[i][j] = CELL_DEFAULT_COLOR;
            }
        }));
        this.visualMaskReset();
        this.cursor.switchToNormal();
    }

    private fillArea(xStart: number, xEnd: number, yStart: number, yEnd: number, color: string, array: string[][]) {
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
