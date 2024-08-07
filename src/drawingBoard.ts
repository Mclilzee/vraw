import { Cursor } from "./cursor";
const CELL_DEFAULT_COLOR = "#a5a5a5";

enum Operation {
    Delete,
    Draw,
    Move,
}

export class DrawingBoard {
    cursor = new Cursor();
    width: number;
    height: number;
    board: string[][];
    moves = 1;
    drawingColor = "black";

    constructor(width: number, height: number) {
        this.board = Array(height).fill(0).map(() => Array(width).fill(CELL_DEFAULT_COLOR));
        this.width = width;
        this.height = height;
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

        if (this.cursor.inInsertMode()) {
            this.drawArea(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
        } else if (this.cursor.inDeleteMode()) {
            this.deleteArea(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
        }

        this.cursor.y = newPos;
        this.moves = 0;
    }

    moveCursorLeft() {
        let newPos = this.cursor.y - (this.moves == 0 ? 1 : this.moves);
        if (newPos < 0) {
            newPos = 0;
        }

        if (this.cursor.inInsertMode()) {
            this.drawArea(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
        } else if (this.cursor.inDeleteMode()) {
            this.deleteArea(this.cursor.x, this.cursor.x, this.cursor.y, newPos);
        }

        this.cursor.y = newPos;
        this.moves = 0;
    }

    moveCursorUp() {
        let newPos = this.cursor.x - (this.moves == 0 ? 1 : this.moves);
        if (newPos < 0) {
            newPos = 0;
        }

        if (this.cursor.inInsertMode()) {
            this.drawArea(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        } else if (this.cursor.inDeleteMode()) {
            this.deleteArea(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        }

        this.cursor.x = newPos;
        this.moves = 0;
    }

    moveCursorDown() {
        let newPos = this.cursor.x + (this.moves == 0 ? 1 : this.moves);
        if (newPos > this.height - 1) {
            newPos = this.height - 1;
        }

        if (this.cursor.inInsertMode()) {
            this.drawArea(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        } else if (this.cursor.inDeleteMode()) {
            this.deleteArea(this.cursor.x, newPos, this.cursor.y, this.cursor.y);
        }

        this.cursor.x = newPos;
        this.moves = 0;
    }

    drawArea(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.fillArea(xStart, xEnd, yStart, yEnd, this.drawingColor);
    }

    deleteArea(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.fillArea(xStart, xEnd, yStart, yEnd, CELL_DEFAULT_COLOR);
        this.cursor.switchToNormal();
    }

    fillArea(xStart: number, xEnd: number, yStart: number, yEnd: number, color: string) {
        let iStart = Math.min(xStart, xEnd);
        let iEnd  = Math.max(xStart, xEnd);
        const jStart = Math.min(yStart, yEnd);
        const jEnd = Math.max(yStart, yEnd);
        for(let i = iStart; i <= iEnd; i++){
            for (let j = jStart; j <= jEnd; j++) {
                this.board[i][j] = color;
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
            case "i": this.cursor.switchToInsert(); break;
            case "Escape": this.cursor.switchToNormal(); break;
            case "l": this.moveCursorRight(); break;
            case "h": this.moveCursorLeft(); break;
            case "k": this.moveCursorUp(); break;
            case "j": this.moveCursorDown(); break;
            case "x": this.board[this.cursor.x][this.cursor.y] = CELL_DEFAULT_COLOR; break;
            case "D": ; break;
            case "$": this.moveToRowEnd(); break;
            case "d": {
                if (this.cursor.inDeleteMode()) {
                    this.board[this.cursor.x].map(() => 0);
                    this.cursor.switchToNormal();
                } else {
                    this.cursor.switchToDelete();
                }

            };
        }
    }
}
