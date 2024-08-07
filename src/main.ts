import './style.css'
import { canvas, ctx } from './elements';
import { DrawingBoard } from './input';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const board = new DrawingBoard(TILE_SIZE, TILE_SIZE);
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const colorTable = ["#a5a5a5", "blue"];
draw(board);
addEventListener("keydown", (e) => {
    board.handleInput(e.key);
    draw(board);
});

function draw(board: DrawingBoard) {
    const width = canvas.width / board.width;
    const height = canvas.height / board.height;
    for (let i = 0; i < board.width; i++) {
        for (let j = 0; j < board.height; j++) {
            ctx.strokeRect(j * width, i * height, width, height);
            ctx.fillStyle = colorTable[board.board[i][j]];
            ctx.fillRect(j * width, i * height, width, height);
        }
    }

    ctx.fillStyle = board.cursor.inNormalMode() ? "black" : "red"
    ctx.fillRect(board.cursor.y * width, board.cursor.x * height, width, height);
}
