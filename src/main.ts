import './style.css'
import { canvas, ctx } from './elements';
import { Cursor } from './cursor';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const array = Array(TILE_SIZE).fill(0).map(() => Array(TILE_SIZE).fill(0));
const cursor = new Cursor(TILE_SIZE, TILE_SIZE);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let numStr = "";

const colorTable = ["#a5a5a5", "blue"];
drawTable();
addEventListener("keydown", (e) => {
    if (e.key == "0" && numStr.length == 0) {
        const y = cursor.getY();
        let x = cursor.getX();
        cursor.moveToRowStart();
        if (cursor.inInsertMode()) {
            for (let i = y; i >= 0; i--) {
                array[x][i] = 1;
            }
        }
    } else if (!isNaN(parseInt(e.key))) {
        numStr += e.key;
        return;
    }

    let num = 1;
    if (numStr.length > 0) {
        num = parseInt(numStr);
    }

    switch (e.key) {
        case "i": cursor.switchModeToInsert(); break;
        case "Escape": cursor.switchModeToNormal(); break;
        case "l": cursor.moveCursorRight(num); break;
        case "h": cursor.moveCursorLeft(num); break;
        case "k": cursor.moveCursorUp(num); break;
        case "j": cursor.moveCursorDown(num); break;
        case "$": cursor.moveToRowEnd(); break;
    }

    if (cursor.inInsertMode()) {
        array[cursor.getX()][cursor.getY()] = 1;
    }

    numStr = "";
    drawTable();
});

function drawTable() {
    const width = canvas.width / TILE_SIZE;
    const height = canvas.height / TILE_SIZE;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            ctx.strokeRect(j * width, i * height, width, height);
            ctx.fillStyle = colorTable[array[i][j]];
            ctx.fillRect(j * width, i * height, width, height);
        }
    }

    ctx.fillStyle = cursor.inNormalMode() ? "black" : "red"
    ctx.fillRect(cursor.getY() * width, cursor.getX() * height, width, height);
}
