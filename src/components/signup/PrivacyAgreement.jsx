import React, { useState } from 'react';

const privacyText = `
[개인정보 수집 및 이용 동의서]

1. 수집 항목
- 필수항목: 이름, 생년월일, 이메일, 휴대전화번호, 주소

2. 수집 목적
- 회원 가입 및 본인 확인
- 서비스 제공 및 회원 관리
- 고지사항 전달 및 민원 처리

3. 보유 및 이용 기간
- 회원 탈퇴 시까지 보관
- 단, 관련 법령에 따라 일정 기간 보관할 수 있음 (예: 전자상거래법 등)

4. 동의 거부 시 불이익
- 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 이 경우 회원가입이 제한됩니다.

본인은 상기 내용을 충분히 숙지하였으며, 개인정보 수집 및 이용에 동의합니다.
`;

const PrivacyAgreement = ({ onAgree, onToggle }) => {
  return (
    <div className="border rounded p-4 bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold mb-2">개인정보 수집 및 이용 동의</h2>
      <div className="h-64 overflow-y-scroll text-sm whitespace-pre-wrap border p-3 bg-white mb-4">
        {privacyText}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full py-2 rounded font-semibold transition-colors ${
            onAgree
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {onAgree ? '동의 완료 (클릭 시 해제)' : '동의합니다'}
      </button>
    </div>
  );
};

export default PrivacyAgreement;