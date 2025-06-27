const db = require('../../dbRoutes');

exports.checkId = async (id) => {
    console.log('쿼리 들어옴');
    const result = await db.query(
        'SELECT COUNT(*) AS cnt FROM USERSTB WHERE ID = $1',
        [id]
    );
    return result.rows[0] || { cnt: '0' }; // 기본값 설정 (null 방지)
};

exports.checkEmail = async (email) => {
    console.log('쿼리 들어옴');
    const result = await db.query(
        'SELECT COUNT(*) AS cnt FROM USERSTB WHERE EMAIL = $1',
        [email]
    );
    return result.rows[0] || { cnt: '0' }; // 기본값 설정 (null 방지)
};