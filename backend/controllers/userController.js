// controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile', error: err });
  }
};


// controllers/userController.js
exports.redeemCameraAccess = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.points < 10) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    user.points -= 10;
    user.logs.push({ message: 'Redeemed 10 points for camera access' });
    await user.save();

    res.json({ success: true, pointsLeft: user.points });
  } catch (err) {
    res.status(500).json({ message: 'Failed to redeem', error: err });
  }
};
