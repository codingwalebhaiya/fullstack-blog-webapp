import multer from "multer";
// ⬇️ MULTER CONFIGURATION ⬇️
// Use memory storage to get the file buffer directly
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});