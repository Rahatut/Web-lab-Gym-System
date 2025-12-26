const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  specialization: [{ type: String, enum: ['yoga', 'cardio', 'strength', 'pilates', 'cross-fit', 'boxing', 'crossfit'] }],
  experienceYears: { type: Number, min: 1 },
  hourlyRate: { type: Number, required: true, min: 10 },
  available: { type: Boolean, default: true },
  certifications: [{ type: String }]
});

module.exports = mongoose.model('Trainer', trainerSchema);
