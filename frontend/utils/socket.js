'use client';

import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (token) => {
  socket = io('http://localhost:5000', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });
};

export const sendMessage = (message) => {
  if (socket) {
    console.log('📤 Sending message:', message);
    socket.emit('global_message', { message });
  }
};

export const receiveMessage = (callback) => {
  if (socket) {
    socket.on('receive_global_message', callback);
  }
};
