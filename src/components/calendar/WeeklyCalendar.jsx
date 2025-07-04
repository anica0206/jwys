import React from 'react';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

const WeeklyCalendar = ({ selectedDate, onDateClick, events }) => {
  const today = new Date();

  // 이번 주 일요일 찾기 (주 시작)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // 7일 배열 만들기
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const hasEvent = events?.some(e =>
      new Date(e.start_date).toDateString() === date.toDateString()
    );

    const eventCount = events?.filter(e =>
      new Date(e.start_date).toDateString() === date.toDateString()
    ).length;

    return {
      date,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selectedDate && date.toDateString() === selectedDate.toDateString(),
      hasEvent,
      eventCount,
    };
  });

  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {week.map((d, i) => (
        <div key={i} className="flex flex-col items-center space-y-0.5">
          {/* 항상 높이를 차지하는 Today 영역 */}
          <div className="min-h-[14px] text-[10px] font-medium mb-0.5 text-red-600">
            {d.isToday ? 'Today' : '\u00A0' /* non-breaking space */}
          </div>

          <button
            type="button"
            onClick={() => onDateClick(d.date)}
            className={`
              flex flex-col items-center justify-center
              rounded-lg py-2 text-sm font-semibold w-full
              ${d.isToday ? 'bg-yellow-300 text-white' : 'bg-gray-100 text-gray-600'}
              ${d.isSelected ? 'border-2 border-blue-500' : 'border border-transparent'}
            `}
          >
            <div className="text-xs mb-1">{daysKor[d.date.getDay()]}</div>
            <div>{d.date.getDate()}</div>
            {d.hasEvent && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;