import slugify from "slugify";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import generateToken from "../utils/jwt.js";

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title, content are required" });
    }

    const user = req.user; // from auth middleware
    if (!user) return res.status(404).json({ message: "User not found" });
    // generate slug via title
    let slug = slugify(title, { lower: true, strict: true });

    // ensure unique slug (append random short id if needed)
    const slugExists = await postModel.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const excerpt =
      content
        .slice(0, 200)
        .trim()
        .replace(/\s+\S*$/, "") + "...";

    // Multer makes the file buffer available here
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 2. Upload image using the separate utility function
    let uploadResult;
    try {
      // Pass the buffer (req.file.buffer) to the utility function
      uploadResult = await uploadOnCloudinary(file.buffer);
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary." });
    }

    const newPost = new postModel({
      userId: req.user._id,
      title,
      content,
      excerpt,
      slug,
      postImageUrl: uploadResult.secure_url, // Get URL from the result
      postImagePublicId: uploadResult.public_id, // store public_id to support deletion later
    });

    await newPost.save();

    const fetchedPost = await postModel
      .findById(newPost._id)
      .populate("userId", "username role");

    // Find the user to check and update their role
    const existedUser = await userModel.findById(req.user._id);
    if (!existedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is currently a 'reader' and (now) has posts
    const hasPosts = await postModel.exists({ userId: req.user._id });

    // If they are a reader and they now have posts, promote to 'author'
    if (existedUser.role === "reader" && hasPosts) {
      // Update role to "author"
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { $set: { role: "author" } },
        { new: true } // return the updated document
      );

      // Generate a new JWT using the updated role
      const payload = {
        id: updatedUser._id,
        role: updatedUser.role, // "author"
      };
      const newToken = await generateToken(payload);

      // re-fetch the post so populated user role is up-to-date
      const refreshedPost = await postModel
        .findById(newPost._id)
        .populate("userId", "username role");

      // Respond with the new post + token
      return res.status(201).json({
        message: "Blog post created and role updated to author",
        post: refreshedPost,
        token: newToken,
      });
    }

    return res
      .status(201)
      .json({ message: "Post created successfully", post: fetchedPost });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .sort({ createdAt: -1 })
      .select(
        "title excerpt slug postImageUrl postImagePublicId createdAt userId"
      ) // no content
      .populate("userId", "username role");

    return res
      .status(200)
      .json({ message: "All posts fetched successfully", posts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate("userId", "username role");
    return res
      .status(200)
      .json({ message: "Single Post fetched successfully", post });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await postModel.findByIdAndDelete(req.params.id);
    return res.json(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    const updated = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt:
          content
            .slice(0, 200)
            .trim()
            .replace(/\s+\S*$/, "") + "...",
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Post not found" });
    return res
      .status(200)
      .json({ message: "Post updated successfully", post: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export { createPost, getAllPosts, getPostById, deletePost, updatePost };
