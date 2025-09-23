import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/jwt.js";

const Register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(401).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new userModel({
      username: username.toLowerCase(),
      email,
      password, // password already hashed in userModel file using pre hook
      role,
    });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // password already compare in userModel file using comparePassword method

    // generate token
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = await generateToken(payload);

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export { Register, Login };
