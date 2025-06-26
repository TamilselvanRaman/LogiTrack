const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  weight: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  location: { type: String, default: '' },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cargo', cargoSchema);
