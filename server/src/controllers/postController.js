import slugify from "slugify";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import generateToken from "../utils/jwt.js";
import santizePostContent from "../utils/sanitizeHtml.js";

const uploadImages = async (req, res) => {
  // Multer makes the file buffer available here
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // 2. Upload image using the separate utility function
  try {
    // Pass the buffer (req.file.buffer) to the utility function
    const uploadResult = await uploadOnCloudinary(file.buffer);

    // Key Change: Send the Cloudinary result back to the client
    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      // You can return the full result object, but sending only what's needed is cleaner
    });
  } catch (uploadError) {
    return res
      .status(500)
      .json({ message: "Failed to upload image to Cloudinary." });
  }
};

const createPost = async (req, res) => {
  try {
    const cleanContent = santizePostContent(req.body.content);
    const { title, postImageUrl, postImagePublicId } = req.body;

    if (!title || !cleanContent) {
      return res.status(400).json({ message: "Title, content are required" });
    }

    if (!postImageUrl || !postImagePublicId) {
      return res.status(400).json({
        message:
          "A featured image (URL and Public ID) is required for the post.",
      });
    }

    // Enforce title length (max 70 characters)
    const trimmedTitle =
      title.length > 70 ? title.slice(0, 70).trim() : title.trim();

    const user = req.user; // from auth middleware
    if (!user) return res.status(404).json({ message: "User not found" });
    // generate slug via trimmedTitle
    let slug = slugify(trimmedTitle, { lower: true, strict: true });

    // ensure unique slug (append random short id if needed)
    const slugExists = await postModel.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    // Create excerpt from content (around 100 characters)
    // Remove HTML tags first, then slice
    //const plainTextContent = content.replace(/<[^>]*>/g, "");
    let excerpt = cleanContent.slice(0, 100).trim();

    // If we cut in the middle of a word/sentence, find the last space and trim there
    if (cleanContent.length > 100 && excerpt.length === 100) {
      const lastSpaceIndex = excerpt.lastIndexOf(" ");
      if (lastSpaceIndex > 80) {
        // Ensure we don't cut too short
        excerpt = excerpt.slice(0, lastSpaceIndex).trim();
      }
    }

    // Add ellipsis only if content was truncated
    if (cleanContent.length > 100) {
      excerpt += "...";
    }

    const newPost = new postModel({
      userId: req.user._id,
      title:trimmedTitle,
      content:cleanContent,
      excerpt,
      slug,
      // postImageUrl: uploadResult.secure_url, // Get URL from the result
      // postImagePublicId: uploadResult.public_id, // store public_id to support deletion later
      postImageUrl: postImageUrl,
      postImagePublicId: postImagePublicId,
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
      )
      .populate("userId", "username role");

    return res
      .status(200)
      .json({ message: "All posts fetched successfully", posts });
  } catch (err) {
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
    const { id } = req.params;
    await postModel.findByIdAndDelete(id);
    return res.json(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Get id from URL params
    const cleanUpdatedContent = santizePostContent(req.body.content);
    const { title, postImageUrl, postImagePublicId } = req.body;

    // Find the post first
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!title && !cleanUpdatedContent) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Build update object dynamically
    const updateFields = {};

    if (title) {
      updateFields.title = title;
      // Generate new slug only if title changed
      let slug = slugify(title, { lower: true, strict: true });

      // Check for slug uniqueness (excluding current post)
      const existingPost = await postModel.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingPost) {
        // Add timestamp or random string to make slug unique
        slug = `${slug}-${Date.now()}`;
      }

      updateFields.slug = slug;
    }

    if (cleanUpdatedContent) {
      updateFields.content = cleanUpdatedContent;
      // Generate excerpt from content
      const excerpt =
        cleanUpdatedContent
        //  .replace(/<[^>]*>/g, "") // Remove HTML tags
          .slice(0, 200)
          .trim()
        //  .replace(/\s+\S*$/, "") + "...";
      updateFields.excerpt = excerpt;
    }

    if (postImageUrl !== undefined) {
      updateFields.postImageUrl = postImageUrl;
    }

    if (postImagePublicId !== undefined) {
      updateFields.postImagePublicId = postImagePublicId;
    }

    // Check if there are actually fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update the post
    const updatedPost = await postModel
      .findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      })
      .populate("userId", "username email"); // Populate user info

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAuthorPosts = async (req, res, next) => {
  try {
    const posts = await postModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ message: "Author own fetched successfully", posts });
  } catch (err) {
    next(err);
  }
};

const getAdminPosts = async (req, res, next) => {
  try {
    const posts = await postModel
      .find()
      .populate("userId", "username email role")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ posts });
  } catch (err) {
    next(err);
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  getAuthorPosts,
  getAdminPosts,
  uploadImages,
};
