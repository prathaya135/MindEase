const Message = require('../models/Message');

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .populate('sender', 'username');

    const formattedMessages = messages.map(msg => ({
      from: msg.sender.username,
      message: msg.message,
      timestamp: msg.timestamp
    }));

    res.json(formattedMessages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
};

module.exports = { getAllMessages };
