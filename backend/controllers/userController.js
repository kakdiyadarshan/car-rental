const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/emailService");
const crypto = require("crypto");
const { log } = require("console");
const { deleteFromS3, uploadToS3 } = require("../middleware/uploadMiddleware");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, licenceNo, password, role, phoneNo } = req.body;
  const folder = req.query.folder || "users";
  
  let img = "";
  if (req.file) {
    img = await uploadToS3(req.file, folder);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (img) await deleteFromS3(img);
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    licenceNo,
    password,
    phoneNo,
    img,
    role: role || "user",
  });

  if (user) {
    // Send welcome email
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to RentCars!",
        message: `Hello ${user.firstname},\n\nWelcome to RentCars. Your account has been created successfully.`,
        html: `<h1>Welcome ${user.firstname}!</h1><p>Your account has been created successfully.</p>`,
      });
    } catch (err) {
      console.error("Email could not be sent", err);
    }

    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      licenceNo: user.licenceNo,
      phoneNo: user.phoneNo,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    if (img) await deleteFromS3(img);
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Send login notification email
    try {
      await sendEmail({
        email: user.email,
        subject: "New Login Detected",
        message: `Hello ${user.firstname},\n\nA new login was detected on your account.`,
        html: `<p>Hello ${user.firstname},</p><p>A new login was detected on your account.</p>`,
      });
    } catch (err) {
      console.error("Email could not be sent", err);
    }

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      licenceNo: user.licenceNo,
      phoneNo: user.phoneNo,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  // For frontend, the URL should point to the frontend reset password page
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the link below: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hello ${user.firstname},</p>
      <p>We received a request to reset your password for your account. You can reset your password by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If the link does not work, copy and paste the following URL into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thanks,<br>RentCars Team</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Link - RentCars",
      message,
      html,
    });

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent, please try again later");
  }
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Password reset link is invalid or has expired. Please try again.");
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Your password has been changed successfully",
    token: generateToken(user._id),
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      licenceNo: user.licenceNo,
      phoneNo: user.phoneNo,
      location: user.location,
      img: user.img,
      role: user.role,
    });
    console.log(res,"rrr");
    
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const folder = req.query.folder || "users";

  if (user) {
    if (req.file) {
      const newImg = await uploadToS3(req.file, folder);
      if (user.img) await deleteFromS3(user.img);
      user.img = newImg;
    }

    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.licenceNo = req.body.licenceNo || user.licenceNo;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    user.location = req.body.location || user.location;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      licenceNo: updatedUser.licenceNo,
      phoneNo: updatedUser.phoneNo,
      location: updatedUser.location,
      img: updatedUser.img,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  console.log(users,"users");
  res.json(users);
});

// @desc    Change user password
// @route   PUT /api/users/changepassword
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!oldPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are required: old password, new password, and confirm password");
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("New password and confirm password do not match");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters long");
  }

  // Get user from database
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if old password matches
  if (!(await user.matchPassword(oldPassword))) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "admin") {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    
    // Delete user image from S3 if exists
    if (user.img) await deleteFromS3(user.img);

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  changePassword,
};
