import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
     excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required:true
    },

    featuredImage: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    categories: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("User", postSchema);
export default postModel;
