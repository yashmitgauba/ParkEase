const fs = require('fs');
const path = require('path');

const bookingsFilePath = path.join(__dirname, '../data/bookings.json');

// Read bookings
function getBookings() {
    try {
        if (!fs.existsSync(bookingsFilePath)) {
            fs.writeFileSync(bookingsFilePath, JSON.stringify([]), 'utf-8');
        }
        const data = fs.readFileSync(bookingsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading bookings:', error);
        return [];
    }
}

// Save bookings
function saveBookings(bookings) {
    try {
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving bookings:', error);
        throw new Error('Failed to save bookings.');
    }
}

// Generate unique ID
function generateId(bookings) {
    return bookings.length ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
}

// Check slot availability
function isSlotAvailable(slotId, startTime, endTime) {
    const bookings = getBookings();
    return !bookings.some(b =>
        b.slotId === slotId &&
        b.status === 'Active' &&
        (
            (new Date(startTime) >= new Date(b.startTime) && new Date(startTime) < new Date(b.endTime)) ||
            (new Date(endTime) > new Date(b.startTime) && new Date(endTime) <= new Date(b.endTime)) ||
            (new Date(startTime) <= new Date(b.startTime) && new Date(endTime) >= new Date(b.endTime))
        )
    );
}

// Validate booking
function validateBooking(booking) {
    if (!booking.slotId || !booking.startTime || !booking.endTime || !booking.vehicleType) {
        throw new Error('Missing required fields: slotId, startTime, endTime, vehicleType.');
    }
    if (new Date(booking.startTime) >= new Date(booking.endTime)) {
        throw new Error('startTime must be before endTime.');
    }
}

// Create a new booking
function createBooking(newBooking) {
    const bookings = getBookings();
    validateBooking(newBooking);

    if (!isSlotAvailable(newBooking.slotId, newBooking.startTime, newBooking.endTime)) {
        throw new Error('Slot is not available.');
    }

    newBooking.id = generateId(bookings);
    newBooking.status = 'Active';
    newBooking.createdAt = new Date().toISOString();
    newBooking.updatedAt = new Date().toISOString();

    bookings.push(newBooking);
    saveBookings(bookings);
    return newBooking;
}

// Get all bookings
function getAllBookings() {
    return getBookings();
}

// Get a booking by ID
function getBookingById(id) {
    return getBookings().find(b => b.id === parseInt(id, 10)) || null;
}

// Update booking
function updateBooking(id, updatedFields) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === parseInt(id, 10));

    if (index === -1) throw new Error('Booking not found.');

    bookings[index] = { ...bookings[index], ...updatedFields, updatedAt: new Date().toISOString() };
    saveBookings(bookings);
    return bookings[index];
}

// Cancel a booking
function cancelBooking(id) {
    return updateBooking(id, { status: 'Canceled' });
}

// Delete a booking
function deleteBooking(id) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === parseInt(id, 10));

    if (index === -1) throw new Error('Booking not found.');

    bookings.splice(index, 1);
    saveBookings(bookings);
    return { message: 'Booking deleted successfully' };
}

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking
};
