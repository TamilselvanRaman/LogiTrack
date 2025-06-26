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
