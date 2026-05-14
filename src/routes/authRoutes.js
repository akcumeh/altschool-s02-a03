const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.showRegister);
router.get('/login', authController.showLogin);
router.get('/logout', authController.logout);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
