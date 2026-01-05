import userModel from "../models/userModel.js";
import generateToken from "../utils/jwt.js";

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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
      email: email.toLowerCase(),
      password, // password already hashed in userModel file using pre hook
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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(401).json({
        message: "Please provide a username/email and a password",
      });
    }

    const lowerCaseIdentifier = identifier.toLowerCase();

    const user = await userModel
      .findOne({
        $or: [
          { username: lowerCaseIdentifier },
          { email: lowerCaseIdentifier },
        ],
      })
      .select("+password"); // Explicitly select the password for comparison

    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    // password already compare in userModel file using comparePassword method

    // generate token
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = generateToken(payload);

    return res.cookie("token", token, {
      httpOnly: true, // 🔐 JS can't access
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).status(200).json({
      message: "User logged in successfully",
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

const Logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};



export { Register, Login, Logout };