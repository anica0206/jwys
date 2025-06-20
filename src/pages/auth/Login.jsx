import React, { useState } from 'react';
import { login } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import SignupModal from './Signup.jsx';
import LoginMemo from '../../components/login/LoginMemo'; // Memo 컴포넌트 추가
import Logo from '../../components/login/Logo';

const Login = () => {
  const [id, setId] = useState(localStorage.getItem('id') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(id, password);
      console.log('로그인 성공:', res.data);
      localStorage.setItem('token', res.data.token);
      if (rememberMe) {
        localStorage.setItem('id', id);
      } else {
        localStorage.removeItem('id');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('로그인 실패:', err?.response?.data?.message || err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-center md:gap-8">
          <div className="md:col-span-3 flex flex-col items-center justify-center gap-6">
            <Logo />
            <LoginMemo />
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center px-6 py-8">
            <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  로그인
                </h1>
                <form className="space-y-4 md:space-y-6">
                  <div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-gamja"
                      placeholder="아이디"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-gamja"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
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
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                    계정이 없으신가요?{' '}
                    <button type="button" onClick={() => setShowSignUp(true)} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                      회원가입
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showSignUp && <SignupModal onClose={() => setShowSignUp(false)} />}
    </section>
  );
};

export default Login;
