const User = require("../models/UserModel");
const Cargo = require("../models/CargoModel");

exports.getUserProfile = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const username = req.user.username;

  // console.log("Role:", role);
  // console.log("User ID:", userId);
  // console.log("Username:", username);

  if (!userId) {
    return res
      .status(403)
      .json({ msg: "Access denied. User not authenticated." });
  }

  try {
    // Find user by _id
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    let cargos = [];

    if (user.role === "business") {
      cargos = await Cargo.find({ businessId: user._id });
    } else if (user.role === "driver") {
      cargos = await Cargo.find({ driverId: user._id });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        contact: user.contact,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      cargos,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { contact, address, username, email } = req.body;
  const userId = req.user.id || req.user._id; // make sure to handle both cases

  if (!userId) {
    return res
      .status(403)
      .json({ msg: "Access denied. User not authenticated." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { contact, address, username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    let cargos = [];

    if (updatedUser.role === "business") {
      cargos = await Cargo.find({ businessId: updatedUser._id });
    } else if (updatedUser.role === "driver") {
      cargos = await Cargo.find({ driverId: updatedUser._id });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        contact: updatedUser.contact,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      cargos,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET /api/users/customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select(
      "username _id"
    );
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error while fetching customers." });
  }
};

// ✅ NEW: Get cargos assigned to logged-in customer
exports.getCustomerCargos = async (req, res) => {
  try {
    // Check if user is a customer
    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Access denied. Customers only." });
    }

    // Find cargos where the customerId matches the logged-in user
    const cargos = await Cargo.find({ customerId: req.user.id })
      .populate("driverId", "username") // Populate driver's username
      .populate("businessId", "username") // Populate business's username
      .sort({ createdAt: -1 }); // Optional: newest first

    res.status(200).json(cargos);
  } catch (err) {
    console.error("Error fetching customer cargos:", err);
    res.status(500).json({ error: err.message });
  }
};
