import './style.css'
import { canvas, ctx } from './elements';
const TILE_SIZE = 40;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

enum MotionMode {
    Insert,
    Normal
}

const array = Array(TILE_SIZE).fill(0).map(() => Array(TILE_SIZE).fill(0));
const cursorPosition: [number, number, MotionMode] = [0, 0, MotionMode.Normal];


canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let numStr = "";

const colorTable = ["#a5a5a5", "blue"];
drawTable();
addEventListener("keydown", (e) => {
    if (e.key == "0" && numStr.length == 0) {
        cursorPosition[1] = 0;
    } else if (!isNaN(parseInt(e.key))) {
        numStr += e.key;
        return;
    }

    let num = 1;
    if (numStr.length > 0) {
        num = parseInt(numStr);
    }

    switch (e.key) {
        case "i": cursorPosition[2] = MotionMode.Insert; break;
        case "Escape": cursorPosition[2] = MotionMode.Normal; break;
        case "l": moveCursorRight(num); break;
        case "h": moveCursorLeft(num); break;
        case "k": moveCursorUp(num); break;
        case "j": moveCursorDown(num); break;
        case "$": cursorPosition[1] = TILE_SIZE - 1; break;

    }

    if (cursorPosition[2] == MotionMode.Insert) {
        array[cursorPosition[0]][cursorPosition[1]] = 1;
    }

    numStr = "";
    drawTable();
});

function moveCursorRight(moves: number) {
    let newPos = cursorPosition[1] + moves;
    if (newPos > TILE_SIZE - 1) {
        newPos = TILE_SIZE - 1;
    }
    cursorPosition[1] = newPos;
}

function moveCursorLeft(moves: number) {
    let newPos = cursorPosition[1] - moves;
    if (newPos < 0) {
        newPos = 0;
    }
    cursorPosition[1] = newPos;
}

function moveCursorUp(moves: number) {
    let newPos = cursorPosition[0] - moves;
    if (newPos < 0) {
        newPos = 0;
    }
    cursorPosition[0] = newPos;
}

function moveCursorDown(moves: number) {
    let newPos = cursorPosition[0] + moves;
    if (newPos > TILE_SIZE - 1) {
        newPos = TILE_SIZE - 1;
    }
    cursorPosition[0] = newPos;
}

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

    ctx.fillStyle = cursorPosition[2] == MotionMode.Normal ? "black" : "red"
    ctx.fillRect(cursorPosition[1] * width, cursorPosition[0] * height, width, height);
}
