import express, { NextFunction, Request, Response, Router } from "express";
import jwt from 'jsonwebtoken'
import authMiddleware from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateuserSchema } from "@repo/common/types"

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "Hi, this is user route" });
});
router.post("/signup", (req, res) => {

    const data = CreateuserSchema.safeParse(req.body)
    if (!data) {
        res.json({
            msg: "user data is invalid "
        })
    }
    res.json({ msg: "Hi, this is user route" });
    const body = req.body

});

router.post("/signin", (req, res) => {
    res.json({ msg: "Hi, this is user route" });
    const body = req.body
    ////db logic

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    // if (!user) {
    //     res.json({
    //         msg: "no user is there "
    //     })
    // }
    res.json({
        token
    })

});

router.post("/room", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    res.json({
        msg: "hiii"
    })
})



export default router;