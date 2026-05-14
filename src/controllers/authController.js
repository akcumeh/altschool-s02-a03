const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const generateToken = (userId, username) => {
    return jwt.sign({ userId, username }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '6h'
    });
};

const validateRegistration = (username, password) => {
    const errors = [];

    if (!username || username.trim().length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    return errors;
};

const validateLogin = (username, password) => {
    const errors = [];

    if (!username || username.trim().length === 0) {
        errors.push('Username is required');
    }

    if (!password || password.length === 0) {
        errors.push('Password is required');
    }

    return errors;
};

exports.showRegister = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/todos');
    }
    res.render('register', { error: null });
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const validationErrors = validateRegistration(username, password);
        if (validationErrors.length > 0) {
            const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

            if (isApiRequest) {
                return res.status(400).json({
                    success: false,
                    message: validationErrors[0]
                });
            }

            return res.render('register', { error: validationErrors[0] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username.trim(),
            password: hashedPassword
        });

        await user.save();

        const token = generateToken(user._id, user.username);

        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (isApiRequest) {
            return res.status(201).json({
                success: true,
                token: token,
                user: {
                    username: user.username
                }
            });
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect('/todos');

    } catch (error) {
        console.error('Registration error:', error.message);

        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (error.code === 11000) {
            if (isApiRequest) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
            return res.render('register', { error: 'Username already exists' });
        }

        if (isApiRequest) {
            return res.status(500).json({
                success: false,
                message: 'Error creating user'
            });
        }

        res.render('register', { error: 'Error creating user' });
    }
};

exports.showLogin = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        return res.redirect('/todos');
    }
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const validationErrors = validateLogin(username, password);
        if (validationErrors.length > 0) {
            const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

            if (isApiRequest) {
                return res.status(400).json({
                    success: false,
                    message: validationErrors[0]
                });
            }

            return res.render('login', { error: validationErrors[0] });
        }

        const user = await User.findOne({ username });
        if (!user) {
            const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

            if (isApiRequest) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            return res.render('login', { error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

            if (isApiRequest) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            return res.render('login', { error: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.username);

        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (isApiRequest) {
            return res.status(200).json({
                success: true,
                token: token,
                user: {
                    username: user.username
                }
            });
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log(res.cookie);

        res.redirect('/todos');

    } catch (error) {
        console.error('Login error:', error.message);

        const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

        if (isApiRequest) {
            return res.status(500).json({
                success: false,
                message: 'Error logging in'
            });
        }

        res.render('login', { error: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
};
