import { Router } from "express";
import { getUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/me", getUser);

export default userRouter;
