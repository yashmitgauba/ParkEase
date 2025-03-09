const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to Slots File
const slotsFilePath = path.join(__dirname, '../data/slots.json');

// Ensure Slots File Exists
function ensureSlotsFile() {
    if (!fs.existsSync(slotsFilePath)) {
        fs.writeFileSync(slotsFilePath, JSON.stringify([], null, 2));
    }
}

// Utility: Read Slots from File
function getAllSlots() {
    ensureSlotsFile();
    try {
        const data = fs.readFileSync(slotsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading slots file:', error);
        return [];
    }
}

// Utility: Save Slots to File
function saveSlots(slots) {
    try {
        fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 2));
    } catch (error) {
        console.error('Error saving slots:', error);
        return { error: 'Failed to save slot data.' };
    }
}

// Add Slot
function addSlot({ location, capacity, isEVCompatible }) {
    if (!location || typeof location !== 'string' || location.trim() === '') {
        return { error: 'Invalid location.' };
    }
    if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
        return { error: 'Capacity must be a positive number.' };
    }

    const slots = getAllSlots();
    const newSlot = {
        id: uuidv4(), // Use UUID for unique slot IDs
        location,
        capacity,
        isEVCompatible: !!isEVCompatible, // Ensure boolean value
        isAvailable: true,
        bookedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    slots.push(newSlot);
    saveSlots(slots);
    return { success: true, slot: newSlot };
}

// Update Slot
function updateSlot(id, userId, updatedFields) {
    const slots = getAllSlots();
    const slotIndex = slots.findIndex((s) => s.id === id);

    if (slotIndex === -1) {
        return { error: 'Slot not found.' };
    }

    const slot = slots[slotIndex];

    if (slot.bookedBy && slot.bookedBy !== userId) {
        return { error: 'You can only update slots you have booked.' };
    }

    Object.assign(slot, updatedFields, { updatedAt: new Date().toISOString() });

    if (updatedFields.isAvailable === false) {
        slot.bookedBy = userId;
    } else if (updatedFields.isAvailable === true) {
        slot.bookedBy = null;
    }

    slots[slotIndex] = slot;
    saveSlots(slots);
    return { success: true, slot };
}

    // Delete Slot
function deleteSlot(id) {
    const slots = getAllSlots();
    const slotIndex = slots.findIndex((s) => s.id === id);

    if (slotIndex === -1) {
        return { error: 'Slot not found.' };
    }

    const deletedSlot = slots.splice(slotIndex, 1); // Remove the slot
    saveSlots(slots); // Save updated slots list

    return { success: true, deletedSlot };
}


// Check Slot Availability
function checkAvailability(vehicleType) {
    const slots = getAllSlots();
    return slots.filter((slot) => {
        if (vehicleType === 'EV') {
            return slot.isAvailable && slot.isEVCompatible;
        } else {
            return slot.isAvailable && !slot.isEVCompatible;
        }
    });
}

// Get Slot by ID
function getSlotById(id) {
    const slots = getAllSlots();
    return slots.find((slot) => slot.id === id) || { error: 'Slot not found.' };
}

module.exports = {
    getAllSlots,
    saveSlots,
    addSlot,
    updateSlot,
    checkAvailability,
    getSlotById,
    deleteSlot, // Export deleteSlot
};

