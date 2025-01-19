import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

export async function Register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Missing required fields: name, email, and password.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "You already have an account. Please log in instead.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const { password: _, ...userData } = savedUser._doc;
    res.status(201).json({
      status: "success",
      data: userData,
      message: "Your account has been successfully created.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
}

export async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });

    const token = user.generateAccessJWT();

    let options = {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      secure: false,
    };
    res.cookie('jwt', token, options);

    res.status(200).json({
      status: "success",
      message: "You have successfully logged in.",
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
}
