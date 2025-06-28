const RequestFrom = require("../models/RequestFromModel");
const Cargo = require("../models/CargoModel");

// ✅ Customer creates a cargo request
exports.createRequestFrom = async (req, res) => {
  try {
    const { name, type, size, weight, origin, destination, deliveryDate } =
      req.body;

    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Only customers can request cargo." });
    }

    const request = new RequestFrom({
      name,
      type,
      size,
      weight,
      origin,
      destination,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      customerId: req.user.id,
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Business fetches all pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res
        .status(403)
        .json({ msg: "Only businesses can view requests." });
    }

    const requests = await RequestFrom.find({ status: "PENDING" }).populate(
      "customerId",
      "username email"
    );
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all requests (admin/dev/debug)
exports.getAllCargoRequests = async (req, res) => {
  try {
    const requests = await RequestFrom.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Business accepts a request → creates a cargo → deletes the request
exports.acceptRequestAndCreateCargo = async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log("Request ID:", requestId);

    const request = await RequestFrom.findById(requestId);
    if (!request) {
      console.log("Request not found");
      return res.status(404).json({ msg: "Request not found" });
    }

    const newCargo = new Cargo({
      name: request.name,
      type: request.type,
      size: request.size,
      weight: request.weight,
      origin: request.origin,
      destination: request.destination,
      customerId: request.customerId,
      deliveryDate: request.deliveryDate,
      businessId: req.user.id, // ✅ must exist
    });

    // console.log("Saving new cargo:", newCargo);

    await newCargo.save();

    request.status = "ACCEPTED"; // ✅ Use consistent value
    await request.save();

    res
      .status(201)
      .json({ msg: "Cargo created from request", cargo: newCargo });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Customer fetches only their submitted requests
exports.getCustomerRequests = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res
        .status(403)
        .json({ msg: "Only customers can view their requests." });
    }

    // const requests = await RequestFrom.find({
    //   customerId: req.user.id,
    //   status: { $in: ["REJECTED", "PENDING"] }, // ✅ Filter only REJECTED or PENDING
    // }).sort({ createdAt: -1 });

    const requests = await RequestFrom.find({
      customerId: req.user.id,
    });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Customer updates their request
exports.updateCargoRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await RequestFrom.findOne({
      _id: requestId,
      customerId: req.user.id,
    });
    if (!request) return res.status(404).json({ msg: "Request not found" });

    const updates = req.body;
    Object.assign(request, updates);

    await request.save();
    res.status(200).json({ msg: "Request updated", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Customer deletes their request
exports.deleteCargoRequest = async (req, res) => {
  try {
    const request = await RequestFrom.findOneAndDelete({
      _id: req.params.id,
      customerId: req.user.id,
    });

    if (!request) return res.status(404).json({ msg: "Request not found" });

    res.status(200).json({ msg: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject a request (update status to REJECTED)
exports.rejectCargoRequest = async (req, res) => {
  try {
    const request = await RequestFrom.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    request.status = "REJECTED";
    await request.save();

    res.status(200).json({ msg: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
