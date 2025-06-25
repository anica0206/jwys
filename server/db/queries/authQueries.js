const db = require('../../dbRoutes');

exports.getUser = async (id) => {
    const result = await db.query(
        'SELECT * FROM USERSTB WHERE ID = $1',
        [id]
    );
    return result.rows[0]; // 없으면 undefined
};
