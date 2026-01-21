import express, { NextFunction, Request, Response, Router } from "express";
import jwt from 'jsonwebtoken'
import authMiddleware from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateuserSchema, signin, room } from "@repo/common/types"
import { prisma } from "@repo/db/dbs"
import bcrypt from "bcrypt"


const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "Hi, this is user route" });
});
router.post("/signup", async (req, res) => {

    console.log("hello")
    const parsed = CreateuserSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            msg: "User data is invalid",
            errors: parsed.error.flatten(),
        });
    }

    const { username, password, name } = parsed.data;
    console.log(username)

    const existingUser = await prisma.user.findUnique({
        where: { email: username },
    });

    if (existingUser) {
        return res.status(409).json({
            msg: "User already exists",
        });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
        data: {
            email: username,
            name,
            password: hashedPassword,
        },
    });

    return res.status(201).json({
        msg: "User created successfully",
        userId: user.id,
    });
});


router.post("/signin", async (req, res) => {
    const validation = signin.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            msg: "User data is invalid",
            errors: validation.error.flatten(),
        });
    }

    const { username, password } = validation.data;

    const user = await prisma.user.findUnique({
        where: { email: username },
    });

    if (!user) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true });

});
router.post("/room", authMiddleware, async (req, res) => {
    const parsedData = room.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore
    const userId = req.userId;

    try {
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

router.get("/chat/:id", authMiddleware, async (req, res) => {
    try {
        const roomId = Number(req.params.id);

        if (isNaN(roomId)) {
            return res.status(400).json({ error: "Invalid room id" });
        }

        const messages = await prisma.chats.findMany({
            where: {
                roomId: roomId,
            },
            orderBy: {
                id: "desc",
            },
            take: 50,
        });


        res.json({
            messages: messages.reverse(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});




router.get("/room/:slug", authMiddleware, async (req, res) => {
    try {
        const roomname = req.params.slug


        if (typeof roomname !== "string") {
            return res.status(400).json({ error: "Invalid room slug" });
        }

        const messages = await prisma.room.findFirst({
            where: {
                slug: roomname
            },

        });


        res.json({
            messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
export default router;