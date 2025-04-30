// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);
    const [id, setId] = useState([]);
    const [password, setPassword] = useState([]);

    const handleLogin = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          id: id,
          password: password
        });
        console.log('로그인 성공:', res.data.user);
        // 성공 후 페이지 이동이나 전역 상태 저장도 가능
      } catch (err) {
        console.error('로그인 실패:', err.response.data.message);
      }
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                console.log(response.data); // ✅ 여기 추가
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    return (
      <section className="min-h-screen flex items-center">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-center md:gap-8">
            
            {/* 이미지 */}
            <div className="md:col-span-3">
              <img
                src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="rounded w-full h-auto"
                alt=""
              />
            </div>

            {/* 로그인 폼 */}
            <div className="md:col-span-2 flex flex-col items-center justify-center px-6 py-8">
              <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        required
                      />
                    </div>
                    {/* 아이디 저장 + 비밀번호 찾기 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                          아이디 저장
                        </label>
                      </div>
                      <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        계정 찾기
                      </a>
                    </div>
                    <button
                      type="button"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={handleLogin}
                    >
                      로그인
                    </button>
                    {/* 회원가입 */}
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                      계정이 없으신가요?{' '}
                      <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        회원가입
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
};

export default App;
