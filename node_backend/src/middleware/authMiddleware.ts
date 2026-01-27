import { AuthRequest } from "../types/AuthRequest";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies["auth-token"];

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.userId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export { authMiddleware };
export default authMiddleware;
