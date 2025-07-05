const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      points: 50, // Initial points
      streak: 0,
      logs: [
        {
          message: 'Signed up and received 50 points',
        },
      ],
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Check for streak
    const today = dayjs().format('YYYY-MM-DD');
    const lastLogin = user.lastLoginDate;
    if (lastLogin !== today) {
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      user.streak = lastLogin === yesterday ? user.streak + 1 : 1;
      user.points += 10; // reward for login
      user.lastLoginDate = today;

      user.logs.push({
        message: `Logged in and earned 10 points`,
      });
    }

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};
