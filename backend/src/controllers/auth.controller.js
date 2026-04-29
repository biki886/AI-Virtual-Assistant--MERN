import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "Email already exist !", success: false });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters !",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res
      .status(201)
      .json({ message: "User signed up .", success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signup error ${error}`, success: false });
  }
};

export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email doesn't exist !", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res
      .status(200)
      .json({ message: "User signed in.", success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Signin  error ${error}`, success: false });
  }
};

export const Signout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: "User signed out.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Signout error ${error}`,
      success: false,
    });
  }
};