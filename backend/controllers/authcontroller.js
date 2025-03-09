const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure the data directory exists
const ensureDataDir = async () => {
    const dir = path.join(__dirname, '../data');
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
};

// Read users from file
const readUsers = async () => {
    try {
        await ensureDataDir();
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write users to file
const writeUsers = async (users) => {
    await ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

class AuthController {
    // Register User
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const { valid, errors } = validateRegisterInput(username, email, password);
            if (!valid) {
                return res.status(400).json(errors);
            }

            // Get existing users
            const users = await readUsers();

            // Check if user exists
            if (users.find(u => u.email === email)) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                username,
                email,
                password: hashedPassword,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);
            await writeUsers(users);

            // Generate token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                },
                token
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Error registering user' });
        }
    }

    // Login User
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const { valid, errors } = validateLoginInput(email, password);
            if (!valid) {
                return res.status(400).json(errors);
            }

            // Get users
            const users = await readUsers();

            // Find user
            const user = users.find(u => u.email === email);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            // Check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Error logging in' });
        }
    }

    // Get User Profile
    static async getProfile(req, res) {
        try {
            const users = await readUsers();
            const user = users.find(u => u.id === req.user.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Profile error:', error);
            return res.status(500).json({ error: 'Error fetching profile' });
        }
    }
}

module.exports = AuthController;
