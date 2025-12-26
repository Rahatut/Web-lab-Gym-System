const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  age: { type: Number, min: 16, max: 100 },
  membershipType: { type: String, enum: ['basic', 'premium', 'elite'], default: 'basic' },
  joinDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);
