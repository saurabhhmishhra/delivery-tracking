const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Trip = require('../models/Trip');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleCheck');

// Assign order to delivery user
router.post('/assign/order', authenticateToken, authorizeRoles('manager'), async (req, res) => {
  const { orderId, deliveryUserId } = req.body;

  try {
    const user = await User.findById(deliveryUserId);
    if (!user || user.role !== 'delivery') {
      return res.status(400).json({ error: 'Invalid delivery user' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.assignedTo = deliveryUserId;
    order.status = 'assigned';
    await order.save();

    res.json({ message: 'Order assigned successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign order' });
  }
});

// Assign trip to delivery user
router.post('/assign/trip', authenticateToken, authorizeRoles('manager'), async (req, res) => {
  const { tripId, deliveryUserId } = req.body;

  try {
    const user = await User.findById(deliveryUserId);
    if (!user || user.role !== 'delivery') {
      return res.status(400).json({ error: 'Invalid delivery user' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.assignedTo = deliveryUserId;
    trip.status = 'assigned';
    await trip.save();

    res.json({ message: 'Trip assigned successfully', trip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign trip' });
  }
});

module.exports = router;

// Get current trip for logged-in delivery user
router.get('/current-trip', authenticateToken, authorizeRoles('delivery'), async (req, res) => {
  try {
    const currentTrip = await Trip.findOne({
      driverId: req.user.id,
      status: { $in: ['assigned', 'in-progress'] }
    }).populate('driverId orderIds');

    if (!currentTrip) {
      return res.status(404).json({ error: 'No current trip found' });
    }

    res.json(currentTrip);
  } catch (err) {
    console.error('Get current trip error:', err);
    res.status(500).json({ error: 'Failed to load current trip' });
  }
});