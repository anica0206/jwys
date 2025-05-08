const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: '인증된 사용자만 접근 가능', user: req.user });
});

module.exports = router;
