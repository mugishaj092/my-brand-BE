import express from "express";
import morgan from "morgan";
import userRouter from "./src/routes/useRouter";
import BlogRouter from "./src/routes/blogsRoute";
import messageRouter from "./src/routes/messageRoute";
import { addComment, getComments } from "./src/controllers/commentController";
const authController = require("./src/controllers/authController");
import swaggerUi from "swagger-ui-express";
import fs from "fs";

import Document from "./swagger.json";
import validateComments from "./src/validations/commentValidation";
const customCss = fs.readFileSync(process.cwd() + "/swagger.css", "utf8");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
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
