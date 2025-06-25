import axios from 'axios';

// 환경변수에서 API 주소 불러오기, 없으면 localhost 기본값
// const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://localhost:5000';
const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';

export const findId = (name, email) => {
    return axios.post(`${API_BASE_URL}/api/findAccount/findId`, {
        name,
        email
    }).then(res => {
        return res;
    }).catch(err => {
        console.error('아이디 찾기 실패:', err);
        throw err;
    });
};

export const findPw = (id, email) => {
    return axios.post(`${API_BASE_URL}/api/findAccount/findPw`, {
        id,
        email
    }).then(res => {
        return res;
    }).catch(err => {
        console.error('비밀번호 찾기 실패:', err);
        throw err;
    });
};