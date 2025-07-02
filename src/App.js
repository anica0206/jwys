import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPw from './pages/auth/ResetPw';
import Main from './pages/dashboard/Main';
import Report from './pages/dashboard/Report';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인, 회원가입 */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetpw" element={<ResetPw />} />

          {/* 메인페이지 */}
          <Route path="/main" element={<Main />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;