const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signUpController');

router.post('/', signUpController.signUp);

// router.post('/', (req, res) => {
//     console.log('🔥 signUp 호출됨');
//     console.log('req.body:', req.body);
//     res.status(200).json({ message: 'signUp 정상 작동' });
// });

module.exports = router;