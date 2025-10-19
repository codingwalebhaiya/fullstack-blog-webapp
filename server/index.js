import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import dbConnect from "./src/config/db.js";
import postRouter from "./src/routes/postRoute.js";
import userRouter from "./src/routes/userRoute.js";

dotenv.config();

dbConnect();
const app = express();
const port = process.env.PORT || 4000;

// middleware
//parse JSON
app.use(express.json());
// If uploading form-data (image + text), also add:
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//app.use(express.static("public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
