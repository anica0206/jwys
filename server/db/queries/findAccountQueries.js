const db = require('../../dbRoutes');

exports.findId = async (name, email) => {
    const result = await db.query(
        'SELECT ID FROM USERSTB WHERE NAME = $1 AND EMAIL = $2',
        [name, email]
    );
    return result.rows[0]; // 없으면 undefined
};

exports.findPw = async (id, email) => {
    const result = await db.query(
        'SELECT ID FROM USERSTB WHERE ID = $1 AND EMAIL = $2',
        [id, email]
    );
    return result.rows[0]; // 없으면 undefined
};

exports.resetPw = async (email, newPassword) => {
    const result = await db.query(
        'UPDATE USERSTB SET PASSWORD = $2 WHERE EMAIL = $1',
        [email, newPassword]
    );
    return result.rows[0]; // 없으면 undefined
};