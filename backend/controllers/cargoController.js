const Cargo = require("../models/CargoModel");
const User = require("../models/UserModel");

exports.addCargo = async (req, res) => {
  try {
    const { name, type, size, weight, origin, destination } = req.body;

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
};

// Update cargo (business only)
exports.updateCargo = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only Business users can update cargo." });
    }

    const cargoId = req.params.id;
    const updateData = req.body;

    // Find cargo and check if it belongs to this business user
    const cargo = await Cargo.findById(cargoId);
    if (!cargo) return res.status(404).json({ msg: "Cargo not found" });

    if (cargo.businessId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can update only your own cargos" });
    }

    // Update cargo fields
    Object.assign(cargo, updateData);
    await cargo.save();

    res.status(200).json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete cargo (business only)
exports.deleteCargo = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only Business users can delete cargo." });
    }

    const cargoId = req.params.id;

    // Find cargo and check if it belongs to this business user
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

exports.getAvailableDrivers = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ message: "Access denied. Business only." });
    }

    const drivers = await User.find({ role: "driver" }).select("-password");
    res.status(200).json({ drivers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBusinessCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find({ businessId: req.user.id });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignCargoToDriver = async (req, res) => {
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
};

exports.getAvailableCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: null });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptCargo = async (req, res) => {
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
};

exports.getAssignedCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find({ driverId: req.user.id });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCargoStatus = async (req, res) => {
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
};

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

exports.trackCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });
    res.json(cargo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
