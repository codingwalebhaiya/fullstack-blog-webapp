import userModel from "../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Authentication failed. User ID not found.",
      });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log(user);
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};
export { getUser };
