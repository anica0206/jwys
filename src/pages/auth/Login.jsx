import React, { useState } from 'react';
import { login } from '../../api/authApi';
import { findId, findPw } from '../../api/findAccountApi'
import { useNavigate } from 'react-router-dom';
import SignupModal from './Signup.jsx';
import LoginMemo from '../../components/login/LoginMemo'; // Memo 컴포넌트 추가
import Logo from '../../components/login/Logo';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [id, setId] = useState(localStorage.getItem('id') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const [findIdName, setFindIdName] = useState(localStorage.getItem('findIdName') || '');
  const [findIdEmail, setFindIdEmail] = useState(localStorage.getItem('findIdEmail') || '');
  const [isPwVerifyStep, setIsPwVerifyStep] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [findPwId, setFindPwId] = useState(localStorage.getItem('findPwId') || '');
  const [findPwEmail, setFindPwEmail] = useState(localStorage.getItem('findPwEmail') || '');


  const [isFindAccountOpen, setIsFindAccountOpen] = useState(false);
  const [findStep, setFindStep] = useState('select'); // 'select' | 'findId' | 'findPw' | 'resetPw'

  const [isSendingPwEmail, setIsSendingPwEmail] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_BASE_URL = process.env.REACT_APP_BACK_API_URL || 'http://134.185.112.116:5000';

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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.response?.data?.message || '로그인에 실패했습니다!',
        confirmButtonText: '확인',
      });
    }
  };

  const handleFindId = async () => {
    try {
      const res = await findId(findIdName, findIdEmail);
      console.log('ID 찾기 성공:', res.data);
      Swal.fire({
        icon: 'success',
        title: '완료!',
        text: res?.data?.message,
        confirmButtonText: '확인',
      }); 
    } catch (err) {
      console.error('ID 찾기 실패:', err?.response?.data?.message || err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.response?.data?.message || 'ID 찾기에 실패했습니다!',
        confirmButtonText: '확인',
      });
    }
  };

  const handleFindPw = async () => {
    setIsSendingPwEmail(true); // 시작: 로딩 중 표시
    try {
      const res = await findPw(findPwId, findPwEmail);  // 서버로 아이디+이메일 확인 요청
      
      Swal.fire({
        icon: 'success',
        title: '메일 발송 완료!',
        text: res.data.message || '입력하신 이메일로 인증코드를 발송했습니다.',
        confirmButtonText: '확인'
      });

      setIsPwVerifyStep(true);  // 성공 시 인증코드 입력 단계 보여줌
    } catch (err) {
      console.error('비밀번호 찾기 실패:', err?.response?.data?.message || err.message);
      Swal.fire({
        icon: 'error',
        title: '에러!',
        text: err?.response?.data?.message || '입력하신 정보로 계정을 찾을 수 없습니다.',
        confirmButtonText: '확인'
      });
    } finally {
      setIsSendingPwEmail(false); // 끝: 로딩 중 해제
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/findAccount/verifyPwCode`, {
        email: findPwEmail.trim(),
        code: verifyCode
      });
  
      Swal.fire({
        icon: 'success',
        title: '인증 성공!',
        text: res.data.message || '비밀번호 변경 페이지로 이동합니다.',
        confirmButtonText: '확인'
      }).then(() => {
        // 성공 시 → 비밀번호 재설정 페이지로 이동
        setFindStep('resetPw');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '인증 실패',
        text: err?.response?.data?.message || '인증번호가 일치하지 않습니다.',
        confirmButtonText: '확인'
      });
    }
  };

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
      const res = await axios.post(`${API_BASE_URL}/api/findAccount/resetPw`, {
        email,
        newPassword
      });

      Swal.fire({
        icon: 'success',
        title: '변경 완료',
        text: '비밀번호가 성공적으로 변경되었습니다.'
      }).then(() => {
        handleCloseFindAccountModal();
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: err?.response?.data?.message || '비밀번호 변경 중 오류 발생'
      });
    }
  };

  const handleCloseFindAccountModal = () => {
    setIsFindAccountOpen(false); // 모달 닫기
  
    // 초기화
    setFindStep('select');
    setFindPwEmail('');
    setFindPwId('');
    setVerifyCode('');
    setIsPwVerifyStep(false);
    setNewPassword('');
    setConfirmPassword('');
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
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFindAccountOpen(true);
                        setFindStep('select');
                      }}
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      계정 찾기
                    </a>

                    {isFindAccountOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
                          <button
                            type="button"
                            onClick={handleCloseFindAccountModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
                          >
                            &times;
                          </button>

                          {findStep === 'select' && (
                            <>
                              <h2 className="text-lg font-semibold mb-6">계정 찾기</h2>
                              <div className="flex flex-col gap-4">
                                <button
                                  type="button"
                                  onClick={() => setFindStep('findId')}
                                  className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  아이디 찾기
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFindStep('findPw')}
                                  className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  비밀번호 찾기
                                </button>
                              </div>
                            </>
                          )}

                          {findStep === 'findId' && (
                            <>
                              <h2 className="text-lg font-semibold mb-4">아이디 찾기</h2>
                              <p className="mb-4 text-sm text-gray-600">가입 시 사용한 이름과 이메일을 입력하세요.</p>
                              <input
                                type="name"
                                id="findIdname"
                                onChange={(e) => setFindIdName(e.target.value)}
                                placeholder="이름"
                                className="w-full p-2 border rounded mb-4"
                              />                              
                              <input
                                type="email"
                                id="findIdEmail"
                                onChange={(e) => setFindIdEmail(e.target.value)}
                                placeholder="이메일"
                                className="w-full p-2 border rounded mb-4"
                              />
                              <button
                                type="button"
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
                                onClick={() => handleFindId()}
                              >
                                아이디 찾기
                              </button>
                              <button
                                type="button"
                                onClick={() => setFindStep('select')}
                                className="w-full p-2 border rounded text-sm text-gray-500"
                              >
                                돌아가기
                              </button>
                            </>
                          )}

                          {findStep === 'findPw' && (
                            <>
                              <h2 className="text-lg font-semibold mb-4">비밀번호 찾기</h2>
                              <p className="mb-4 text-sm text-gray-600">가입 시 사용한 아이디와 이메일을 입력하세요.</p>
                              <input
                                type="text"
                                id="findPwId"
                                onChange={(e) => setFindPwId(e.target.value)}
                                placeholder="아이디 입력"
                                className="w-full p-2 border rounded mb-2"
                              />
                              <input
                                type="email"
                                id="findPwEmail"
                                onChange={(e) => setFindPwEmail(e.target.value)}
                                placeholder="이메일 입력"
                                className="w-full p-2 border rounded mb-4"
                              />

                              {isPwVerifyStep && (
                                <div className="flex items-center gap-2 mb-4">
                                  <input
                                    type="text"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value)}
                                    placeholder="인증코드 입력"
                                    className="flex-1 p-2 border rounded"
                                  />
                                  <button
                                    type="button"
                                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => handleVerifyCode()}
                                  >
                                    확인
                                  </button>
                                </div>
                              )}

                              {!isPwVerifyStep && (
                                <button
                                  type="button"
                                  onClick={handleFindPw}
                                  disabled={isSendingPwEmail}
                                  className={`w-full p-2 rounded mb-2 ${
                                    isSendingPwEmail ? 'bg-gray-400 text-white' : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  {isSendingPwEmail ? '메일 발송 중...' : '비밀번호 재설정 메일 발송'}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setFindStep('select')}
                                className="w-full p-2 border rounded text-sm text-gray-500"
                              >
                                돌아가기
                              </button>
                            </>
                          )}

                          {findStep === 'resetPw' && (
                            <>
                              <h2 className="text-lg font-semibold mb-4">비밀번호 재설정</h2>
                              <input
                                type="password"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                              />
                              <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                              />
                              <button
                                type="button"
                                onClick={handleResetPassword}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                비밀번호 변경
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
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
