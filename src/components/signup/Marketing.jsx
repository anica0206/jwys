import { Check } from 'lucide-react'; // 체크 아이콘

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm">
      <div
        className={`w-5 h-5 flex items-center justify-center border rounded transition-all
          ${checked ? 'bg-yellow-400 border-yellow-500' : 'bg-white border-gray-300'}`}
        onClick={onChange}
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span>{label}</span>
    </label>
  );
};

const RadioConsentItem = ({ label, value, onChange }) => (
  <div className="mb-4">
    <p className="font-medium mb-2">{label}</p>
    <div className="flex gap-6 text-sm">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={label}
          value={0}
          checked={value === 0}
          onChange={() => onChange(0)}
          className="accent-yellow-500"
        />
        수신 동의
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={label}
          value={1}
          checked={value === 1}
          onChange={() => onChange(1)}
          className="accent-gray-400"
        />
        수신 미동의
      </label>
    </div>
  </div>
);

const MarketingConsentBox = ({ emailAd, smsAd, onChange }) => {
  return (
    <div className="border p-4 rounded bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold mb-4">[선택] 광고성 정보 수신 동의</h2>

      <div className="text-sm whitespace-pre-wrap bg-white border p-3 mb-6 h-48 overflow-y-scroll">
        {`당사는 이용자에게 최신 소식, 혜택, 이벤트 등의 광고성 정보를 이메일 또는 문자메시지를 통해 제공할 수 있습니다.

          ※ 아래의 내용을 반드시 확인해 주세요.

          1. 본 광고성 정보 수신 동의는 선택 사항이며, 동의하지 않더라도 서비스 이용에는 제한이 없습니다.
          2. 수신 동의는 언제든지 철회하실 수 있으며, 철회 방법은 마이페이지 또는 고객센터를 통해 안내받을 수 있습니다.
          3. 광고성 정보 수신 동의를 철회하실 경우, 이후 관련 소식 및 혜택 제공이 제한될 수 있습니다.`}
      </div>

      <RadioConsentItem
        label="이메일 수신 동의"
        value={emailAd}
        onChange={(val) => onChange('emailAd', val)}
      />
      <RadioConsentItem
        label="문자 수신 동의"
        value={smsAd}
        onChange={(val) => onChange('smsAd', val)}
      />
    </div>
  );
};

export default MarketingConsentBox;