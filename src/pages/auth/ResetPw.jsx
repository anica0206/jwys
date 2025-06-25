import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPw = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 불일치',
        text: '입력한 비밀번호가 일치하지 않습니다.'
      });
      return;
    }

    try {
      const res = await axios.post('/api/findAccount/resetPw', {
        email,
        newPassword
      });

      Swal.fire({
        icon: 'success',
        title: '변경 완료',
        text: '비밀번호가 성공적으로 변경되었습니다.'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: err?.response?.data?.message || '비밀번호 변경 중 오류 발생'
      });
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      <input
        type="password"
        placeholder="새 비밀번호"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>비밀번호 변경</button>
    </div>
  );
};

export default ResetPw;