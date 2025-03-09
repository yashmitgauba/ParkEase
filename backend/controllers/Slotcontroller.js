const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const SLOTS_FILE = path.join(__dirname, '../data/slots.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Generate random slot ID
const generateSlotId = () => {
    return 'SLOT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Read slots data
const readSlots = async () => {
    try {
        const data = await fs.readFile(SLOTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


// Write slots data
const writeSlots = async (data) => {
    const dir = path.dirname(SLOTS_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
    await fs.writeFile(SLOTS_FILE, JSON.stringify(data, null, 2));
};

// Read users data
const readUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

class SlotController {
    // Get all slots
    static async getAllSlots(req, res) {
        try {
            const slots = await readSlots();
            return res.status(200).json({
                success: true,
                data: slots
            });
        } catch (error) {
            console.error('Error fetching slots:', error);
            return res.status(500).json({ error: 'Error fetching slots' });
        }
    }

    // Add new slot
    static async addSlot(req, res) {
        try {
            const { parkingId, floorNumber, section } = req.body;

            // Validate input
            if (!parkingId || !floorNumber || !section) {
                return res.status(400).json({
                    error: 'Please provide all required fields: parkingId, floorNumber, section'
                });
            }

            const slots = await readSlots();

            // Format slot number as FloorNumber-Section (e.g., "2-A")
            const slotNumber = `${floorNumber}-${section}`;

            // Check if slot number already exists for this parking
            const slotExists = slots.some(slot => 
                slot.parkingId === parkingId && 
                slot.slotNumber === slotNumber
            );

            if (slotExists) {
                return res.status(400).json({
                    error: `Slot ${slotNumber} already exists in this parking area`
                });
            }

            // Generate unique slot ID
            let slotId;
            do {
                slotId = generateSlotId();
            } while (slots.some(slot => slot.id === slotId));

            const newSlot = {
                id: slotId,
                parkingId,
                slotNumber,
                floorNumber,
                section,
                isOccupied: false,
                bookedBy: null,
                bookedByName: null,
                vehicleNumber: null,
                createdAt: new Date().toISOString(),
                status: 'available'
            };

            slots.push(newSlot);
            await writeSlots(slots);

            return res.status(201).json({
                success: true,
                data: newSlot
            });
        } catch (error) {
            console.error('Error adding slot:', error);
            return res.status(500).json({ error: 'Error adding slot' });
        }
    }

    // Update slot
    static async updateSlot(req, res) {
        try {
            const { id } = req.params;
            const { userId, vehicleNumber } = req.body;

            const slots = await readSlots();
            const slotIndex = slots.findIndex(slot => slot.id === id);

            if (slotIndex === -1) {
                return res.status(404).json({ error: 'Slot not found' });
            }

            // If booking the slot
            if (userId) {
                const users = await readUsers();
                const user = users.find(u => u.id === userId);
                
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                slots[slotIndex] = {
                    ...slots[slotIndex],
                    isOccupied: true,
                    bookedBy: userId,
                    bookedByName: user.username,
                    vehicleNumber: vehicleNumber || null,
                    status: 'occupied',
                    updatedAt: new Date().toISOString()
                };
            } 
            // If freeing the slot
            else if (userId === null) {
                slots[slotIndex] = {
                    ...slots[slotIndex],
                    isOccupied: false,
                    bookedBy: null,
                    bookedByName: null,
                    vehicleNumber: null,
                    status: 'available',
                    updatedAt: new Date().toISOString()
                };
            }

            await writeSlots(slots);

            return res.status(200).json({
                success: true,
                data: slots[slotIndex]
            });
        } catch (error) {
            console.error('Error updating slot:', error);
            return res.status(500).json({ error: 'Error updating slot' });
        }
    }

    // Delete slot
    static async deleteSlot(req, res) {
        try {
            const { id } = req.params;
            const slots = await readSlots();
            const filteredSlots = slots.filter(slot => slot.id !== id);

            if (slots.length === filteredSlots.length) {
                return res.status(404).json({ error: 'Slot not found' });
            }

            await writeSlots(filteredSlots);

            return res.status(200).json({
                success: true,
                message: 'Slot deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting slot:', error);
            return res.status(500).json({ error: 'Error deleting slot' });
        }
    }

    // Check slot availability
    static async checkAvailability(req, res) {
        try {
            const slots = await readSlots();
            const availableSlots = slots.filter(slot => 
                slot.status === 'available' && !slot.isOccupied
            );

            // Group available slots by parking location
            const groupedSlots = availableSlots.reduce((acc, slot) => {
                if (!acc[slot.parkingId]) {
                    acc[slot.parkingId] = {
                        parkingId: slot.parkingId,
                        slots: []
                    };
                }
                acc[slot.parkingId].slots.push({
                    id: slot.id,
                    slotNumber: slot.slotNumber,
                    floorNumber: slot.floorNumber,
                    section: slot.section,
                    status: slot.status
                });
                return acc;
            }, {});

            return res.status(200).json({
                success: true,
                data: Object.values(groupedSlots)
            });
        } catch (error) {
            console.error('Error checking availability:', error);
            return res.status(500).json({ error: 'Error checking slot availability' });
        }
    }
}

module.exports = SlotController;
