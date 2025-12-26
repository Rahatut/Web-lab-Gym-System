const Trainer = require('../models/trainerModel');

//Create new trainer
exports.createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(400).json({ error: err.message });
  }
};

//Get all trainers
exports.getTrainers = async (req, res) => {
  try {
    const { specialization, available } = req.query;
    const filter = {};
    if (specialization) {
      const specs = specialization.split(',').map(s => s.trim());
      filter.specialization = { $in: specs };
    }
    if (available !== undefined) filter.available = available === 'true';

    const trainers = await Trainer.find(filter);
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get single trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Update trainer 
exports.updateTrainer = async (req, res) => {
  try {
    const updates = {};
    const allowed = ['hourlyRate', 'available', 'certifications', 'name', 'specialization', 'experienceYears', 'email'];
    Object.keys(req.body).forEach((k) => {
      if (allowed.includes(k)) updates[k] = req.body[k];
    });

    if (req.body.addCertifications && Array.isArray(req.body.addCertifications)) {
      const trainer = await Trainer.findById(req.params.id);
      if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
      trainer.certifications = trainer.certifications.concat(req.body.addCertifications);
      Object.assign(trainer, updates);
      await trainer.save();
      return res.json(trainer);
    }

    const trainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json(trainer);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(400).json({ error: err.message });
  }
};

//Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    res.json({ message: 'Trainer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
