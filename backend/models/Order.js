const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    trackingId: {type: String, required: true, unique: true},
    customerName: String,
    pickupAddress: String,
    deliveryAddress: String,
    status: {type: String, default: 'Pending'},
    eta: String,
    deliveryPartner: String
}, { timestamps: true});

module.exports = mongoose.model('Order', orderSchema);