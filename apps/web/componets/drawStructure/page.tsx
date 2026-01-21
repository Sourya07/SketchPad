import { Shape, Tool } from "./type";

export default function drawStructure(
    canvas: HTMLCanvasElement,
    getActiveTool: () => Tool,
    onShapeCreated?: (shape: Shape) => void
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    const camera = {
        x: 0,
        y: 0,
        zoom: 1,
    };

    let isDrawing = false;
    let isPanning = false;

    let startX = 0;
    let startY = 0;

    let lastX = 0;
    let lastY = 0;

    const shapes: Shape[] = [];
    let currentPencilPath: { x: number; y: number }[] | null = null;

    const screenToWorld = (x: number, y: number) => ({
        x: x / camera.zoom + camera.x,
        y: y / camera.zoom + camera.y,
    });

    const worldToScreen = (x: number, y: number) => ({
        x: (x - camera.x) * camera.zoom,
        y: (y - camera.y) * camera.zoom,
    });

    const redrawAll = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const shape of shapes) {
            ctx.beginPath();

            if (shape.type === "rect") {
                const p = worldToScreen(shape.x, shape.y);
                ctx.strokeRect(
                    p.x,
                    p.y,
                    shape.width * camera.zoom,
                    shape.height * camera.zoom
                );
            }

            if (shape.type === "circle") {
                const p = worldToScreen(shape.cx, shape.cy);
                ctx.arc(
                    p.x,
                    p.y,
                    shape.r * camera.zoom,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }

            if (shape.type === "triangle") {
                const p1 = worldToScreen(shape.x1, shape.y1);
                const p2 = worldToScreen(shape.x2, shape.y2);
                const p3 = worldToScreen(shape.x3, shape.y3);

                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.stroke();
            }

            if (shape.type === "pencil") {
                shape.points.forEach((point, index) => {
                    const p = worldToScreen(point.x, point.y);
                    if (index === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }
        }
    };

    const onMouseDown = (e: MouseEvent) => {
        if (e.button === 1 || e.shiftKey) {
            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
            return;
        }

        isDrawing = true;
        const world = screenToWorld(e.offsetX, e.offsetY);
        startX = world.x;
        startY = world.y;

        if (getActiveTool() === "pencil") {
            currentPencilPath = [{ x: world.x, y: world.y }];
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (isPanning) {
            camera.x -= (e.clientX - lastX) / camera.zoom;
            camera.y -= (e.clientY - lastY) / camera.zoom;

            lastX = e.clientX;
            lastY = e.clientY;

            redrawAll();
            return;
        }

        if (!isDrawing) return;

        const world = screenToWorld(e.offsetX, e.offsetY);
        const tool = getActiveTool();

        if (tool === "pencil" && currentPencilPath) {
            currentPencilPath.push({ x: world.x, y: world.y });
        }

        redrawAll();
        ctx.beginPath();

        if (tool === "rect") {
            const p = worldToScreen(startX, startY);
            ctx.strokeRect(
                p.x,
                p.y,
                (world.x - startX) * camera.zoom,
                (world.y - startY) * camera.zoom
            );
        }

        if (tool === "circle") {
            const p = worldToScreen(startX, startY);
            ctx.arc(
                p.x,
                p.y,
                Math.hypot(world.x - startX, world.y - startY) * camera.zoom,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }

        if (tool === "triangle") {
            const p1 = worldToScreen(startX, world.y);
            const p2 = worldToScreen((startX + world.x) / 2, startY);
            const p3 = worldToScreen(world.x, world.y);

            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
        }

        if (tool === "pencil" && currentPencilPath) {
            currentPencilPath.forEach((point, index) => {
                const p = worldToScreen(point.x, point.y);
                if (index === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (isPanning) {
            isPanning = false;
            return;
        }

        if (!isDrawing) return;
        isDrawing = false;

        const world = screenToWorld(e.offsetX, e.offsetY);
        const tool = getActiveTool();

        if (tool === "rect") {
            const shape: Shape = {
                type: "rect",
                x: startX,
                y: startY,
                width: world.x - startX,
                height: world.y - startY,
            };
            shapes.push(shape);
            onShapeCreated?.(shape);
        }

        if (tool === "circle") {
            const shape: Shape = {
                type: "circle",
                cx: startX,
                cy: startY,
                r: Math.hypot(world.x - startX, world.y - startY),
            };
            shapes.push(shape);
            onShapeCreated?.(shape);
        }

        if (tool === "triangle") {
            const shape: Shape = {
                type: "triangle",
                x1: startX,
                y1: world.y,
                x2: (startX + world.x) / 2,
                y2: startY,
                x3: world.x,
                y3: world.y,
            };
            shapes.push(shape);
            onShapeCreated?.(shape);
        }

        if (tool === "pencil" && currentPencilPath) {
            const shape: Shape = {
                type: "pencil",
                points: currentPencilPath,
            };
            shapes.push(shape);
            onShapeCreated?.(shape);
            currentPencilPath = null;
        }

        redrawAll();
    };

    const onWheel = (e: WheelEvent) => {
        if (!e.ctrlKey) return;

        e.preventDefault();
        const zoomFactor = 1.1;
        camera.zoom *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

        redrawAll();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    redrawAll();

    return {
        destroy: () => {
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseup", onMouseUp);
            canvas.removeEventListener("wheel", onWheel);
        },
        addRemoteShape: (shape: Shape) => {
            shapes.push(shape);
            redrawAll();
        },
    };
}