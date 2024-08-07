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
        this.cursor.y = 0;
    }

    moveToRowEnd() {
        this.cursor.y = this.width - 1;
    }

    moveCursorRight(moves: number) {
        let newPos = this.cursor.y + moves;
        if (newPos > this.width - 1) {
            newPos = this.width - 1;
        }
        this.cursor.y = newPos;
    }

    moveCursorLeft(moves: number) {
        let newPos = this.cursor.y - moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.cursor.y = newPos;
    }

    moveCursorUp(moves: number) {
        let newPos = this.cursor.x - moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.cursor.x = newPos;
    }

    moveCursorDown(moves: number) {
        let newPos = this.cursor.x + moves;
        if (newPos > this.height - 1) {
            newPos = this.height - 1;
        }
        this.cursor.x = newPos;
    }

    handleInput(input: string) {
        if (input == "0" && this.moves == 1) {
            if (this.cursor.inInsertMode() || this.cursor.inDeleteMode()) {
                for (let i = this.cursor.y; i >= 0; i--) {
                    this.board[this.cursor.x][i] = this.cursor.inInsertMode() ? 1 : 0;
                }
            }
            this.cursor.y = 0;
        } else {
            const num = parseInt(input);
            if (!isNaN(num)) {
                this.moves = this.moves == 1 ? num : this.moves * 10 + num;
            }
        }

        switch (input) {
            case "i": this.cursor.switchToInsert(); break;
            case "Escape": this.cursor.switchToNormal(); break;
            //case "l": this.cursor.moveCursorRight(); break;
            //case "h": this.cursor.moveCursorLeft(); break;
            //case "k": this.cursor.moveCursorUp(); break;
            //case "j": this.cursor.moveCursorDown(); break;
            case "x": this.board[this.cursor.x][this.cursor.y] = 0; break;
            case "D": ; break;
            case "$": {
                if (this.cursor.inInsertMode() || this.cursor.inDeleteMode()) {
                    for (let i = this.cursor.y; i < this.width - 1; i++) {
                        this.board[this.cursor.x][i] = this.cursor.inInsertMode() ? 1 : 0;
                    }
                }

                this.cursor.y = this.width - 1;
                break;
            };
            case "d": {
                if (this.cursor.inDeleteMode()) {
                    deleteLine();
                    this.cursor.switchToNormalMode();
                } else {
                    this.cursor.switchToDeleteMode();
                }

            };
        }

        if (this.cursor.inInsertMode()) {
            array[this.cursor.x][cursor.y] = 1;
        }

        numStr = "";
    }
}

