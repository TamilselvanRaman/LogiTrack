const express = require("express");
const Cargo = require("../models/Cargo");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");

// Add new cargo (Business only)
// Add cargo (only for Business users)
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, size, weight, origin, destination } = req.body;

    console.log("User role is:", req.user.role);
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only Business users can add cargo." });
    }

    const cargo = new Cargo({
      name,
      type,
      size,
      weight,
      origin,
      destination,
      businessId: req.user.id,
    });

    await cargo.save();
    res.status(201).json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /available-driver (Business only)
router.get("/available-driver", auth, async (req, res) => {
  try {
    // Check if user is a business user
    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Access denied. Business only." });
    }

    // Fetch all users with the "driver" role
    const drivers = await User.find({ role: "driver" }).select("-password");

    res.status(200).json({ drivers });
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cargos created by the logged-in business user
router.get("/business", auth, async (req, res) => {
  try {
    const cargos = await Cargo.find({ businessId: req.user.id });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign cargo to a driver (Business only)
router.post("/:id/assign", auth, async (req, res) => {
  try {
    const { driverId } = req.body;
    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { driverId },
      { new: true }
    );
    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all available (unassigned) cargos (Driver)
router.get("/available", auth, async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: null });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver accepts cargo
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });
    if (cargo.driverId)
      return res.status(400).json({ error: "Cargo already assigned" });

    cargo.driverId = req.user.id;
    await cargo.save();
    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get cargos assigned to the current driver
router.get("/assigned", auth, async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: req.user.id });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update cargo status (Driver)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update cargo location (Driver)
router.patch("/:id/location", auth, async (req, res) => {
  try {
    const { location } = req.body;
    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { location },
      { new: true }
    );
    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Track cargo (All roles)
router.get("/:id", auth, async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });
    res.json(cargo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
