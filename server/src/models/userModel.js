import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default:"reader"
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


// Index for better query performance
PostSchema.index({ author: 1, status: 1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });

const userModel = mongoose.model("User", userSchema);
export default userModel;
