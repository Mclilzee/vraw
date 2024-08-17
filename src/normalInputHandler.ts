import { board, cursor } from "./main";
import { renderBoard, renderStatusInfo } from "./render";

export default function handleInput(e: KeyboardEvent) {
  board.handleInput(e.key);
  renderBoard(board);
  renderStatusInfo(cursor.getCursorLineInfo(), "orange");
}
