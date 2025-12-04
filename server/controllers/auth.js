const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt-utils");
const User = require("../models/user"); // keep only one
const Skill = require("../models/skill");
const ALLOWED_ROLES = require("../config/roles-list");
require("dotenv").config();


const CLIENT_URL = process.env.CLIENT_URL;

// SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password, name, role, skills } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Determine role
    const userRole = Object.values(ALLOWED_ROLES).includes(role)
      ? role
      : ALLOWED_ROLES.PRODUCT_MANAGER; // default to 'product_manager'

    let skillIds = [];

    // If operator, skills are required
    if (userRole === ALLOWED_ROLES.OPERATOR) {
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Skills are required for operators",
        });
      }

      // Validate skills exist in DB
      const existingSkills = await Skill.find({ _id: { $in: skills } });
      skillIds = existingSkills.map((s) => s._id);

      if (skillIds.length !== skills.length) {
        return res.status(400).json({
          success: false,
          message: "Some skills do not exist",
        });
      }
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: userRole,
      skills: skillIds,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please use 'Continue with Google'",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// GOOGLE CALLBACK
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${CLIENT_URL}/auth/callback?token=${accessToken}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${CLIENT_URL}/login?error=server_error`);
  }
};

// REFRESH TOKEN
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
    if (!tokenExists) return res.status(401).json({ success: false, message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user._id);
    res.status(200).json({ success: true, accessToken: newAccessToken, user: user.getPublicProfile() });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Session expired, please login again" });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user.getPublicProfile() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded._id);
        if (user) await user.removeRefreshToken(refreshToken);
      } catch {}
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// LOGOUT ALL
const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshTokens = [];
    await user.save();
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out from all devices" });
  } catch {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ success: true, message: "If that email exists, a password reset link has been sent" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent",
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to process request" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    if (user.authMethod === "google") user.authMethod = "both";
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. Please login with your new password" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

// ADD SKILLS TO OPERATOR
const addSkillsToOperator = async (req, res) => {
  try {
    const { operatorId, skillIds } = req.body;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return res.status(400).json({ success: false, message: "skillIds must be a non-empty array" });
    }

    const user = await User.findById(operatorId);
    if (!user || user.role !== ALLOWED_ROLES.OPERATOR) {
      return res.status(400).json({ success: false, message: "User is not an operator" });
    }

    const uniqueSkills = [...new Set(skillIds)];
    const newSkills = uniqueSkills.filter((id) => !user.skills.includes(id));
    if (newSkills.length === 0) {
      return res.status(400).json({ success: false, message: "All provided skills are already assigned" });
    }

    user.skills.push(...newSkills);
    await user.save();

    res.status(200).json({ success: true, message: "Skills added successfully", addedSkills: newSkills, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET OPERATORS (optionally filtered by skills)
const getOperators = async (req, res) => {
  try {

    const operators = await User.find({role: "operator"}).select("_id name email skills");

    res.status(200).json({ success: true, count: operators.length, operators });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// EDIT OPERATOR INFO
const editOperator = async (req, res) => {
  try {
    const { operatorId, name, email, skills } = req.body;

    const operator = await User.findById(operatorId);
    if (!operator || operator.role !== ALLOWED_ROLES.OPERATOR) {
      return res.status(404).json({ success: false, message: "Operator not found" });
    }

    if (name) operator.name = name;
    if (email) operator.email = email.toLowerCase();

    if (skills && Array.isArray(skills)) {
      const existingSkills = await Skill.find({ _id: { $in: skills } });
      operator.skills = existingSkills.map((s) => s._id);
    }

    await operator.save();

    res.status(200).json({
      success: true,
      message: "Operator updated successfully",
      operator,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE OPERATOR
const deleteOperator = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const operator = await User.findById(operatorId);
    if (!operator || operator.role !== ALLOWED_ROLES.OPERATOR) {
      return res.status(404).json({ success: false, message: "Operator not found" });
    }

    await User.findByIdAndDelete(operatorId);

    res.status(200).json({ success: true, message: "Operator deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const redirect = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Redirect failed" });
  }
};
module.exports = {
  signup,
  login,
  googleCallback,
  refreshAccessToken,
  getMe,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  redirect,
  addSkillsToOperator,
  getOperators,
  editOperator,
  deleteOperator,
};
