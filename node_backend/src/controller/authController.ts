import type { Response } from "express";
import { AuthRequest } from "../types/AuthRequest"
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

const register = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            })
        };

        const user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            name, email, password: hashedPassword
        });


        const payload = {
            id: newUser._id
        }

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h"
        })

        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({
            msg: "User registered successfully",
            user: newUser,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({
            email
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h"
        });

        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({
            msg: "User Logged in successfully",
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export { register, login }
