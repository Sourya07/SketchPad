"use client";

import { useRef, useEffect, useState } from "react";
import Drawstructure from "../../../componets/drawStructure/page";
export type Tool = "rect" | "circle" | "triangle";
export default function Canvas() {
    const [tool, setTool] = useState<Tool>("circle");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        Drawstructure(canvas, () => tool)
    }, [])

    return (
        <div className="p-4">
            <canvas
                ref={canvasRef}
                width={1080}
                height={700}
                className="border border-border bg-background"
            />
        </div>
    );
}