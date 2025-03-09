const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto'); // Node.js built-in module for generating random values

const PARKING_FILE = path.join(__dirname, '../data/parking.json');

// Read parking data from file
const readParkingData = async () => {
    try {
        const data = await fs.readFile(PARKING_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
};

// Write parking data to file
const writeParkingData = async (data) => {
    const dir = path.dirname(PARKING_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
    await fs.writeFile(PARKING_FILE, JSON.stringify(data, null, 2));
};

// Generate random parking ID
const generateParkingId = () => {
    // Generate a 6-character alphanumeric ID
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

class ParkingController {
    // Get all parking slots
    static async getAllSlots(req, res) {
        try {
            const parkingSlots = await readParkingData();
            return res.status(200).json({
                success: true,
                data: parkingSlots
            });
        } catch (error) {
            console.error('Error fetching parking slots:', error);
            return res.status(500).json({ error: 'Error fetching parking slots' });
        }
    }

    // Add new parking slot
    static async addSlot(req, res) {
        try {
            const { name, location, totalSpots, availableSpots, pricePerHour } = req.body;

            // Validate input
            if (!name || !location || !totalSpots || !pricePerHour) {
                return res.status(400).json({
                    error: 'Please provide all required fields: name, location, totalSpots, pricePerHour'
                });
            }

            const parsedTotalSpots = parseInt(totalSpots);
            let parsedAvailableSpots = parseInt(availableSpots || totalSpots);

            // Validate spots
            if (parsedTotalSpots <= 0) {
                return res.status(400).json({
                    error: 'Total spots must be greater than 0'
                });
            }

            // Ensure available spots don't exceed total spots
            if (parsedAvailableSpots > parsedTotalSpots) {
                parsedAvailableSpots = parsedTotalSpots;
            }

            const parkingSlots = await readParkingData();

            // Generate unique parking ID
            let parkingId;
            do {
                parkingId = generateParkingId();
            } while (parkingSlots.some(slot => slot.id === parkingId));

            const newSlot = {
                id: parkingId,
                name,
                location,
                totalSpots: parsedTotalSpots,
                availableSpots: parsedAvailableSpots,
                pricePerHour: parseFloat(pricePerHour),
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            parkingSlots.push(newSlot);
            await writeParkingData(parkingSlots);

            return res.status(201).json({
                success: true,
                data: newSlot
            });
        } catch (error) {
            console.error('Error adding parking slot:', error);
            return res.status(500).json({ error: 'Error adding parking slot' });
        }
    }

    // Update parking slot
    static async updateSlot(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const parkingSlots = await readParkingData();
            const slotIndex = parkingSlots.findIndex(slot => slot.id === id);

            if (slotIndex === -1) {
                return res.status(404).json({ error: 'Parking slot not found' });
            }

            const currentSlot = parkingSlots[slotIndex];

            // If updating spots, validate them
            if (updates.totalSpots || updates.availableSpots) {
                const newTotalSpots = parseInt(updates.totalSpots || currentSlot.totalSpots);
                let newAvailableSpots = parseInt(updates.availableSpots || currentSlot.availableSpots);

                if (newTotalSpots <= 0) {
                    return res.status(400).json({
                        error: 'Total spots must be greater than 0'
                    });
                }

                // Ensure available spots don't exceed total spots
                if (newAvailableSpots > newTotalSpots) {
                    newAvailableSpots = newTotalSpots;
                }

                updates.totalSpots = newTotalSpots;
                updates.availableSpots = newAvailableSpots;
            }

            const updatedSlot = {
                ...currentSlot,
                ...updates,
                updatedAt: new Date().toISOString()
            };

            parkingSlots[slotIndex] = updatedSlot;
            await writeParkingData(parkingSlots);

            return res.status(200).json({
                success: true,
                data: updatedSlot
            });
        } catch (error) {
            console.error('Error updating parking slot:', error);
            return res.status(500).json({ error: 'Error updating parking slot' });
        }
    }

    // Delete parking slot
    static async deleteSlot(req, res) {
        try {
            const { id } = req.params;
            const parkingSlots = await readParkingData();
            const filteredSlots = parkingSlots.filter(slot => slot.id !== id);

            if (parkingSlots.length === filteredSlots.length) {
                return res.status(404).json({ error: 'Parking slot not found' });
            }

            await writeParkingData(filteredSlots);

            return res.status(200).json({
                success: true,
                message: 'Parking slot deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting parking slot:', error);
            return res.status(500).json({ error: 'Error deleting parking slot' });
        }
    }

    // Get Parking Slot by ID
    static async getSlotById(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Parking slot ID is required' });

            const parkingSlots = await readParkingData();
            const slot = parkingSlots.find(s => s.id === id);

            if (!slot) return res.status(404).json({ error: 'Parking slot not found' });

            return res.status(200).json({ slot });
        } catch (error) {
            console.error('Error fetching parking slot:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Check Parking Slot Availability
    static async checkAvailability(req, res) {
        try {
            const { vehicleType } = req.query;

            if (!vehicleType) return res.status(400).json({ error: 'Vehicle type is required' });

            const parkingSlots = await readParkingData();
            const availableSlots = parkingSlots.filter(slot => slot.status === 'active' && slot.vehicleType === vehicleType);

            return res.status(200).json({ availableSlots });
        } catch (error) {
            console.error('Error checking availability:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = ParkingController;
