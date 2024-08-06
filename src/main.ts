import './style.css'
const TILE_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const array = Array(TILE_SIZE).fill(0).map(() => Array(TILE_SIZE).fill(0));

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
if (canvas == null) {
    throw Error("Canvas were not found");
}

const ctx = canvas.getContext("2d");
if (ctx == null) {
    throw Error("Context 2D is not supported");
}

enum MotionMode {
    Insert,
    Normal
}

const cursorPosition: [number, number, MotionMode] = [0, 0, MotionMode.Normal];

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let numStr = "";

const colorTable = ["#a5a5a5", "blue"];
setInterval(() => drawTable(ctx), 5);
addEventListener("keydown", (e) => {
    if (!isNaN(parseInt(e.key))) {
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

    }

    if (cursorPosition[2] == MotionMode.Insert) {
        array[cursorPosition[0]][cursorPosition[1]] = 1;
    }

    numStr = "";
});

function moveCursorRight(moves: number) {
    let newPos = cursorPosition[1] + moves;
    console.log(newPos);
    if (newPos > TILE_SIZE - 1) {
        newPos = TILE_SIZE - 1;
    }
    cursorPosition[1] = newPos;
}

function moveCursorLeft(moves: number) {
    if (cursorPosition[1] > 0) {
        cursorPosition[1]--;
    }
}

function moveCursorUp(moves: number) {
    if (cursorPosition[0] > 0) {
        cursorPosition[0]--;
    }
}

function moveCursorDown(moves: number) {
    if (cursorPosition[0] < TILE_SIZE - 1) {
        cursorPosition[0]++;
    }
}

function drawTable(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let lineHeight = Math.floor(i * TILE_SIZE);
            let lineWidth = Math.floor(j * TILE_SIZE);
            ctx.strokeRect(lineWidth, lineHeight, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = colorTable[array[i][j]];
            ctx.fillRect(lineWidth, lineHeight, TILE_SIZE, TILE_SIZE);
        }
    }

    let lineHeight = Math.floor(cursorPosition[0] * TILE_SIZE);
    let lineWidth = Math.floor(cursorPosition[1] * TILE_SIZE);
    ctx.fillStyle = cursorPosition[2] == MotionMode.Normal ? "black" : "red";
    ctx.fillRect(lineWidth, lineHeight, TILE_SIZE, TILE_SIZE);
}
