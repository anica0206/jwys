import axios from 'axios';

// 환경변수에서 API 주소 불러오기, 없으면 localhost 기본값
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://134.185.112.116:5000';

export const login = (id, password) => {
    return axios.post(`${API_BASE_URL}/api/auth/login`, {
        id,
        password
    });
};

export const fetchUsers = () => {
    return axios.get(`${API_BASE_URL}/api/users`)
        .then(response => response.data)
        .catch(error => {
            console.error("There was an error fetching the users!", error);
            throw error;
        });
};
