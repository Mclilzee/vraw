import { Cursor } from "./cursor";

export class DrawingBoard {
    cursor = new Cursor();
    width: number;
    height: number;
    board: number[][];
    moves = 1;

    constructor(width: number, height: number) {
        this.board = Array(height).fill(0).map(() => Array(width).fill(0));
        this.width = width;
        this.height = height;
    }


    moveToRowStart() {
        this.moves = this.cursor.y;
        this.moveCursorLeft();
    }

    moveToRowEnd() {
        this.moves = this.cursor.y - this.width - 1;
        this.moveCursorRight();
    }

    moveCursorRight() {
        let newPos = this.cursor.y + this.moves;
        if (newPos > this.width - 1) {
            newPos = this.width - 1;
        }
        this.cursor.y = newPos;
    }

    moveCursorLeft() {
        let newPos = this.cursor.y - this.moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.cursor.y = newPos;
    }

    moveCursorUp() {
        let newPos = this.cursor.x - this.moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.cursor.x = newPos;
    }

    moveCursorDown() {
        let newPos = this.cursor.x + this.moves;
        if (newPos > this.height - 1) {
            newPos = this.height - 1;
        }
        this.cursor.x = newPos;
    }

    handleInput(input: string) {
        if (input == "0" && this.moves == 1) {
            this.moveToRowStart();
        } else {
            const num = parseInt(input);
            if (!isNaN(num)) {
                this.moves = this.moves == 1 ? num : this.moves * 10 + num;
            }
        }

        switch (input) {
            case "i": this.cursor.switchToInsert(); break;
            case "Escape": this.cursor.switchToNormal(); break;
            case "l": this.moveCursorRight(); break;
            case "h": this.moveCursorLeft(); break;
            case "k": this.moveCursorUp(); break;
            case "j": this.moveCursorDown(); break;
            case "x": this.board[this.cursor.x][this.cursor.y] = 0; break;
            case "D": ; break;
            case "$": this.moveToRowEnd; break;
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
