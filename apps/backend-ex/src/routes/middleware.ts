import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"

export default function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ msg: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        (req as any).userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ msg: "Invalid token" });
    }
}