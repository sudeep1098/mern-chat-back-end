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

    const newUser = new User({
      name,
      email,
      password,
      role: "admin",
    });
    console.log(newUser);

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
    const user = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );
    console.log(user);

    if (!user) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }

    console.log("Plaintext Password:", password);
    console.log("Hashed Password from DB:", user.password);
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }
    const token = user.generateAccessJWT();

    let options = {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      secure: false,
    };
    res.cookie("jwt", token, options);

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

export async function Logout(req, res) {
  try {
    const accessToken = req.cookies.jwt;
    if (!accessToken) return res.sendStatus(204);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.setHeader("Clear-Site-Data", '"cookies"');
    res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  res.end();
}
