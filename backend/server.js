const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Import controllers
const AuthController = require('./controllers/authcontroller');
const UserController = require('./controllers/Usercontroller');
const ParkingController = require('./controllers/Parkinglotcontroller');
const SlotController = require('./controllers/Slotcontroller');
const BookingController = require('./controllers/Bookingcontroller');

// Import middleware
const { authenticateToken } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// **AUTH ROUTES**
app.post('/api/auth/signup', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// **USER ROUTES**
app.get('/api/users/:id', authenticateToken, UserController.getUser);
app.put('/api/users/update/:id', authenticateToken, UserController.updateUser);
app.delete('/api/users/delete/:id', authenticateToken, UserController.deleteUser);

// **PARKING ROUTES**
app.get('/api/parkings', authenticateToken, ParkingController.getAllSlots); // Corrected route name
app.post('/api/parkings/add', authenticateToken, ParkingController.addSlot); // Corrected route name
app.put('/api/parkings/update/:id', authenticateToken, ParkingController.updateSlot); // Corrected route name
app.delete('/api/parkings/delete/:id', authenticateToken, ParkingController.deleteSlot); // Corrected route name

// **SLOT ROUTES**
app.get('/api/slots', authenticateToken, SlotController.getAllSlots);
app.post('/api/slots/add', authenticateToken, SlotController.addSlot);
app.put('/api/slots/update/:id', authenticateToken, SlotController.updateSlot);
app.delete('/api/slots/delete/:id', authenticateToken, SlotController.deleteSlot); // Added route
app.get('/api/slots/availability', authenticateToken, SlotController.checkAvailability);

// **BOOKING ROUTES**
app.get('/api/bookings', authenticateToken, BookingController.getAllBookings);
app.post('/api/bookings/add', authenticateToken, BookingController.bookSlot);
app.put('/api/bookings/update/:id', authenticateToken, BookingController.updateBooking);
app.post('/api/bookings/cancel/:id', authenticateToken, BookingController.cancelBooking);
app.delete('/api/bookings/delete/:id', authenticateToken, BookingController.deleteBooking);


// Default Route
app.get('/', (req, res) => {
    res.send('🚗 Welcome to ParkEase API! 🚀');
});

// Error Handling Middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
