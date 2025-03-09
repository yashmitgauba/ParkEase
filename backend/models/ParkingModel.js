const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Paths to data files
const parkingsFilePath = path.join(__dirname, '../data/parkinglots.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Ensure the parking data file exists
function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// Ensure files exist on initialization
ensureFileExists(parkingsFilePath);
ensureFileExists(usersFilePath);

// Read JSON data safely
function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

// Write JSON data safely
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
        throw new Error('Failed to save data.');
    }
}

// Get all parking spots
function getParkings() {
    return readJsonFile(parkingsFilePath);
}

// Add a new parking spot
function addParking(userId, location, capacity, price, floors = 1) {
    const user = getUserById(userId);
    if (!user) throw new Error('User not found.');

    validateParkingData(location, capacity, price, floors);

    const parkings = getParkings();

    // Check if a parking spot already exists at the same location
    if (parkings.some((p) => p.location.toLowerCase() === location.toLowerCase())) {
        throw new Error('A parking spot already exists at this location.');
    }

    const floorsData = Array.from({ length: floors }, (_, i) => ({
        floorNumber: i + 1,
        capacity,
        available: capacity,
    }));

    const newParking = {
        id: uuidv4(),
        location,
        price,
        floors: floorsData,
        addedBy: userId,
    };

    parkings.push(newParking);
    writeJsonFile(parkingsFilePath, parkings);

    return newParking;
}

// Delete a parking spot by ID
function deleteParking(id) {
    const parkings = getParkings();
    const index = parkings.findIndex((parking) => parking.id === id);

    if (index === -1) {
        return { error: 'Parking spot not found.' };
    }

    parkings.splice(index, 1);
    writeJsonFile(parkingsFilePath, parkings);

    return { success: true };
}

// Validate parking data
function validateParkingData(location, capacity, price, floors) {
    if (!location || typeof location !== 'string' || location.trim() === '') {
        throw new Error('Invalid location: must be a non-empty string.');
    }
    if (!Number.isFinite(capacity) || capacity <= 0) {
        throw new Error('Invalid capacity: must be a positive number.');
    }
    if (!Number.isFinite(price) || price < 0) {
        throw new Error('Invalid price: must be a non-negative number.');
    }
    if (!Number.isFinite(floors) || floors <= 0) {
        throw new Error('Invalid floors: must be a positive number.');
    }
}

// Get a user by ID
function getUserById(userId) {
    const users = readJsonFile(usersFilePath);
    return users.find((user) => user.id === userId) || null;
}

module.exports = {
    getParkings,
    addParking,
    deleteParking, // Exported delete function
    validateParkingData,
};
