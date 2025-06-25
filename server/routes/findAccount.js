const express = require('express');
const router = express.Router();
const findAcountController = require('../controllers/findAccountController');
const redisClient = require('../redisClient');

router.post('/findId', findAcountController.findId);

router.post('/findPw', findAcountController.findPw);

router.post('/resetPw', findAcountController.resetPw);

router.post('/verifyPwCode', findAcountController.verifyPwCode);
  

module.exports = router;
