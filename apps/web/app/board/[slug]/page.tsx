"use client";

import { useRef, useEffect, useState, use } from "react";
import Drawstructure from "../../../componets/drawStructure/page";
import { BACKEND_URL, WEBSOCKET } from "../../../server";
import axios from "axios";
import { useRouter } from "next/navigation";

export type Tool = "rect" | "circle" | "triangle";

export default function Canvas({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: roomName } = use(params);
    const [tool] = useState<Tool>("circle");
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