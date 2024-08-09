export enum Mode {
    Insert,
    Normal,
    Visual,
    VisualBlock,
    VisualLine,
    Delete,
}

export class Cursor {
    x = 0;
    y = 0;
    visualStartIndex: [number, number] = [0, 0];
    mode = Mode.Normal;

    inInsertMode() {
        return this.mode == Mode.Insert;
    }

    inNormalMode() {
        return this.mode == Mode.Normal;
    }

    inAnyVisualMode() {
        return (this.mode == Mode.Visual || this.mode == Mode.VisualLine || this.mode == Mode.VisualBlock);
    }

    inVisualMode() {
        return this.mode == Mode.Visual;
    }

    inVisualBlockMode() {
        return this.mode == Mode.VisualBlock;
    }

    inVisualLineMode() {
        return this.mode == Mode.VisualLine;
    }

    inDeleteMode() {
        return this.mode == Mode.Delete;
    }

    switchToInsert() {
        this.mode = Mode.Insert;
    }

    switchToNormal() {
        this.mode = Mode.Normal;
    }

    switchToVisual() {
        this.mode = Mode.Visual;
        this.visualStartIndex = [this.x, this.y]
    }

    switchToVisualBlock() {
        this.mode = Mode.VisualBlock;
        this.visualStartIndex = [this.x, this.y]
    }

    switchToVisualLine() {
        this.mode = Mode.VisualLine;
        this.visualStartIndex = [this.x, this.y]
    }

    switchToDelete() {
        this.mode = Mode.Delete;
    }

}
