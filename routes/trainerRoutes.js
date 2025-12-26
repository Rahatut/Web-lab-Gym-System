const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/', trainerController.createTrainer);
router.get('/', trainerController.getTrainers);
router.get('/:id', trainerController.getTrainerById);
router.patch('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);

module.exports = router;
