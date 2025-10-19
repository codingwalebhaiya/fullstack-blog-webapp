import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    //  const userId = req.params.id;
    //   if (!userId) {
    //     return res.status(401).json({
    //       message: "Authentication failed. User ID not found.",
    //     });
    //   }

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

const getAllUsers = async (req, res) => {
  try {
   const users = await userModel
      .find()
      .select("-password")
      .lean();

    return res
      .status(200)
      .json({ message: "All users fetched successfully", users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        { $set: { username, email, role } },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all posts by this user
    await postModel.deleteMany({ userId: id });

    // Delete the user
    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User and their posts deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//  const updateProfile = async (req, res) => {
//   try {
//     const { avatar } = req.body;
//     const userId = req.user.id;

//     // Check if email already exists (excluding current user)
//     if (email) {
//       const existingUser = await userModel.findOne({ 
//         email, 
//         _id: { $ne: userId } 
//       });
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already exists"
//         });
//       }
//     }

//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { 
//         $set: { 
//           avatar,
//           updatedAt: new Date()
//         } 
//       },
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating profile",
//       error: error.message
//     });
//   }
// };

//  const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.user.id;

//     const user = await userModel.findById(userId);
    
//     // Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect"
//       });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update password
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password updated successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error changing password",
//       error: error.message
//     });
//   }
// };


export { getUser, getAllUsers, updateUser, deleteUser };
