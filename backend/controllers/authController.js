


// controllers/authController.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const School = require("../models/School"); // ✅ school support
const sendEmail = require("../utils/sendEmail");

/**
 * Parent-only registration gated by global access code + school code + email verification
 */
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      username,
      email,
      confirmEmail,
      password,
      accessCode,   // global parent signup code
      schoolCode    // school-specific code
    } = req.body || {};

    // 1. Required fields
    if (!firstName || !lastName || !email || !confirmEmail || !password || !accessCode || !schoolCode) {
      return res.status(400).json({ message: "All fields (including parent code + school code) are required" });
    }

    // 2. Email confirmation
    if (String(email).toLowerCase() !== String(confirmEmail).toLowerCase()) {
      return res.status(400).json({ message: "Email and Confirm Email must match" });
    }

    // 3. Global parent access code
    const expected = process.env.PARENT_SIGNUP_CODE || "";
    if (accessCode !== expected) {
      return res.status(403).json({ message: "Invalid parent access code" });
    }

    // 4. Validate school code
    const school = await School.findOne({ accessCode: schoolCode });
    if (!school) {
      return res.status(400).json({ message: "Invalid school code" });
    }

    // 5. Duplicate checks
    const existingEmail = await User.findOne({ email: String(email).toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // 7. Create user linked to school
    const newUser = new User({
      firstName,
      lastName,
      phone: phone || "",
      username: username || "",
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: "parent",
      schoolId: school._id,   // ✅ link to school
      isVerified: false,
      verifyToken,
    });

    await newUser.save();

    // 8. Send verification email
    const API_BASE = process.env.API_BASE || "http://localhost:5000";
    const verifyUrl = `${API_BASE}/api/auth/verify/${verifyToken}`;

    try {
      await sendEmail(
        newUser.email,
        "Verify your Reading Log Account",
        `Click the link to verify: ${verifyUrl}`,
        `<p>Hello ${newUser.firstName},</p>
         <p>Please verify your email by clicking the button below:</p>
         <a href="${verifyUrl}" 
            style="display:inline-block;padding:10px 20px;
                   background:#4CAF50;color:#fff;
                   text-decoration:none;border-radius:5px;">
            Verify Email
         </a>`
      );
    } catch (emailErr) {
      console.error("MAIL SEND ERROR (user still registered):", emailErr.message);
    }

    return res.status(201).json({
      message: `Registered successfully for ${school.name}. Please check your email to verify your account.`,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login (email OR username + password)
 */
// const login = async (req, res) => {
//   try {
//     const { emailOrUsername, password } = req.body || {};
//     if (!emailOrUsername || !password) {
//       return res.status(400).json({ message: "Email/Username and password are required" });
//     }

//     // const user = await User.findOne({
//     //   $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
//     // });
//     // if (!user) return res.status(400).json({ message: "User not found" });

//     // if (user.role !== "admin" && !user.isVerified) {
//     //   return res.status(403).json({ message: "Please verify your email before logging in" });
//     // }
//    // inside login function
// const user = await User.findOne({
//   $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
// }).populate("schoolId");

// if (!user) return res.status(400).json({ message: "User not found" });

// // ✅ check if admin belongs to that school
// if (user.role === "admin") {
//   const school = await School.findById(user.schoolId);
//   if (!school || !school.adminEmails.includes(user.email.toLowerCase())) {
//     return res.status(403).json({ message: "You are not authorized as admin for this school" });
//   }
// }
 

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     // const token = jwt.sign(
//     //   { id: user._id, role: user.role, schoolId: user.schoolId },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: "7d" }
//     // );
//     const token = jwt.sign(
//   {
//     id: user._id,
//     role: user.role,
//     // schoolId: user.schoolId ? user.schoolId._id || user.schoolId : null,  // ✅ force to plain ObjectId
//     schoolId: user.schoolId?._id ? user.schoolId._id : user.schoolId,  // ✅ only the ObjectId
//   },
//   process.env.JWT_SECRET,
//   { expiresIn: "7d" }
// );


//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         schoolId: user.schoolId,
//       },
//     });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Email/Username and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
    }).populate("schoolId");

    if (!user) return res.status(400).json({ message: "User not found" });

    // ✅ Admin validation
    if (user.role === "admin") {
      const school = await School.findById(user.schoolId);
      if (!school || !school.adminEmails.includes(user.email.toLowerCase())) {
        return res.status(403).json({ message: "You are not authorized as admin for this school" });
      }
    }

    // ✅ Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ Ensure verified parent
    if (user.role === "parent" && !user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    // ✅ Generate token (normalized keys)
    const token = jwt.sign(
      {
        userId: user._id, // standardize
        role: user.role,
        schoolId: user.schoolId?._id ? user.schoolId._id : user.schoolId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return user and school info
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        schoolId: user.schoolId?._id || user.schoolId,
        schoolName: user.schoolId?.name,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Verify Email
 */
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/verify?status=failed`);
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verify?status=success`);
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/verify?status=failed`);
  }
};

/**
 * Forgot Password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click here to reset: ${resetUrl}`,
      `<p>Click the link below to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset Password
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Forgot Username
 */
const forgotUsername = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendEmail(
      user.email,
      "Your Username",
      `Your username is: ${user.username}`,
      `<p>Hello ${user.firstName},</p><p>Your username is <b>${user.username}</b></p>`
    );

    return res.json({ message: "Username sent to your email" });
  } catch (err) {
    console.error("FORGOT USERNAME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Resend Verification
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    await user.save();

    const API_BASE = process.env.API_BASE || "http://localhost:5000";
    const verifyUrl = `${API_BASE}/api/auth/verify/${verifyToken}`;

    await sendEmail(
      user.email,
      "Resend Verification - Reading Log",
      `Click the link to verify your account: ${verifyUrl}`,
      `<p>Hello ${user.firstName},</p>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyUrl}" 
          style="display:inline-block;padding:10px 20px;
                 background:#4CAF50;color:#fff;
                 text-decoration:none;border-radius:5px;">
          Verify Email
       </a>`
    );

    return res.json({ message: "Verification email resent. Please check your inbox." });
  } catch (err) {
    console.error("RESEND VERIFICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Export all functions
module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  forgotUsername,
  resendVerification,
};
