const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  startTime: { type: Date },
  endTime: { type: Date },
  currentLocation: {
    lat: Number,
    lng: Number,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tripSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
