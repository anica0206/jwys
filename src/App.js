import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Main from './pages/dashboard/Main';
import ResetPw from './pages/auth/ResetPw';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Main />} />
          <Route path="/resetpw" element={<ResetPw />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;