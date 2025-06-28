const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema(
  {
    // 🔹 Basic cargo details
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    weight: { type: Number, required: true },

    // 🔹 Shipping route
    origin: { type: String, required: true },
    destination: { type: String, required: true },

    // 🔹 Status & tracking
    status: { type: String, default: "Pending" },     // "Pending", "In_Transit", "Delivered"
    location: { type: String, default: "" },          // latitude,longitude
    deliveryDate: { type: Date, default: null },      // ✅ Optional, filled when delivered

    // 🔹 References to related users
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Cargo", cargoSchema);
