const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user (password will be hashed by mongoose pre 'save' hook)
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    // Send response without password
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user with password (select explicitly since password: false in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Exclude password from response user object
    const { password: _, ...userInfo } = user.toObject();

    res.json({ token, user: userInfo });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
