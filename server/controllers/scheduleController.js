const scheduleQueries = require('../db/queries/scheduleQueries');

exports.saveSchedule = async (req, res) => {
    const {user_id, title, start_date, start_time, end_date, end_time, all_day, description } = req.body;

    console.log('📦 req.body:', req.body);

    try {
        await scheduleQueries.insertSchedule(user_id, title, start_date, start_time, end_date, end_time, all_day, description);

        console.log('일정 저장 완료:', title);
        res.json({ message: '일정 저장 완료' });
    } catch (err) {
        console.log('🔥 일정 저장 오류:', err);
        res.status(500).json({ message: '일정 저장 실패' });
    }
};

exports.getSchedules = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId가 필요합니다.' });
        }
        const schedules = await scheduleQueries.getSchedulesByUserId(userId);
        res.json(schedules);
    } catch (err) {
        console.error('일정 조회 에러:', err);
        res.status(500).json({ error: '일정 조회 실패' });
    }
};

exports.updateSchedule = async (req, res) => {
    const scheduleId = req.params.id;
    const updateFields = req.body;

    try {
        const updated = await scheduleQueries.updateSchedule(scheduleId, updateFields);
        res.json(updated);
    } catch (err) {
        console.error('일정 업데이트 오류:', err);
        res.status(500).json({ error: '일정 업데이트 실패' });
    }
};

// server/controllers/scheduleController.js
exports.getScheduleById = async (req, res) => {
    try {
        const id = req.params.id;
        const schedule = await scheduleQueries.getScheduleById(id);
        if (!schedule) {
            return res.status(404).json({ error: '일정이 없습니다.' });
        }
        res.json(schedule);
    } catch (err) {
        console.error('일정 조회 오류:', err);
        res.status(500).json({ error: '서버 오류' });
    }
};
