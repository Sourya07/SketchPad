"use client";

import { useRef, useEffect } from "react";
import Drawstructure from "../../../componets/drawStructure/page";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        Drawstructure(canvas)
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