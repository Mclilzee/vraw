export enum CursorMode {
  Normal,
  Insert,
  Visual,
  VisualLine,
  VisualBlock,
  Delete,
}

export class Cursor {
  x = 0;
  y = 0;
  visualStartIndex: [number, number] = [0, 0];
  mode = CursorMode.Normal;

  inInsertMode() {
    return this.mode == CursorMode.Insert;
  }

  inNormalMode() {
    return this.mode == CursorMode.Normal;
  }

  inAnyVisualMode() {
    return (this.mode == CursorMode.Visual || this.mode == CursorMode.VisualLine || this.mode == CursorMode.VisualBlock);
  }

  inVisualMode() {
    return this.mode == CursorMode.Visual;
  }

  inVisualBlockMode() {
    return this.mode == CursorMode.VisualBlock;
  }

  inVisualLineMode() {
    return this.mode == CursorMode.VisualLine;
  }

  inDeleteMode() {
    return this.mode == CursorMode.Delete;
  }

  switchToInsert() {
    this.mode = CursorMode.Insert;
  }

  switchToNormal() {
    this.mode = CursorMode.Normal;
  }

  switchToVisual() {
    this.mode = CursorMode.Visual;
    this.visualStartIndex = [this.x, this.y]
  }

  switchToVisualBlock() {
    this.mode = CursorMode.VisualBlock;
    this.visualStartIndex = [this.x, this.y]
  }

  switchToVisualLine() {
    this.mode = CursorMode.VisualLine;
    this.visualStartIndex = [this.x, this.y]
  }

  switchToDelete() {
    this.mode = CursorMode.Delete;
  }

  getCursorLineInfo(): string {
    const modes = ['-- NORMAL --', '-- INSERT --', '-- VISUAL --', '-- VISUAL LINE --', '-- VISUAL BLOCK --']
    return modes[this.mode];
  }
}
