const authQuery = require('../db/queries/authQueries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await authQuery.getUser(id);

        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: '로그인 성공', token, user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
