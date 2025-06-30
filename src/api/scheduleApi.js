import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';


export const saveSchedule = (formData) => {
    return axios.post(`${API_BASE_URL}/api/schedules`,
        formData
    ).then(res => {
        return res;
    }).catch(err => {
        console.error('등록 실패:', err);
        throw err;
    });
};

export const fetchSchedules = (userId) => {
    return axios.get(`${API_BASE_URL}/api/schedules`, {
        params: { userId }
    })
        .then(res => res.data)
        .catch(err => {
            console.error('조회 실패:', err);
            throw err;
        });
};

export const updateSchedule = (id, updateFields) => {
    return axios.put(`${API_BASE_URL}/api/schedules/${id}`, updateFields)
        .then(res => res.data)
        .catch(err => {
            console.error('업데이트 실패:', err);
            throw err;
        });
};

export const getScheduleById = (id) => {
    return axios.get(`${API_BASE_URL}/api/schedules/${id}`)
        .then(res => res.data)
        .catch(err => {
            console.error('상세 조회 실패:', err);
            throw err;
        });
};