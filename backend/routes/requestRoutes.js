const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createRequestFrom,
  getPendingRequests,
  getCustomerRequests,
  getAllCargoRequests,
  acceptRequestAndCreateCargo,
  updateCargoRequest,
  deleteCargoRequest,
  rejectCargoRequest,
} = require("../controllers/requestController");

const router = express.Router();

// Customer routes
router.post("/", auth, createRequestFrom);
router.get("/getallrequests", auth, getCustomerRequests);
router.put("/update/:id", auth, updateCargoRequest);
router.delete("/delete/:id", auth, deleteCargoRequest);

// Business routes
router.get("/", auth, getPendingRequests);
router.post("/accept/:id", auth, acceptRequestAndCreateCargo);
router.patch("/reject/:id", auth, rejectCargoRequest);

// Optional admin/debug
router.get("/all", auth, getAllCargoRequests);

module.exports = router;
