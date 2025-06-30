const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// 일정 저장
router.post('/', scheduleController.saveSchedule);
router.get('/', scheduleController.getSchedules);
router.put('/:id', scheduleController.updateSchedule);
router.get('/:id', scheduleController.getScheduleById);

module.exports = router;
