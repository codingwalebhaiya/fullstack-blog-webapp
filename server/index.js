import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoutes";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use('/api/v1/auth', authRouter)

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});




