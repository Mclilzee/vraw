const canvas = document.querySelector("#board-canvas") as HTMLCanvasElement;
if (canvas == null) {
    throw Error("Canvas were not found");
}

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (ctx == null) {
    throw Error("Context 2D is not supported");
}

export { ctx, canvas };
