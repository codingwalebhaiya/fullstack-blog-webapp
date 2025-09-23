import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import dbConnect from "./src/config/db.js";

dotenv.config();

dbConnect();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json())
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
