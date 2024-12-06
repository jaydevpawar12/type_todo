import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoutes";
import todoRoute from "./routes/todoRoutes";
import dotenv from "dotenv";
import { userProtected } from "./middleware/protected";
import { app, httpServer } from "./socket/socket";
// import { userProtected } from "./middleware/protected";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL as string);

// const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: true, 
  })
);

app.use("/api/auth", authRoute);
app.use("/api", todoRoute);

app.use(
  (err: any, req: Request, res: Response, next: NextFunction):any => {
    console.log(err);
    return res.status(500).json({ message: err.message || "Something went wrong" });
  }
);

mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
