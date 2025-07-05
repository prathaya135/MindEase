const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  message: { type: String },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: String },
  logs: [ActivityLogSchema],
});

module.exports = mongoose.model('User', UserSchema);