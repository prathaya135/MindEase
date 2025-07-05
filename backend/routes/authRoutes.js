const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { getAllMessages } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile, redeemCameraAccess } = require('../controllers/userController');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Get All Messages Route
router.get('/messages', authMiddleware, getAllMessages);
router.get('/profile', authMiddleware, getProfile);
router.post('/redeem-camera', authMiddleware, redeemCameraAccess);

module.exports = router;
