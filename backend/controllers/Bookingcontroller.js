const fs = require('fs').promises;
const path = require('path');

const BOOKINGS_FILE = path.join(__dirname, '../data/bookings.json');
const PARKING_FILE = path.join(__dirname, '../data/parking.json');

// Read bookings data
const readBookings = async () => {
    try {
        const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write bookings data
const writeBookings = async (data) => {
    const dir = path.dirname(BOOKINGS_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(data, null, 2));
};

// Read parking data
const readParkingData = async () => {
    try {
        const data = await fs.readFile(PARKING_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write parking data
const writeParkingData = async (data) => {
    await fs.writeFile(PARKING_FILE, JSON.stringify(data, null, 2));
};

class BookingController {
    // Get all bookings
    static async getAllBookings(req, res) {
        try {
            const bookings = await readBookings();
            return res.status(200).json({
                success: true,
                data: bookings
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
    }

    // Book a slot
    static async bookSlot(req, res) {
        try {
            const { parkingId, startTime, endTime, vehicleNumber } = req.body;
            const userId = req.user.id; // From auth middleware

            if (!parkingId || !startTime || !endTime || !vehicleNumber) {
                return res.status(400).json({
                    error: 'Please provide all required fields'
                });
            }

            // Get parking data
            const parkingSlots = await readParkingData();
            const parkingSlot = parkingSlots.find(slot => slot.id === parkingId);

            if (!parkingSlot) {
                return res.status(404).json({ error: 'Parking slot not found' });
            }

            if (parkingSlot.availableSpots <= 0) {
                return res.status(400).json({ error: 'No available spots' });
            }

            // Create booking
            const booking = {
                id: Date.now().toString(),
                userId,
                parkingId,
                vehicleNumber,
                startTime,
                endTime,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            // Update available spots
            parkingSlot.availableSpots -= 1;
            await writeParkingData(parkingSlots);

            // Save booking
            const bookings = await readBookings();
            bookings.push(booking);
            await writeBookings(bookings);

            return res.status(201).json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Error booking slot:', error);
            return res.status(500).json({ error: 'Error booking slot' });
        }
    }

    // Cancel booking
    static async cancelBooking(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Get bookings
            const bookings = await readBookings();
            const bookingIndex = bookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = bookings[bookingIndex];

            // Verify booking belongs to user
            if (booking.userId !== userId) {
                return res.status(403).json({ error: 'Not authorized to cancel this booking' });
            }

            // Check if booking is already cancelled
            if (booking.status === 'cancelled') {
                return res.status(400).json({ error: 'Booking is already cancelled' });
            }

            // Update parking slot availability
            const parkingSlots = await readParkingData();
            const parkingSlot = parkingSlots.find(slot => slot.id === booking.parkingId);
            
            if (parkingSlot) {
                parkingSlot.availableSpots += 1;
                await writeParkingData(parkingSlots);
            }

            // Update booking status
            booking.status = 'cancelled';
            booking.cancelledAt = new Date().toISOString();
            bookings[bookingIndex] = booking;
            await writeBookings(bookings);

            return res.status(200).json({
                success: true,
                message: 'Booking cancelled successfully',
                data: booking
            });
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return res.status(500).json({ error: 'Error cancelling booking' });
        }
    }

    // Update booking
    static async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const userId = req.user.id;

            const bookings = await readBookings();
            const bookingIndex = bookings.findIndex(b => b.id === id && b.userId === userId);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const updatedBooking = {
                ...bookings[bookingIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            bookings[bookingIndex] = updatedBooking;
            await writeBookings(bookings);

            return res.status(200).json({
                success: true,
                data: updatedBooking
            });
        } catch (error) {
            console.error('Error updating booking:', error);
            return res.status(500).json({ error: 'Error updating booking' });
        }
    }

    static async getBookingById(req, res) {
        const booking = BookingModel.getBookingById(req.params.id);
        return booking ? res.status(200).json({ booking }) : res.status(404).json({ error: 'Booking not found' });
    }

    // Delete booking
    static async deleteBooking(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Get bookings
            const bookings = await readBookings();
            const bookingIndex = bookings.findIndex(b => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = bookings[bookingIndex];

            // Verify booking belongs to user
            if (booking.userId !== userId) {
                return res.status(403).json({ error: 'Not authorized to delete this booking' });
            }

            // Update parking slot availability if booking was active
            if (booking.status === 'active') {
                const parkingSlots = await readParkingData();
                const parkingSlot = parkingSlots.find(slot => slot.id === booking.parkingId);
                
                if (parkingSlot) {
                    parkingSlot.availableSpots += 1;
                    await writeParkingData(parkingSlots);
                }
            }

            // Remove booking
            bookings.splice(bookingIndex, 1);
            await writeBookings(bookings);

            return res.status(200).json({
                success: true,
                message: 'Booking deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting booking:', error);
            return res.status(500).json({ error: 'Error deleting booking' });
        }
    }
}

module.exports = BookingController;
