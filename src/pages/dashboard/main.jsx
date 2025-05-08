import React from 'react';
import { useUser } from '../../context/UserContext';

const MainPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 shadow-md mb-4 text-center">
        메인 페이지
      </h1>
      <h2 className="text-3xl font-semibold text-gray-900 shadow-lg text-center">
        안녕하세요, {user?.name}님
      </h2>
    </div>
  );
};

export default MainPage;