import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';

// 이메일 인증번호 발송
export const sendVerificationCode = (email) => {
    return axios.post(`${API_BASE_URL}/api/verifyEmail/sendVerificationCode`, { email })
        .then(res => res.data)
        .catch(err => {
            console.error('인증번호 발송 실패:', err);
            throw err;
        });
};

// 이메일 인증번호 확인
export const verifyCode = (email, code) => {
    return axios.post(`${API_BASE_URL}/api/verifyEmail/verifyCode`, { email, code })
        .then(res => res.data)
        .catch(err => {
            console.error('인증번호 검증 실패:', err);
            throw err;
        });
};