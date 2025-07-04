import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';

export const signUp = (id, password, email, name, birth, sex, nation, phoneType, phone, address, addressDetail, postalCode, emailAd, smsAd) => {
    return axios.post(`${API_BASE_URL}/api/signUp`, {
        id,
        password,
        email,
        name,
        birth,
        sex,
        nation,
        phoneType,
        phone,
        address,
        addressDetail,
        postalCode,
        emailAd,
        smsAd
    }).then(res => {
        return res;
    }).catch(err => {
        console.error('가입 실패:', err);
        throw err;
    });
};