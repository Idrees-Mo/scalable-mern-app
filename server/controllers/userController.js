import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import User from "../models/User.js";

// @desc    Get all users (with pagination)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  if (req.query.role) {
    query.role = req.query.role;
  }
  if (req.query.search) {
    query.$or = [
      { username: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute queries in parallel
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password") // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  // Don't allow password updates through this route
  const { password, ...updateData } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true, // Return updated document
    runValidators: true, // Run model validators
  }).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
    message: "User updated successfully",
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  // Don't allow role or password updates through this route
  const { password, role, ...updateData } = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({
    success: true,
    data: user,
    message: "Profile updated successfully",
  });
});
