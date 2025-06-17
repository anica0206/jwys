const express = require('express');
const router = express.Router();
const checkIdController = require('../controllers/checkIdController');

router.get('/', checkIdController.checkId);

module.exports = router;