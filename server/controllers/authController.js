const authQuery = require('../db/authQuery');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await authQuery.getUser(id, password);

        if (!user) {
            return res.status(401).json({ message: '로그인 실패' });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { id: user.id, name: user.name, password: user.password },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 토큰 포함해서 응답
        res.json({ message: '로그인 성공', token, user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};