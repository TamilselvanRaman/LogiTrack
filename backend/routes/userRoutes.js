const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

// ✅ GET profile
router.get("/profile", auth, getUserProfile);

// ✅ POST update profile
router.put("/profile/update", auth, updateUserProfile);

module.exports = router;
