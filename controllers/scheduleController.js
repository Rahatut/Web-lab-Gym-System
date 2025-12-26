const Schedule = require('../models/scheduledWorkoutModel');
const User = require('../models/userModel');
const Trainer = require('../models/trainerModel');

exports.createSchedule = async (req, res) => {
  try {
    const { userId, trainerId, scheduledAt, workoutTypes, notes } = req.body;

    //Validate User Membership
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!['premium', 'elite'].includes(user.membershipType)) {
      return res.status(403).json({ message: 'Access denied. Premium or Elite membership required.' });
    }

    //Validate Trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const sessionDate = new Date(scheduledAt);

    //Check Trainer Availability 
    const trainerConflict = await Schedule.findOne({
      trainerId,
      scheduledAt: sessionDate,
      status: { $ne: 'cancelled' }
    });

    if (trainerConflict) {
      return res.status(409).json({ message: 'Trainer is not available at this time.' });
    }

    //Check User Availability
    const userConflict = await Schedule.findOne({
      userId,
      scheduledAt: sessionDate,
      status: { $ne: 'cancelled' }
    });

    if (userConflict) {
      return res.status(409).json({ message: 'User already has a workout scheduled at this time.' });
    }

    //Create Schedule
    const schedule = new Schedule({
      userId,
      trainerId,
      scheduledAt: sessionDate,
      workoutTypes,
      notes,
      status: 'scheduled'
    });

    await schedule.save();

    //Notification
    console.log(`Notification: Workout scheduled for user ${user.email} with trainer ${trainer.name} at ${scheduledAt}`);

    res.status(201).json(schedule);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
