const db = require('../db');

exports.getUser = async (id, password) => {
    const result = await db.query(
        'SELECT * FROM USERS WHERE ID = $1 AND PASSWORD = $2',
        [id, password]
    );
    return result.rows[0]; // 없으면 undefined
};
