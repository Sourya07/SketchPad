import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { prisma } from "@repo/db/dbs"
import { parse } from "cookie";
import http from "http";


const PORT = Number(process.env.PORT) || 8080;


const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket server running");
});


const wss = new WebSocketServer({ server });


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

import { JWT_SECRET } from "@repo/backend-common/config"

interface userInterface {
    ws: WebSocket
    userId: string
    rooms: string[]

}

const users: userInterface[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch (e) {
        return null;
    }

}

wss.on('connection', (ws, req) => {
    ws.on('error', console.error);

    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        ws.close();
        return;
    }

    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })


    ws.on('message', async (data) => {

        let realmessage;
        try {
            realmessage = JSON.parse(data.toString());
        } catch (err) {
            console.log("Non-JSON message received:", data.toString());
            return;
        }
        // {
        //     type:join_room,
        //     roomId:....
        // }
        if (realmessage.type == "join_room") {
            const user = users.find(x => x.ws == ws)
            user?.rooms.push(realmessage.roomId)
        }
        // {
        //     type:leave_room,
        //     
        // }
        if (realmessage.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) return;

            user.rooms = user.rooms.filter(
                roomId => roomId !== realmessage.roomId
            );
        }


        //    {
        //   type:chat
        //  roomId:...
        //  message:...JWT_SECRET.
        //    } 
        if (realmessage.type === "chat") {
            const message = realmessage.message;
            const roomId = realmessage.roomId
            ////pipleline -> queue
            await prisma.chats.create({
                data: {
                    roomId,
                    message: message,
                    userId: userId
                }
            })
            users.filter(x => x.ws != ws).forEach(user => {
                if (user.rooms.includes(roomId)) {

                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId

                    }))
                }
            })

        }

    });


});