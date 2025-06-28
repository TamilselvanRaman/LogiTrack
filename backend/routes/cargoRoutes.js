const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addCargo,
  getAvailableDrivers,
  getCargos,
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

// 👇 Specific routes first
router.get("/available-driver", auth, getAvailableDrivers);
router.get("/business", auth, getCargos);
router.get("/available", auth, getAvailableCargos);
router.get("/assigned", auth, getAssignedCargos);

// 👇 Cargo actions
router.post("/", auth, addCargo);
router.put("/:id", auth, updateCargo); // Update cargo by ID
router.delete("/:id", auth, deleteCargo); // Delete cargo by ID
router.post("/:id/assign", auth, assignCargoToDriver);
router.post("/:id/accept", auth, acceptCargo);
router.patch("/:id/status", auth, updateCargoStatus);
router.patch("/:id/location", auth, updateCargoLocation);

// 👇 Catch-all last
router.get("/:id", auth, trackCargo);

module.exports = router;
