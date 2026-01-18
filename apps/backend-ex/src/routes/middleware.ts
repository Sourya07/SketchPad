import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "aeios";

export default function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "Token missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ msg: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.userId) {
            return res.status(401).json({ msg: "Invalid token payload" });
        }

        (req as any).userId = decoded.userId;
        next(); // ✅ VERY IMPORTANT
    } catch (err) {
        return res.status(401).json({ msg: "Token expired or invalid" });
    }
}