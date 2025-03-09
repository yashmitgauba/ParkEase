const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Read users from file
const readUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write users to file
const writeUsers = async (users) => {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

class UserController {
    // User Registration
    static async register(req, res) {
        try {
            const { username, email, password, role } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Username, email, and password are required' });
            }

            if (!role) {
                return res.status(400).json({ error: 'Role is required' });
            }

            const result = await UserModel.createUser({ username, email, password, role });

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            if (!result.user) {
                return res.status(500).json({ error: 'Failed to create user' });
            }

            return res.status(201).json({ message: 'User registered successfully', user: result.user });
        } catch (error) {
            console.error('Register Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // User Login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await UserModel.login(email, password);

            if (result.error) {
                return res.status(401).json({ error: result.error });
            }

            if (!result.user || !result.token) {
                return res.status(500).json({ error: 'Failed to login' });
            }

            return res.status(200).json({ message: 'Login successful', user: result.user, token: result.token });
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get User by ID
    static async getUser(req, res) {
        try {
            const users = await readUsers();
            const user = users.find(u => u.id === req.params.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error('Get User Error:', error);
            return res.status(500).json({ error: 'Error fetching user' });
        }
    }

    // Update User
    static async updateUser(req, res) {
        try {
            const { username, email } = req.body;
            const userId = req.params.id;

            // Validate input
            if (!username && !email) {
                return res.status(400).json({ error: 'At least one field (username or email) is required' });
            }

            const users = await readUsers();
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create updated user object
            const updatedUser = {
                ...users[userIndex],
                ...(username && { username }),
                ...(email && { email }),
                updatedAt: new Date().toISOString()
            };

            // Update the user in the array
            users[userIndex] = updatedUser;

            // Save to file
            await writeUsers(users);

            return res.status(200).json({
                message: 'User updated successfully',
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    updatedAt: updatedUser.updatedAt
                }
            });
        } catch (error) {
            console.error('Update User Error:', error);
            return res.status(500).json({ error: 'Error updating user' });
        }
    }

    // Delete User
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const users = await readUsers();
            const filteredUsers = users.filter(u => u.id !== userId);

            if (users.length === filteredUsers.length) {
                return res.status(404).json({ error: 'User not found' });
            }

            await writeUsers(filteredUsers);

            return res.status(200).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete User Error:', error);
            return res.status(500).json({ error: 'Error deleting user' });
        }
    }
}

module.exports = UserController;
