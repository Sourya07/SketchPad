

import { Shape, Tool } from "./type"

export default function drawStructure(
    canvas: HTMLCanvasElement,
    getActiveTool: () => Tool
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;


    const shapes: Shape[] = [];

    const redrawAll = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const shape of shapes) {
            ctx.beginPath();

            if (shape.type === "rect") {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }

            if (shape.type === "circle") {
                ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (shape.type === "triangle") {
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.lineTo(shape.x3, shape.y3);
                ctx.closePath();
                ctx.stroke();
            }
        }
    };

    const onMouseDown = (e: MouseEvent) => {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isDrawing) return;
        isDrawing = false;

        const endX = e.offsetX;
        const endY = e.offsetY;
        const tool = getActiveTool();

        if (tool === "rect") {
            shapes.push({
                type: "rect",
                x: startX,
                y: startY,
                width: endX - startX,
                height: endY - startY,
            });
        }

        if (tool === "circle") {
            shapes.push({
                type: "circle",
                cx: startX,
                cy: startY,
                r: Math.hypot(endX - startX, endY - startY),
            });
        }

        if (tool === "triangle") {
            shapes.push({
                type: "triangle",
                x1: startX,
                y1: endY,
                x2: (startX + endX) / 2,
                y2: startY,
                x3: endX,
                y3: endY,
            });
        }

        redrawAll();
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;

        redrawAll();

        const tool = getActiveTool();
        ctx.beginPath();

        if (tool === "rect") {
            ctx.strokeRect(
                startX,
                startY,
                e.offsetX - startX,
                e.offsetY - startY
            );
        }

        if (tool === "circle") {
            ctx.arc(
                startX,
                startY,
                Math.hypot(e.offsetX - startX, e.offsetY - startY),
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }

        if (tool === "triangle") {
            ctx.moveTo(startX, e.offsetY);
            ctx.lineTo((startX + e.offsetX) / 2, startY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.stroke();
        }
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