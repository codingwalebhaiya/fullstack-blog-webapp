import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import authorizePostOwnership from "../middlewares/authorizePostOwnership.js";
import upload from "../middlewares/uploadMiddleware.js"

const postRouter = Router();


postRouter.post(
  "/",
  authMiddleware,
  upload.single('image'),
  createPost
);
postRouter.put(
  "/:id",
  authMiddleware,
  authorizePostOwnership,
  updatePost
);

// delete: allow owner (author) and admin
postRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deletePost
);

// public read only
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

export default postRouter;
