
import postModel from "../models/postModel.js";

const authorizePostOwnership = async (req, res, next) => {
  try {
    const postId = req.params.id || req.params.postId; // depends on route param name
    const post = await postModel.findById(postId);
   // const post = await postModel.findById(postId).select(req.userId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // admin can do anything
    if (req.userRole === "admin") {
      req.post = post;
      return next();
    }

    // author can only modify their own posts
    if (req.userRole === "author" && post.userId.toString() === req.userId) {
      req.post = post;
      return next();
    }

    return res.status(403).json({ message: "Forbidden: You cannot perform this action" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export default authorizePostOwnership;
