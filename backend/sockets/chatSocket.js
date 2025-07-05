const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const chatSocket = (io) => {
  const onlineUsers = {};

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('🔑 Incoming token:', token);

    if (!token) return next(new Error('Authentication error - Token missing'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified:', decoded);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('❌ Token verification failed:', err.message);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.userId;
    onlineUsers[userId] = socket.id;

    console.log(`✅ User connected: ${userId}`);
    console.log('🟢 Current online users:', onlineUsers);

    socket.on('global_message', async ({ message }) => {
      console.log(`📩 Received message from ${userId}:`, message);

      try {
        const user = await User.findById(userId);
        if (!user) {
          console.warn(`⚠️ No user found for ID: ${userId}`);
          return;
        }

        // Save to DB
        const newMessage = new Message({
          sender: userId,
          message,
          timestamp: new Date(),
        });
        await newMessage.save();
        console.log('✅ Message saved to DB:', newMessage);

        const senderUsername = user.username;

        // Broadcast to all online users (including sender)
        for (let uid in onlineUsers) {
          console.log(`📤 Sending message to ${uid} (Socket ID: ${onlineUsers[uid]})`);
          io.to(onlineUsers[uid]).emit('receive_global_message', {
            from: senderUsername,
            message,
          });
        }
      } catch (error) {
        console.error('❌ Error saving or broadcasting message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
      delete onlineUsers[userId];
      console.log('🟢 Online users after disconnect:', onlineUsers);
    });
  });
};

module.exports = chatSocket;
