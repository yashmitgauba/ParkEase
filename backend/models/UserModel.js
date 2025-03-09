const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const USERS_FILE = path.join(__dirname, '../data/users.json');

class UserModel {
    // Ensure users file exists
    static ensureFileExists() {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify([]));
        }
    }

    // Read users from file
    static readUsers() {
        this.ensureFileExists();
        try {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users file:', error);
            return [];
        }
    }

    // Write users to file
    static writeUsers(users) {
        try {
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Error writing users file:', error);
        }
    }

    // Find user by email
    static findUserByEmail(email) {
        return this.readUsers().find((user) => user.email === email) || null;
    }

    // Create a new user
    static createUser({ username, email, password, role = 'user' }) {
        if (!username || !email || !password) {
            throw new Error('All fields (username, email, password) are required');
        }

        const users = this.readUsers();
        if (users.some((user) => user.email === email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: bcrypt.hashSync(password, 10),
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);
        this.writeUsers(users);

        return newUser;
    }

    // Authenticate user
    static login(email, password) {
        const user = this.findUserByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    // Update user details
    static updateUser(id, updates) {
        const users = this.readUsers();
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        if (updates.password) {
            updates.password = bcrypt.hashSync(updates.password, 10);
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        this.writeUsers(users);
        return users[userIndex];
    }

    // Delete a user
    static deleteUser(id) {
        const users = this.readUsers();
        const filteredUsers = users.filter((user) => user.id !== id);

        if (filteredUsers.length === users.length) {
            throw new Error('User not found');
        }

        this.writeUsers(filteredUsers);
        return { message: 'User deleted successfully' };
    }
}

module.exports = UserModel;
