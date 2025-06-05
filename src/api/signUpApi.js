import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const signUp = (id, email, password) => {
    return axios.post(`${API_BASE_URL}/api/signUp`, {
        id,
        email,
        password
    }).then(res => {
        return res;
    }).catch(err => {
        console.error('가입 실패:', err);
        throw err;
    });
};