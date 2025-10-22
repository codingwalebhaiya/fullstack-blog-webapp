import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import dbConnect from "./src/config/db.js";
import postRouter from "./src/routes/postRoute.js";
import userRouter from "./src/routes/userRoute.js";
import cors from "cors";

dotenv.config();

dbConnect();
const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-frontend-6w9l.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);


// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Backend is running!", 
    timestamp: new Date().toISOString() 
  });
});


// ✅ ADD 0.0.0.0 for production
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
