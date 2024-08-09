const INSERT_COLOR = "#00F000F0";
const NORMAL_COLOR = "#101010F0";
const VISUAL_COLOR = "#0000F0F0";

export enum Mode {
    Insert,
    Normal,
    Visual,
    Delete,
}

export class Cursor {
    x = 0;
    y = 0;
    mode = Mode.Normal;

    inInsertMode() {
        return this.mode == Mode.Insert;
    }

    inNormalMode() {
        return this.mode == Mode.Normal;
    }

    inVisualMode() {
        return this.mode == Mode.Visual;
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
    }

    switchToDelete() {
        this.mode = Mode.Delete;
    }

    color(): string {
        switch (this.mode) {
            case Mode.Insert:
                return INSERT_COLOR
            case Mode.Visual:
                return VISUAL_COLOR
            default:
                return NORMAL_COLOR
        }
    }
}
