import axios from 'axios';

// 환경변수에서 API 주소 불러오기, 없으면 localhost 기본값
const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://localhost:5000';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://134.185.112.116:5000';

export const login = (id, password) => {
    localStorage.removeItem('token');

    return axios.post(`${API_BASE_URL}/api/auth/login`, {
        id,
        password
    }).then(res => {
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return res;
    }).catch(err => {
        console.error('로그인 실패:', err);
        throw err;
    });
};

export const fetchUsers = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error("There was an error fetching the users!", error);
        throw error;
    });
};