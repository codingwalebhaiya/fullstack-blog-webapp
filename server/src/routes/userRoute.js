import { Router } from "express";
import { getUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getUser);

export default userRouter;
