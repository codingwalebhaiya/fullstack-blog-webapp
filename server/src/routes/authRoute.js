import { Router } from "express";
import { Login, Logout, Register } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);



export default authRouter;

