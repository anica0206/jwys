import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Main from './pages/dashboard/main';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;