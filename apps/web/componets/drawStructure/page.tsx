export default function drawStructure(
    canvas: HTMLCanvasElement
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e: MouseEvent) => {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    };

    const onMouseUp = () => {
        isDrawing = false;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;

        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(startX, startY, width, height);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);


    return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);
    };
}