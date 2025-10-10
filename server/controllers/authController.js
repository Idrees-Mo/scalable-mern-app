import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError("User with this email or username already exists", 400);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
    message: "User registered successfully",
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // Find user and include password
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  // Generate token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
    message: "Login successful",
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  // req.user will be set by auth middleware (we'll create this next)xxxx
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
