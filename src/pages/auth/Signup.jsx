import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { signUp } from '../../api/signUpApi';
import { checkIdDuplicate } from '../../api/signUp/checkIdDuplicate';
import { sendVerificationCode, verifyCode } from '../../api/verifyEmailApi';

const steps = [
  { id: 1, label: '기본 정보' },
  { id: 2, label: '연락처' },
  { id: 3, label: '비밀번호 설정' },
];

const SignupModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [idChecked, setIdChecked] = useState(null);
  const [checkingId, setCheckingId] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStepValid = () => {
    if (step === 1) return formData.id && idChecked && formData.email && isValidEmail(formData.email) && emailVerified;
    if (step === 2) return formData.phone.trim() !== '';
    if (step === 3) return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    return false;
  };

  const handleCheckId = async () => {
    if (!formData.id.trim()) return alert("아이디를 입력하세요.");
    setCheckingId(true);
    try {
      const available = await checkIdDuplicate(formData.id);
      setIdChecked(available);
    } catch {
      alert("중복 확인 중 오류 발생");
    } finally { setCheckingId(false); }
  };

  const sendVerificationCodeHandler = async () => {
    if (!isValidEmail(formData.email)) {
      alert("유효한 이메일을 입력하세요.");
      return;
    }
    setSendingCode(true);
    try {
      await sendVerificationCode(formData.email);
      alert("인증번호가 발송되었습니다.");
    } catch {
      alert("인증번호 발송 실패");
    } finally { setSendingCode(false); }
  };

  const verifyCodeHandler = async () => {
    try {
      const res = await verifyCode(formData.email, inputCode);
      if (res.message === '이메일 인증 성공') {
        setEmailVerified(true);
        alert("이메일 인증 완료");
      }
    } catch {
      alert("인증 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(formData.id, formData.email, formData.password);
      alert('회원가입이 완료되었습니다.');
      onClose();
    } catch {
      alert('회원가입 실패');
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input type="text" name="id" placeholder="아이디" value={formData.id}
              onChange={(e) => { handleChange(e); setIdChecked(null); }}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={handleCheckId} disabled={checkingId} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">중복 확인</button>
          </div>
          {idChecked === true && <p className="text-green-600 text-sm">사용 가능</p>}
          {idChecked === false && <p className="text-red-600 text-sm">이미 사용 중</p>}
          <div className="flex items-center gap-2 mb-4">
            <input type="email" name="email" placeholder="이메일" value={formData.email}
              onChange={(e) => { handleChange(e); setEmailVerified(false); }}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={sendVerificationCodeHandler} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">인증번호 전송</button>
          </div>
          {!emailVerified && (
            <div className="flex items-center gap-2 mb-4">
              <input type="text" placeholder="인증번호 입력" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="flex-1 p-2 border rounded" />
              <button type="button" onClick={verifyCodeHandler} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">인증 확인</button>
            </div>
          )}
          {emailVerified && <p className="text-green-600 text-sm mb-4">이메일 인증 완료</p>}
        </>
      );
    }
    if (step === 2) {
      return (
        <input type="tel" name="phone" placeholder="전화번호" value={formData.phone}
          onChange={handleChange} className="w-full p-2 border rounded mb-4" />
      );
    }
    if (step === 3) {
      return (
        <>
          <input type="password" name="password" placeholder="비밀번호" value={formData.password}
            onChange={handleChange} className="w-full p-2 border rounded mb-4" />
          <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword}
            onChange={handleChange} className="w-full p-2 border rounded mb-4" />
        </>
      );
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl">&times;</button>

        <div className="flex justify-center mb-8 mt-8 md:mt-0">
          <div className="transition-transform duration-500"
            style={{
              transform: `translateX(calc(50% - ${(step - 1) * 96 + 48}px))`,
            }}>
            <div className="flex px-4 w-fit space-x-8">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center w-16">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 text-sm
                      ${s.id === step
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'}`}>
                    {s.id}
                  </div>
                  <span className={`text-sm text-center ${s.id === step ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}
          <div className="flex justify-between pt-6">
            {step > 1 && <button type="button" onClick={prevStep} className="px-5 py-3 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium">이전</button>}
            {step < steps.length ? (
              <button type="button" onClick={nextStep} disabled={!isStepValid()} className={`px-5 py-3 rounded ml-auto font-medium ${isStepValid() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>다음</button>
            ) : (
              <button type="submit" disabled={!isStepValid()} className={`px-5 py-3 rounded ml-auto font-medium ${isStepValid() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>가입하기</button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SignupModal;
