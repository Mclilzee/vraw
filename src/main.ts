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

array[0][0] = 1;
canvas.width =  CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const colorTable = ["#a5a5a5", "blue", "red"];
setInterval(() => drawTable(ctx), 5);
addEventListener("keypress", (e) => {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] != 1) {
                continue;
            }

            if (e.key == "l" && j < TILE_SIZE - 1) {
                array[i][j] = 0;
                array[i][j + 1] = 1;
            } else if (e.key == "h" && j > 0){
                array[i][j] = 0;
                array[i][j - 1] = 1;
            } else if (e.key == "j" && i < TILE_SIZE - 1) {
                array[i][j] = 0;
                array[i + 1][j] = 1;
            } else if (e.key == "k" && i > 0) {
                array[i][j] = 0;
                array[i - 1][j] = 1;
            }
            return;
        }
    }
});

function drawTable(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let lineHeight = Math.floor(i * TILE_SIZE);
            let lineWidth = Math.floor(j * TILE_SIZE);
            ctx.strokeRect(lineWidth, lineHeight, TILE_SIZE , TILE_SIZE);
            ctx.fillStyle = colorTable[array[i][j]];
            ctx.fillRect(lineWidth, lineHeight, TILE_SIZE , TILE_SIZE);
        }
    }
}
