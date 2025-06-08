const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

require('./models/User');
require('./models/Order');
const Trip = require('./models/Trip');  // Import Trip model here

const tripsRouter = require('./routes/trips');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const deliveryRoutes = require('./routes/delivery');
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(express.static(__dirname)); 
app.use('/api/delivery', deliveryRoutes);

// WebSocket connection listener
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Receive location update from delivery agent
    socket.on('locationUpdate', async (data) => {
    console.log('Location update received:', data);
    const { tripId, lat, lng } = data;
    if (!tripId || lat === undefined || lng === undefined) return;

    try {
        const updatedTrip = await Trip.findOneAndUpdate(
        { tripId },
        { currentLocation: { lat, lng } },
        { new: true }
        );

        if (updatedTrip) {
        io.emit('locationUpdate', updatedTrip);
        console.log(`Updated location for trip ${tripId}`);
        }
    } catch (err) {
        console.error('Error updating trip location:', err);
    }
    });


  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Middlewares & routes
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripsRouter);
app.use('/api/orders', orderRoutes);

// Root check
app.get('/', (req, res) => {
  res.send('API Running');
});

// Health check
app.get('/api/ping', (req, res) => {
  res.send('success');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
