export class HistoryRecord {
  readonly board: string[][];
  readonly cursorX: number;
  readonly cursorY: number;

  constructor(board: string[][], cursorX: number, cursorY: number) {
    this.board = board;
    this.cursorX = cursorX;
    this.cursorY = cursorY;
  }

  clone(): HistoryRecord {
    const array: string[][] = [];
    for (let i = 0; i < this.board.length; i++) {
      array[i] = [];
      for (let j = 0; j < this.board[i].length; j++) {
        array[i][j] = this.board[i][j];
      }
    }

    return new HistoryRecord(array, this.cursorX, this.cursorY);
  }

}
export default class History {
  private index = 0;
  private history: HistoryRecord[] = [];

  constructor(boardInit: string[][], cursorX: number, cursorY: number) {
    this.history[0] = new HistoryRecord(boardInit, cursorX, cursorY);
  }

  currentRecord(): HistoryRecord {
    return this.history[this.index];
  }

  newRecord(): HistoryRecord {
    const latestHistory = this.history[this.index].clone();
    this.history[++this.index] = latestHistory;
    this.history = this.history.slice(0, this.index + 1);
    return latestHistory;
  }

  getPreviousState() {
    this.index = Math.max(0, this.index - 1);
    return this.history[this.index];
  }

  getNextState() {
    this.index = Math.min(this.index + 1, this.history.length - 1);
    return this.history[this.index];
  }
}
