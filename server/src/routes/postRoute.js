import { Router } from "express";
import {
  createPost,
  deletePost,
  getAdminPosts,
  getAllPosts,
  getAuthorPosts,
  getPostById,
  updatePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import authorizePostOwnership from "../middlewares/authorizePostOwnership.js";
import upload from "../middlewares/uploadMiddleware.js";

const postRouter = Router();

postRouter.post("/", authMiddleware, upload.single("image"), createPost);
postRouter.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "author"),
  authorizePostOwnership,
  updatePost
);
postRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "author"),
  authorizePostOwnership,
  deletePost
);

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.get(
  "/author/me",
  authMiddleware,
  getAuthorPosts
);
postRouter.get(
  "/admin/me",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminPosts
);

export default postRouter;
