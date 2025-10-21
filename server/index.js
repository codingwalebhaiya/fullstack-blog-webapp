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


app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//app.use(express.static("public"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
