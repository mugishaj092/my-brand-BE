import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userRouter from "./src/routes/useRouter";
import BlogRouter from "./src/routes/blogsRoute";
import messageRouter from "./src/routes/messageRoute";
import { addComment, getComments } from "./src/controllers/commentController";
const authController = require("./src/controllers/authController");
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import Document from "./swagger.json";
import validateComments from "./src/validations/commentValidation";
const customCss = fs.readFileSync(process.cwd() + "/swagger.css", "utf8");

const app = express();
dotenv.config({ path: 'config.env' })

export interface EnvConfig {
    PORT: string | number
    DATABASE: string
    DATABASE_PASSWORD: string
}

const { PORT, DATABASE } =
    process.env as unknown as EnvConfig
const DB = DATABASE

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection established')
    })
    .catch((err) => {
        console.error('DB connection failed:', err)
    })

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use((req:Request, res:Response,next:NextFunction) => {
    console.log(req.cookies);
    next()
})
app.use("/docs", swaggerUi.serve, swaggerUi.setup(Document, { customCss }));
app.use("/api/users", userRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/messages", messageRouter);
app.post(
  "/api/:id/comment",
  validateComments,
  authController.protect,
  addComment
);
app.get("/api/:id/comment", authController.protect, getComments);

export default app;
