const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.showRegister = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/todos');
  }
  res.render('register', { error: null });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/todos');
  } catch (error) {
    console.error('Registration error:', error.message);
    res.render('register', { error: 'Error creating user' });
  }
};

exports.showLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/todos');
  }
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/todos');
  } catch (error) {
    console.error('Login error:', error.message);
    res.render('login', { error: 'Error logging in' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};
