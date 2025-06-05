import React from 'react';
import { useState } from "react";
import { signUp } from '../../api/signUpApi';

const steps = [
  { id: 1, label: '기본 정보' },
  { id: 2, label: '연락처' },
  { id: 3, label: '비밀번호 설정' },
];

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {setStep((prev) => Math.min(prev + 1, steps.length)); console.log(formData);}
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // const handleSubmit = async(e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await signUp(formData.id, formData.email, formData.password);
  //     console.log('회원가입 성공', res.data);
  //   } catch (err) {
  //       console.error('로그인 실패:', err.res.data.message);
  //   }
  // };
  const handleSubmit = async() => {
    try {
      const res = await signUp(formData.id, formData.email, formData.password);
      console.log('회원가입 성공', res.data);
    } catch (err) {
        console.error('로그인 실패:', err.res.data.message);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <input
            type="text"
            name="id"
            placeholder="아이디"
            value={formData.id}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
        </>
      );
    } else if (step === 2) {
      return (
        <input
          type="tel"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />
      );
    } else if (step === 3) {
      return (
        <>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
        </>
      );
    }
  };

  const stepWidth = 100 / steps.length;
  const translateX = `-${(step - 1) * stepWidth}%`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left section with image and intro */}
      <div className="md:w-1/2 bg-cover bg-center text-white flex items-center justify-center p-10" style={{ backgroundImage: 'url(https://source.unsplash.com/800x600/?calendar)' }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center max-w-sm">
          <h2 className="text-3xl font-bold mb-4">캘린더로 삶을 더 계획적으로</h2>
          <p className="text-sm">
            우리의 스마트 캘린더 서비스는 당신의 시간을 정리하고 일상을 효율적으로 만들어줍니다. 지금 가입하고 새로운 시작을 경험하세요.
          </p>
        </div>
      </div>

      {/* Right section with form and stepper */}
      <div className="md:w-1/2 bg-white p-8 flex flex-col h-screen">
        <div className="flex-1 flex flex-col justify-start md:justify-center">
          <div className="flex justify-center mb-8 mt-4 md:mt-0">
            <div
              className="transition-transform duration-500"
              style={{
                transform: `translateX(calc(50% - ${(step - 1) * 96 + 48}px))`,
              }}
            >
              <div className="flex px-4 w-fit space-x-8">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center w-16">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 text-sm
                        ${s.id === step
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'}`}
                    >
                      {s.id}
                    </div>
                    <span
                      className={`text-sm text-center
                        ${s.id === step ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  이전
                </button>
              )}
              {step < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ml-auto"
                >
                  다음
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 ml-auto"
                >
                  가입하기
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;