const express = require('express');
const router = express.Router();
const checkDupController = require('../controllers/checkDupController');

router.get('/checkId', checkDupController.checkId);

router.get('/checkEmail', checkDupController.checkEmail);

module.exports = router;