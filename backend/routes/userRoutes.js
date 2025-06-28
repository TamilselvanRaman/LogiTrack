const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getAllCustomers,
  getCustomerCargos,
} = require("../controllers/userController");


// ✅ GET profile
router.get("/profile", auth, getUserProfile);

// ✅ POST update profile
router.put("/profile/update", auth, updateUserProfile);

// ✅ GET all users with role "customer"
router.get("/customers", getAllCustomers);
router.get("/customer", auth, getCustomerCargos);



module.exports = router;
