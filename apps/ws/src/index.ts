import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken"

const wss = new WebSocketServer({ port: 8080 });

const JWT_SECRET = "aeios";
wss.on('connection', function connection(ws, req) {
    ws.on('error', console.error);
    const url = new URL(req.url ?? "");
    const token = url.searchParams.get("token");

    if (!token) return null;

    try {
        const JWT_SECRET = "supersecretkey123";
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null;
    }

    ws.on('message', function message(data) {
        let realmessage;
        try {
            realmessage = JSON.parse(data.toString());
        } catch (err) {
            console.log("Non-JSON message received:", data.toString());
            return; // ignore ping / junk
        }

    });

    ws.send('something');
});