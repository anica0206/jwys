import React from 'react';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

const WeeklyCalendar = () => {
  const today = new Date();

  // 이번 주 일요일 찾기 (주 시작)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // 7일 배열 만들기
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      date,
      isToday:
        date.toDateString() === today.toDateString()
    };
  });

  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {week.map((d, i) => (
        <div
          key={i}
          className={`rounded-lg py-2 text-sm font-semibold 
            ${d.isToday ? 'bg-yellow-300 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          <div className="text-xs mb-1">{daysKor[d.date.getDay()]}</div>
          <div>{d.date.getDate()}</div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;