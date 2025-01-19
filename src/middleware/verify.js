import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function Verify(req, res, next) {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized access. Token missing." });

        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {            
            if (err) {
                return res.status(401).json({
                    message: "This session has expired. Please login again.",
                });
            }

            const { id } = decoded;

            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found." });

            const { password, ...data } = user._doc;
            req.user = data;
            next();
        });
    } catch (err) {
        console.error("Error in Verify middleware:", err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

export function VerifyRole(req, res, next) {
    try {
        const user = req.user;
        const { role } = user;
        if (role !== "admin") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }
        next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
