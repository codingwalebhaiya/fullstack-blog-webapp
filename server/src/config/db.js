import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("database connected successfully");
  } catch (err) {
    console.error("database connection failed", err);
    process.exit(1);
  }
};

export default dbConnect;
