import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { signUp } from '../../api/signUpApi';
import { checkIdDuplicate } from '../../api/signUp/checkIdDuplicate';
import { checkEmailDuplicate } from '../../api/signUp/checkEmailDuplicate';
import { sendVerificationCode, verifyCode } from '../../api/verifyEmailApi';
import DaumPostcode from 'react-daum-postcode';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Signal } from "lucide-react";
import PrivacyAgreement from '../../components/signup/PrivacyAgreement';
import Marketing from '../../components/signup/Marketing';

const steps = [
  { id: 1, label: '약관 동의' },
  { id: 2, label: '계정 설정' },
  { id: 3, label: '이메일' },
  { id: 4, label: '개인 정보' },
  { id: 5, label: '연락처' },
  { id: 6, label: '마케팅' },
];

const SignupModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    birth: '',
    sex: '',
    nation: '0',
    phoneType: '',
    phone: '',
    address: '',
    addressDetail: '',
    postalCode: '',
    emailAd: '',
    smsAd: '',
  });

  const [agreedPrivacy, setAgreedPrivacy] = useState(false);  // 약관 동의
  const [idChecked, setIdChecked] = useState(null);
  const [checkingId, setCheckingId] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [isPhoneTypeOpen, setIsPhoneTypeOpen] = useState(false); // 통신사
  const [isPostOpen, setIsPostOpen] = useState(false); // 주소 검색
  const [isVerifyStep, setIsVerifyStep] = useState(false);

  const idRegex = /^[a-z][a-z0-9]{5,}$/; // 아이디 규칙
  const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`{}[\]:;"'<>,.?/\\|=.-]).{10,}$/; // 비밀번호 규칙

  const phoneTypeOptions = [
    { label: 'SKT', value: '0' },
    { label: 'SKT 알뜰폰', value: '1' },
    { label: 'KT', value: '2' },
    { label: 'KT 알뜰폰', value: '3' },
    { label: 'LG U+', value: '4' },
    { label: 'LG U+ 알뜰폰', value: '5' },
  ];
  
  const selectedPhoneTypeLabel = phoneTypeOptions.find(item => item.value === formData.phoneType)?.label || '통신사 선택';
  

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidBirth = (birth) => /^\d{8}$/.test(birth);
  const isValidPhone = (phone) => {
    return phone.length === 11;
  };

  const isStepValid = () => {
    if (step === 1) return agreedPrivacy;
    if (step === 2) return formData.id && idChecked && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    if (step === 3) return formData.email && isValidEmail(formData.email) && emailVerified;
    if (step === 4) return formData.name && formData.birth && isValidBirth(formData.birth) && formData.sex && formData.nation;
    if (step === 5) return formData.phoneType && formData.phone && isValidPhone(formData.phone) && formData.address && formData.addressDetail && formData.postalCode;
    if (step === 6) return formData.emailAd !== '' && formData.smsAd !== '';
    return false;
  };

  const handleCheckId = async () => {
    if (!formData.id.trim())
      return Swal.fire({
                icon: 'warning',
                title: '',
                text: '아이디를 입력하세요.',
                confirmButtonText: '확인',
              });

    if (!idRegex.test(formData.id.trim())) {
      setCheckingId(false);
      return Swal.fire({
        icon: 'error',
        title: '',
        text: '영소문자로 시작하는 6자리 이상이어야 하며, 특수문자 사용은 불가능합니다.',
        confirmButtonText: '확인',
      });
    }

    setCheckingId(true);

    try {
      const available = await checkIdDuplicate(formData.id.trim());
      setIdChecked(available);
    } catch {
        Swal.fire({
          icon: 'error',
          title: '중복 확인 중 오류 발생',
          text: '관리자에게 문의하세요.',
          confirmButtonText: '확인',
        });
    } finally { setCheckingId(false); }
  };

  const sendVerificationCodeHandler = async () => {
    const email = formData.email.trim();

    if (!isValidEmail(email)) {
      return Swal.fire({
        icon: 'warning',
        title: '',
        text: '유효한 이메일을 입력하세요.',
        confirmButtonText: '확인',
      });
    }
    setSendingCode(true);
    try {
      // 이메일 중복 확인
      const isDuplicate = await checkEmailDuplicate(email);
      if (!isDuplicate) {
        return Swal.fire({
          icon: 'error',
          title: '',
          text: '이미 가입된 이메일입니다.',
          confirmButtonText: '확인',
        });
      }

      await sendVerificationCode(email);
      Swal.fire({
        icon: 'success',
        title: '',
        text: '인증번호가 발송되었습니다.',
        confirmButtonText: '확인',
      });
      setEmailLocked(true);
      setIsVerifyStep(true);
    } catch (error) {
        console.error('인증번호 발송 오류:', error);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
        Swal.fire({
          icon: 'error',
          title: '인증번호 발송 실패',
          text: '관리자에게 문의하세요.',
          confirmButtonText: '확인',
        });
    } finally { setSendingCode(false); }
  };

  const verifyCodeHandler = async () => {
    try {
      const res = await verifyCode(formData.email, inputCode);
      if (res.message === '이메일 인증 성공') {
        setEmailVerified(true);
        Swal.fire({
          icon: 'success',
          title: '',
          text: '메일이 인증되었습니다.',
          confirmButtonText: '확인',
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: '',
        text: '인증 실패!',
        confirmButtonText: '확인',
      });
    }
  };

  const formatBirthInput = (value) => {
    // 숫자만 남기기
    const numbers = value.replace(/\D/g, '');
  
    let year = numbers.slice(0, 4);
    let month = numbers.slice(4, 6);
    let day = numbers.slice(6, 8);
  
    // 포맷팅
    let result = year;
    if (month) result += '.' + month;
    if (day) result += '.' + day;
  
    return result;
  };

  const formatPhoneInput = (value) => {
    const numbers = value.replace(/\D/g, '');
  
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleAddress = (data) => {
    const fullAddress = data.address;
    const extraAddress = data.addressType === 'R' ? (data.bname ? data.bname : '') : '';
    const zoneCode = data.zonecode;
  
    const finalAddress = fullAddress + (extraAddress ? ` (${extraAddress})` : '');
  
    setFormData({
      ...formData,
      address: finalAddress,
      postalCode: zoneCode
    });
  
    setIsPostOpen(false);
  };
  
  const toggleMarketingConsent = (type) => {
    const key = type === 'email' ? 'emailAd' : 'smsAd';
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : 0, // 0: 체크, 1: 체크 x
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await signUp(formData.id, formData.password, formData.email, formData.name, formData.birth, formData.sex, formData.nation,
                   formData.phoneType, formData.phone, formData.address, formData.addressDetail, formData.postalCode, formData.emailAd, formData.smsAd);
      Swal.fire({
        icon: 'success',
        title: '회원가입 완료!',
        text: `${formData.name}님, 환영합니다.`,
        confirmButtonText: '확인',
      });
      onClose();
    } catch {
      Swal.fire({
        icon: 'error',
        title: '회원가입 실패',
        text: '관리자에게 문의하세요.',
        confirmButtonText: '확인',
      });
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <PrivacyAgreement
            onAgree={agreedPrivacy}
            onToggle={() => setAgreedPrivacy(prev => !prev)}
          />
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input type="text" name="id" placeholder="아이디" value={formData.id}
              onChange={(e) => { handleChange(e); setIdChecked(null); }}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={handleCheckId} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">중복 확인</button>
          </div>
          {idChecked === true && <p className="text-green-600 text-sm">사용 가능</p>}
          {idChecked === false && <p className="text-red-600 text-sm">사용 중인 아이디입니다.</p>}
          
          <input type="password" name="password" placeholder="비밀번호" value={formData.password}
            onChange={handleChange} className="w-full p-2 border rounded mb-4" />
          {formData.password && !passwordRegex.test(formData.password) && (
            <p className="text-red-500 text-sm mb-2">
              비밀번호는 영소문자, 숫자, 특수문자를 포함해 10자리 이상이어야 합니다.
            </p>
          )}
          <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword}
            onChange={handleChange} className="w-full p-2 border rounded mb-4" />
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              disabled={emailLocked}
              onChange={(e) => {
                handleChange(e);
                setEmailVerified(false);
              }}
              className="flex-grow p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500"
            />
            {!isVerifyStep && (
              <button
                type="button"
                onClick={sendVerificationCodeHandler}
                disabled={sendingCode}
                className={`w-32 p-2 rounded ${
                  sendingCode ? 'bg-gray-400 text-white' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {sendingCode ? '메일 발송 중...' : '인증번호 전송'}
              </button>
            )}
          </div>
          {!emailVerified && isVerifyStep && (
            <div className="flex items-center gap-2 mb-4">
              <input type="text" inputMode="numeric" placeholder="인증번호 입력" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="flex-1 p-2 border rounded" />
              <button type="button" onClick={verifyCodeHandler} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">인증 확인</button>
            </div>
          )}
          {emailVerified && <p className="text-green-600 text-sm mb-4">이메일 인증 완료</p>}
        </>
      );
    }
    if (step === 4) {
      return (
        <>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              inputMode="numeric"
              name="birth"
              placeholder="생년월일 8자리"
              value={formatBirthInput(formData.birth)}
              maxLength={10} // YYYY.MM.DD 10글자 제한
              onChange={(e) => {
                // 입력 시 숫자만 저장 (DB 저장용, formData 용)
                const onlyNumber = e.target.value.replace(/\D/g, '').slice(0, 8); // 최대 8자리
                handleChange({ target: { name: 'birth', value: onlyNumber } });
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 p-2 border rounded text-sm transition-colors
                ${formData.sex === '0' 
                  ? 'border-yellow-500 text-yellow-600 font-semibold' 
                  : 'border-gray-300 text-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'sex', value: '0' } })}
              >
                남자
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded text-sm transition-colors
                ${formData.sex === '1' 
                  ? 'border-yellow-500 text-yellow-600 font-semibold' 
                  : 'border-gray-300 text-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'sex', value: '1' } })}
              >
                여자
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 p-2 border rounded text-sm transition-colors
                ${formData.nation === '0' 
                  ? 'border-yellow-500 text-yellow-600 font-semibold' 
                  : 'border-gray-300 text-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'nation', value: '0' } })}
              >
                내국인
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded text-sm transition-colors
                ${formData.nation === '1' 
                  ? 'border-yellow-500 text-yellow-600 font-semibold' 
                  : 'border-gray-300 text-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'nation', value: '1' } })}
              >
                외국인
              </button>
            </div>
          </div>      
        </>
      );
    }
    if (step === 5) {
      return (
        <>
          {/* 통신사 선택 */}
          <div className="mb-4 relative">
            <button
              type="button"
              onClick={() => setIsPhoneTypeOpen((prev) => !prev)}
              className={`w-full p-2 border rounded text-left flex justify-between items-center ${
                formData.phoneType ? 'text-black' : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-gray-500" />
                <span>{selectedPhoneTypeLabel}</span>
              </div>
              <svg
                className={`ml-2 w-4 h-4 text-gray-500 transform transition-transform duration-300 ${
                  isPhoneTypeOpen ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isPhoneTypeOpen && (
              <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow p-2">
                <div className="grid grid-cols-2 gap-2">
                  {phoneTypeOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        handleChange({ target: { name: 'phoneType', value: item.value } });
                        setIsPhoneTypeOpen(false);
                      }}
                      className={`p-2 border rounded text-sm transition-colors
                        ${formData.phoneType === item.value
                          ? 'border-yellow-500 text-yellow-600 font-semibold'
                          : 'border-gray-300 text-gray-400'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <input
              type="tel"
              name="phone"
              placeholder="핸드폰 번호"
              value={formatPhoneInput(formData.phone)}
              maxLength={13} // 010-1234-5678 : 최대 13글자
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, '').slice(0, 11); // 최대 11자리
                handleChange({ target: { name: 'phone', value: onlyNumber } });
              }}
              className="w-full p-2 border rounded mb-4"
            />    
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsPostOpen(true)}
              className="w-full p-2 border rounded text-left"
            >
              {formData.address ? formData.address : '주소 검색'}
            </button>

            {isPostOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white border rounded shadow p-4 w-full max-w-md mx-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">주소 검색</h3>
                    <button
                      type="button"
                      onClick={() => setIsPostOpen(false)}
                      className="text-gray-400 hover:text-black text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                  <DaumPostcode onComplete={handleAddress} />
                </div>
              </div>
            )}
          </div>

          {formData.address && (
            <div className="mb-4">
              <input
                type="text"
                name="addressDetail"
                placeholder="상세주소 입력"
                value={formData.addressDetail || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              />
            </div>
          )}
        </>
      );
    }
    if(step === 6) {
      return (
        <Marketing
          emailAd={formData.emailAd}
          smsAd={formData.smsAd}
          onChange={(key, value) =>
            setFormData((prev) => ({ ...prev, [key]: value }))
          }
        />
      );
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl">&times;</button>

        <div className="flex justify-center mb-8 mt-8 md:mt-0">
          {/* Stepper 보기 영역 */}
          <div className="w-full max-w-md overflow-hidden">
            <div
              className="transition-transform duration-500"
              style={{
                transform: `translateX(calc(50% - ${(step - 1) * 96 + 48}px))`,
              }}
            >
              <div className="flex px-4 w-fit space-x-8">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center w-16 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 text-sm
                        ${s.id === step
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'}`}
                    >
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
        </div>

        <form className="space-y-4">
          {renderStepContent()}
          <div className="flex justify-between pt-6">
            {step > 1 && <button type="button" onClick={prevStep} className="px-5 py-3 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium">이전</button>}
            {step < steps.length ? (
              <button type="button" onClick={nextStep} disabled={!isStepValid()} className={`px-5 py-3 rounded ml-auto font-medium ${isStepValid() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>다음</button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`px-5 py-3 rounded ml-auto font-medium ${
                  isStepValid() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                가입하기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SignupModal;
