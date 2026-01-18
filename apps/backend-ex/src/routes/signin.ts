import express, { NextFunction, Request, Response, Router } from "express";
import jwt from 'jsonwebtoken'
import authMiddleware from "./middleware";

const router: Router = express.Router();
const JWT_SECRET = "aeios"

router.get("/", (req, res) => {
    res.json({ msg: "Hi, this is user route" });
});
router.post("/signup", (req, res) => {
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