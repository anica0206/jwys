import axios from 'axios';

export const login = (id, password) => {
    return axios.post('http://localhost:5000/api/auth/login', {
        id,
        password
    });
};

export const fetchUsers = () => {
    return axios.get('http://localhost:5000/api/users')
        .then(response => response.data)
        .catch(error => {
            console.error("There was an error fetching the users!", error);
            throw error; // 호출한 쪽에서 try-catch로 처리할 수 있도록
        });
};