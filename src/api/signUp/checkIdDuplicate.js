import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';

export const checkIdDuplicate = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/api/checkId`, {
    params: { id }
  });
  return res.data.available;
};