const db = require('../../dbRoutes');

exports.insertSchedule = (user_id, title, start_date, start_time, end_date, end_time, all_day, description) => {
    return db.query(
        `INSERT INTO schedule (user_id, title, start_date, start_time, end_date, end_time, all_day, description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [user_id, title, start_date, start_time === '' ? null : start_time, end_date, end_time === '' ? null : end_time, all_day, description]
    );
};

exports.getSchedulesByUserId = async (userId) => {
    const result = await db.query(
        `SELECT * FROM schedule WHERE user_id = $1 AND delyn = 'N' ORDER BY start_date, start_time`,
        [userId]
    );
    return result.rows;
};

// server/db/queries/scheduleQueries.js
exports.getScheduleById = async (id) => {
    const result = await db.query(
        `SELECT * FROM schedule WHERE id = $1 AND delyn = 'N'`,
        [id]
    );
    return result.rows[0];
};

exports.updateSchedule = async (id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
        throw new Error('업데이트할 항목이 없습니다.');
    }

    // SET 절 동적 생성: "title = $1, start_date = $2, ..."
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `
        UPDATE schedule
        SET ${setClause}
        WHERE id = $${keys.length + 1}
        RETURNING *
    `;

    const result = await db.query(query, [...values, id]);
    return result.rows[0];
};