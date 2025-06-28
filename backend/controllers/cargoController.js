// controllers/cargo.controller.js
const Cargo = require("../models/CargoModel");
const User = require("../models/UserModel");

// ✅ Add new cargo (Business Only)
exports.addCargo = async (req, res) => {
  try {
    const {
      name,
      type,
      size,
      weight,
      origin,
      destination,
      customerId,
      deliveryDate,
    } = req.body;

    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Only Business users can add cargo." });
    }

    const cargo = new Cargo({
      name,
      type,
      size,
      weight,
      origin,
      destination,
      businessId: req.user.id,
      customerId,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
    });

    await cargo.save();
    res.status(201).json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get cargos added by logged-in business user
exports.getCargos = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    if (role === "business") {
      // Business: get cargos added by this business
      const cargos = await Cargo.find({ businessId: userId }).populate(
        "customerId",
        "username"
      );
      return res.json(cargos);
    }

    if (role === "driver") {
      // Driver: get assigned cargos
      const cargos = await Cargo.find({ driverId: userId })
        .populate("customerId", "username")
        .populate("businessId", "username");
      return res.json(cargos);
    }

    if (role === "customer") {
      // Customer: get own cargos
      const cargos = await Cargo.find({ customerId: userId })
        .populate("businessId", "username")
        .populate("driverId", "username");
      return res.json(cargos);
    }

    return res.status(403).json({ msg: "Access denied: Invalid role" });
  } catch (err) {
    console.error("Error fetching role-based cargos:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update cargo (business only)
exports.updateCargo = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only Business users can update cargo." });
    }

    const cargoId = req.params.id;
    const updateData = req.body;

    const cargo = await Cargo.findById(cargoId);
    if (!cargo) return res.status(404).json({ msg: "Cargo not found" });

    if (cargo.businessId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can update only your own cargos" });
    }

    Object.assign(cargo, updateData);
    await cargo.save();

    res.status(200).json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete cargo (business only)
exports.deleteCargo = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only Business users can delete cargo." });
    }

    const cargoId = req.params.id;
    const cargo = await Cargo.findById(cargoId);
    if (!cargo) return res.status(404).json({ msg: "Cargo not found" });

    if (cargo.businessId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can delete only your own cargos" });
    }

    await cargo.deleteOne();
    res.status(200).json({ msg: "Cargo deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get available drivers (business only)
exports.getAvailableDrivers = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Access denied. Business only." });
    }

    // Step 1: Find driverIds already assigned to active cargo (not delivered)
    const activeCargos = await Cargo.find({ status: { $ne: "DELIVERED" } });
    const assignedDriverIds = activeCargos.map((cargo) =>
      cargo.driverId?.toString()
    );

    // Step 2: Find all drivers not in assignedDriverIds
    const drivers = await User.find({
      role: "driver",
      _id: { $nin: assignedDriverIds },
    }).select("username email");

    res.status(200).json({ drivers });
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Assign cargo to driver (business only, enforce 1 active cargo rule)
exports.assignCargoToDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (req.user.role !== "business") {
      return res.status(403).json({ msg: "Access denied." });
    }

    const driver = await User.findOne({ _id: driverId, role: "driver" });
    if (!driver) return res.status(400).json({ msg: "Invalid driver ID" });

    const activeCargo = await Cargo.findOne({
      driverId: driverId,
      status: { $ne: "DELIVERED" },
    });
    if (activeCargo) {
      return res
        .status(400)
        .json({ msg: "Driver already has an active (undelivered) cargo." });
    }

    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { driverId, status: "PENDING" },
      { new: true }
    );

    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get available cargos (unassigned)
exports.getAvailableCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: null }).populate(
      "customerId",
      "username"
    );
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Accept cargo (driver)
exports.acceptCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });
    if (cargo.driverId)
      return res.status(400).json({ error: "Cargo already assigned" });

    const activeCargo = await Cargo.findOne({
      driverId: req.user.id,
      status: { $ne: "DELIVERED" },
    });
    if (activeCargo) {
      return res
        .status(400)
        .json({ error: "You already have an active cargo." });
    }

    cargo.driverId = req.user.id;
    cargo.status = "PENDING";
    await cargo.save();
    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get cargos assigned to driver
exports.getAssignedCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: req.user.id })
      .populate("customerId", "username")
      .populate("businessId", "username");
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update cargo status (driver or business)
exports.updateCargoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    // Set delivery date if status is DELIVERED
    if (status === "DELIVERED") {
      updateData.deliveryDate = new Date();
    }

    const cargo = await Cargo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update cargo location (driver)
exports.updateCargoLocation = async (req, res) => {
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
};

// ✅ Track cargo by ID
exports.trackCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id)
      .populate("driverId", "username")
      .populate("businessId", "username")
      .populate("customerId", "username");

    if (!cargo) {
      return res.status(404).json({ error: "Cargo not found" });
    }

    if ((cargo.status || "").toUpperCase() === "DELIVERED") {
      return res.status(400).json({ error: "This cargo is already delivered." });
    }

    res.status(200).json(cargo);
  } catch (err) {
    console.error("Error tracking cargo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

