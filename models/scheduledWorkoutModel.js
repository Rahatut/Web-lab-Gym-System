const mongoose = require('mongoose');

const scheduledWorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  scheduledAt: { type: Date, required: true },
  workoutTypes: [{ type: String }],
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });

scheduledWorkoutSchema.index({ trainerId: 1, scheduledAt: 1 }, { unique: false });

module.exports = mongoose.model('ScheduledWorkout', scheduledWorkoutSchema);
