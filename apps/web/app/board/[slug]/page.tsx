"use client";

import { useRef, useEffect, useState, use } from "react";
import Drawstructure from "../../../componets/drawStructure/page";
import { BACKEND_URL, WEBSOCKET } from "../../../server";
import axios from "axios";
import { useRouter } from "next/navigation";

export type Tool = "rect" | "circle" | "triangle" | "pencil";

export default function Canvas({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: roomName } = use(params);
    const [tool, setTool] = useState<Tool>("pencil");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {

        const init = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/v1/room/${roomName}`, {
                    withCredentials: true
                });

                const rID = response.data.messages?.id;
                if (!rID) {
                    console.error("Room not found");
                    return;
                }
                setRoomId(rID);

                const ws = new WebSocket(`${WEBSOCKET}?token=cookie_auth`);

                ws.onopen = () => {
                    setSocket(ws);
                    ws.send(JSON.stringify({
                        type: "join_room",
                        roomId: rID
                    }));
                };
            } catch (e: unknown) {
                const err = e as { response?: { status: number } };
                if (err.response?.status === 401) {
                    router.push("/signin");
                }
                console.error(e);
            }
        };
        init();
    }, [roomName, router]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !socket || !roomId) return;

        const drawHandlers = Drawstructure(canvas, () => tool, (shape) => {
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: roomId
            }));
        });

        if (!drawHandlers) return;
        const { destroy, addRemoteShape } = drawHandlers;

        const loadExistingShapes = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/v1/chat/${roomId}`, {
                    withCredentials: true
                });
                const messages = response.data.messages || [];
                messages.forEach((msg: { message: string }) => {
                    try {
                        const shape = JSON.parse(msg.message);
                        addRemoteShape(shape);
                    } catch {

                    }
                });
            } catch (e) {
                console.error(e);
            }
        };
        loadExistingShapes();
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "chat") {
                    const shape = JSON.parse(data.message);
                    addRemoteShape(shape);
                }
            } catch {
                // Ignore non-shape messages or parse errors
            }
        };

        return () => {
            destroy();
            socket.onmessage = null;
        };
    }, [tool, socket, roomId]);
    const getCanvasSize = () => {
        const width = window.innerWidth;

        if (width >= 1280) {
            // Large desktop
            return { w: 3000, h: 800 };
        }

        if (width >= 1024) {
            // Desktop
            return { w: 1200, h: 750 };
        }

        if (width >= 640) {
            // Tablet
            return { w: 1400, h: 800 };
        }

        // Mobile
        return { w: 700, h: 500 };
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const { w, h } = getCanvasSize();
            canvas.width = w;
            canvas.height = h;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    return (
        <div className="p-4 flex gap-4">
            {/* Canvas */}


            <div className="overflow-x-auto flex justify-center">
                <canvas
                    ref={canvasRef}
                    className="border border-border bg-background rounded-lg"
                />
            </div>
            {/* Toolbar */}
            <div className="flex flex-col gap-3 w-full p-3 rounded-lg bg-black/40 border border-white/10">

                {(["pencil", "rectangle", "circle", "triangle"] as Tool[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTool(t)}
                        className={`
                    w-24 py-2 rounded-md text-sm capitalize
                    transition-all duration-150
                    ${tool === t
                                ? "bg-white text-black font-semibold"
                                : "bg-black text-white border border-white/20 hover:bg-white/10"}
                `}
                    >
                        {t}
                    </button>
                ))}
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                    <span className="font-semibold">Shift + Drag</span> to move around the canvas ·
                    <span className="font-semibold"> Ctrl + Scroll</span> to zoom in and out
                </p>
            </div>
        </div>

    );
}