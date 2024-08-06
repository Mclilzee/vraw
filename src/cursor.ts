enum CursorMode {
    Insert,
    Normal,
    Visual
}

export class Cursor {
    private x = 0;
    private y = 0;
    private xBoundary;
    private yBoundary;
    private mode = CursorMode.Normal;

    constructor(xBoundary: number, yBoundary: number) {
        this.xBoundary = xBoundary;
        this.yBoundary = yBoundary;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    switchModeToInsert() {
        this.mode = CursorMode.Insert;
    }

    switchModeToNormal() {
        this.mode = CursorMode.Normal;
    }

    switchModeToVisual() {
        this.mode = CursorMode.Visual;
    }

    inInsertMode(): boolean {
        return this.mode == CursorMode.Insert;
    }

    inNormalMode(): boolean {
        return this.mode == CursorMode.Normal;
    }

    inVisualMode(): boolean {
        return this.mode == CursorMode.Visual;
    }

    moveToRowStart() {
        this.y = 0;
    }
    
    moveToRowEnd() {
        this.y = this.xBoundary - 1;
    }

    moveCursorRight(moves: number) {
        let newPos = this.y + moves;
        if (newPos > this.xBoundary - 1) {
            newPos = this.xBoundary - 1;
        }
        this.y = newPos;
    }

    moveCursorLeft(moves: number) {
        let newPos = this.y - moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.y = newPos;
    }

    moveCursorUp(moves: number) {
        let newPos = this.x - moves;
        if (newPos < 0) {
            newPos = 0;
        }
        this.x = newPos;
    }

    moveCursorDown(moves: number) {
        let newPos = this.x + moves;
        if (newPos > this.yBoundary - 1) {
            newPos = this.yBoundary - 1;
        }
        this.x = newPos;
    }
}
