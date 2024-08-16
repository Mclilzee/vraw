const boardCanvas = document.querySelector("#board-canvas") as HTMLCanvasElement;
if (boardCanvas == null) {
    throw Error("Canvas element was not found");
}

const boardCtx = boardCanvas.getContext("2d") as CanvasRenderingContext2D;
if (boardCtx == null) {
    throw Error("Context 2D is not supported");
}

const statusInfo = document.querySelector("#status-info") as HTMLCanvasElement;
if (statusInfo == null) {
    throw Error("Status info element was not found");
}

const statusInfoCtx = statusInfo.getContext("2d") as CanvasRenderingContext2D;
if (statusInfoCtx == null) {
    throw Error("Context 2D is not supported");
}

export { boardCtx, boardCanvas, statusInfo, statusInfoCtx };
