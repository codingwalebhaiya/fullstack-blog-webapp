import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import dbConnect from "./src/config/db.js";
import postRouter from "./src/routes/postRoute.js";
import userRouter from "./src/routes/userRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser"

dotenv.config();

dbConnect();
const app = express();
const port = process.env.PORT;

app.use(cookieParser());

app.use(
  cors({
    origin: ["https://blog-client-gpiv.onrender.com", process.env.VITE_FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
