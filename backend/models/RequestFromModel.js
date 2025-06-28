const mongoose = require("mongoose");

const requestFromSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    size: String,
    weight: Number,
    origin: String,
    destination: String,
    deliveryDate: Date,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPT", "REJECTED","ACCEPTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestFrom", requestFromSchema);
