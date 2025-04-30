const authQuery = require('../db/authQuery');

exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await authQuery.getUser(id, password);

        if (!user) {
            return res.status(401).json({ message: '로그인 실패' });
        }

        res.json({ message: '로그인 성공', user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
