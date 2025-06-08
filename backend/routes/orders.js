const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
// const redisClient = require('../redisClient').default || require('../redisClient');
const redisClient = require('../redisClient');

// Cache middleware for GET /api/orders
async function cache(req, res, next) {
    try {
        const cachedOrders = await redisClient.get('orders');
        if(cachedOrders) {
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedOrders));
        }
        next();
    } catch (err) {
        console.error(err);
        next()
    }
}
// Create New Order
router.post('/', async (req,res) => {
    try{
        const { trackingId, customerName, pickupAddress, deliveryAddress } = req.body;
        const newOrder = new Order({
            trackingId,
            customerName,
            pickupAddress,
            deliveryAddress
        });
        await newOrder.save();
        
        res.status(201).json(newOrder);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});
// Get all orders through cache middleware
router.get('/', cache, async (req, res) => {
  try {
    const orders = await Order.find();
    await redisClient.set('orders', JSON.stringify(orders), { EX: 60 }); // cache 60 seconds
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
// Get All Orders
// router.get('/', async (req,res) => {
//     try {
//         const orders =await Order.find();
//         res.json(orders);

//     }catch (err) {
//         res.status(500).json({error: 'Failed to fetch orders' });
//     } 
// });
// Get order by trackingId through cache middleware
router.get('/:trackingId', cache, async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Cache the order for 60 seconds
    await redisClient.set(`order:${req.params.trackingId}`, JSON.stringify(order), { EX: 60 });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});
// Get order by trackingId
// router.get('/:trackingId', async (req,res) => {
//     try {
//         const order = await Order.findOne({ trackingId: req.params.trackingId });
//         if(!order) return res.status(404).json({ error: 'Order not found' });
//         res.json(order);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch order' });
//     }
// });
// Modify your PUT route to update cache after DB update:
router.put('/:trackingId/status', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update cache for this order
    await redisClient.set(`order:${req.params.trackingId}`, JSON.stringify(order), { EX: 60 });

    // Also update full orders cache (optional, to keep list cache fresh)
    const orders = await Order.find();
    await redisClient.set('orders', JSON.stringify(orders), { EX: 60 });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});
// Update order status by trackingId
// router.put('/:trackingId/status', async (req,res) =>{
//     try{
//         const order = await Order.findOneAndUpdate(
//             { trackingId: req.params.trackingId },
//             { status: req.body.status },
//             { new: true }
//         );
//         if(!order) return res.status(404).json({ error: 'Order not found' });
//         res.json(order);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to update status '});
//     }
// });
module.exports = router;