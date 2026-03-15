const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendOtpEmail = require('../utils/sendOtpEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// @desc    Register new user & send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    // Agar user exist karta hai aur verified hai
    if (user && user.isVerified) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    // Agar user exist karta hai but verify nahi hua
    if (user && !user.isVerified) {
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpire = otpExpire;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false
      });
    }

    // Send OTP
    // const message = `Your OTP for Student Skill Exchange Platform registration is: ${otp}. It is valid for 10 minutes.`;

    // await sendOtpEmail({
    //   email: user.email,
    //   subject: 'Skill Exchange OTP Verification',
    //   message,
    // });

    res.status(201).json({
      message: 'OTP sent to email',
      email: user.email
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User already verified');
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      res.status(401);
      throw new Error('Email not verified. Please verify your email first.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
};
