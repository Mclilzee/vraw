const boardCanvas = document.querySelector("#board-canvas") as HTMLCanvasElement;
if (boardCanvas == null) {
    throw Error("Canvas were not found");
}

const boardCtx = boardCanvas.getContext("2d") as CanvasRenderingContext2D;
if (boardCtx == null) {
    throw Error("Context 2D is not supported");
}

export { boardCtx, boardCanvas };
