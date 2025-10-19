import { Router } from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getUser);
// userRouter.put("/profile", authMiddleware, updateProfile);
//userRouter.put("/change-password", authMiddleware, changePassword);

userRouter.get("/", authMiddleware, authorizeRoles("admin"), getAllUsers);
userRouter.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteUser);
userRouter.put("/:id", authMiddleware, authorizeRoles("admin"), updateUser);


export default userRouter;
