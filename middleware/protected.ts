import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface CustomRequest extends Request {
    cookies: {
        user?: string;
    };
    user?: string;
}

// Middleware to protect routes for admin
export const userProtected = (req: CustomRequest, res: Response, next: NextFunction):any => {
    // Access the user from the cookies
    const user = req.cookies.user;

    // Check if the user cookie exists
    if (!user) {
        return res.status(401).json({ message: "No cookie found" });
    }

    // Verify the JWT token from the cookie
    jwt.verify(user, process.env.JWT_KEY as string, (err, decoded: any) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" });
        }

        // Attach the user ID to the request object
        req.user = decoded.userId;
        next();
    });
};
