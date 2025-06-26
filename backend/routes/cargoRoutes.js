const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addCargo,
  getAvailableDrivers,
  getBusinessCargos,
  assignCargoToDriver,
  getAvailableCargos,
  acceptCargo,
  getAssignedCargos,
  updateCargoStatus,
  updateCargoLocation,
  trackCargo,
  updateCargo,
  deleteCargo,
} = require("../controllers/cargoController");

// Routes
router.post("/", auth, addCargo);
router.put("/:id", auth, updateCargo); // Update cargo by ID
router.delete("/:id", auth, deleteCargo); // Delete cargo by ID
router.get("/available-driver", auth, getAvailableDrivers);
router.get("/business", auth, getBusinessCargos);
router.post("/:id/assign", auth, assignCargoToDriver);
router.get("/available", auth, getAvailableCargos);
router.post("/:id/accept", auth, acceptCargo);
router.get("/assigned", auth, getAssignedCargos);
router.patch("/:id/status", auth, updateCargoStatus);
router.patch("/:id/location", auth, updateCargoLocation);
router.get("/:id", auth, trackCargo);

module.exports = router;
