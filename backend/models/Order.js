const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  customerName: String,
  pickupAddress: String,
  deliveryAddress: String,
  
  // NEW: GPS coordinates
  pickupCoordinates: {
    lat: { type: Number },
    lon: { type: Number },
  },
  deliveryCoordinates: {
    lat: { type: Number },
    lon: { type: Number },
  },

  status: { type: String, default: 'Pending' },
  eta: String,
  deliveryPartner: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
