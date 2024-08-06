import './style.css'
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
if (canvas == null) {
    throw Error("Canvas were not found");
}

const ctx = canvas.getContext("2d");
if (ctx == null) {
    throw Error("Context 2D is not supported");
}

let array = Array(40).fill(Array(40).fill(0));
canvas.width =  400;
canvas.height = 400;

for (let i = 0; i < canvas.width / 40; i++) {
    for (let j = 0; j < canvas.height / 40; j++) {
        let lineWidth = Math.floor(i * 40);
        let lineHeight = Math.floor(j * 40);

        ctx.strokeRect(lineWidth, lineHeight, 40 , 40);
        ctx.fillStyle = "#a5a5a5";
        ctx.fillRect(lineWidth, lineHeight, 40 , 40);
    }
}
