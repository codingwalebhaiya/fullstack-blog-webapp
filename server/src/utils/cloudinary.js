import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The image data buffer from multer (req.file.buffer).
 * @param {string} [folder="blog_posts"] - The folder name in Cloudinary.
 * @returns {Promise<object>} A Promise that resolves with the Cloudinary result object.
 */

const uploadOnCloudinary = (fileBuffer, folder = "blog_posts") => {
  return new Promise((resolve, reject) => {
    // Create an upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          // Reject the promise if Cloudinary returns an error
          return reject(error);
        }
        // Resolve the promise with the successful result
        resolve(result);
      }
    );

    // Pipe the buffer into the stream to start the upload
    uploadStream.end(fileBuffer);
  });
};

export { uploadOnCloudinary };
