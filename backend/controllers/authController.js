const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { saveUser, findUserByEmail } = require('../services/userService');

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = { id: uuidv4(), email, passwordHash };

        await saveUser(user);
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

        // Set cookie (basic session simulation)
        res.cookie('userId', user.id, {
            httpOnly: true,
            // secure: true, // Uncomment in production
            sameSite: 'Strict',
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('userId');
    res.status(200).json({ message: 'Logged out successfully' });
};
