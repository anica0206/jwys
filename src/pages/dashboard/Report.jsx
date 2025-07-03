import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { fetchSchedules } from '../../api/scheduleApi';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from '../../components/calendar/WeeklyCalendar';

const Report = () => {
  const { user } = useUser();
  const [allEvents, setAllEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const navigate = useNavigate();

  const showCal = () => {
    navigate('/main');
  };

  // 날짜만 추출 (YYYY-MM-DD)
  const getDateOnly = (isoString) => {
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // 날짜 객체로 변환 (시간 제거)
  const toLocalDate = (isoString) => {
    const d = new Date(isoString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;

      const events = await fetchSchedules(user.id);
      console.log(events);
      setAllEvents(events);

      const todayStr = getDateOnly(new Date());
      const today = events.filter(e => getDateOnly(e.start_date) === todayStr);
      setTodayEvents(today);

      const start = new Date(); // 오늘
      const end = new Date();
      end.setDate(start.getDate() + 6); // 6일 뒤까지 포함

      const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

      const week = events
        .filter(e => {
          const d = toLocalDate(e.start_date);
          return d >= toLocalDate(start) && d <= toLocalDate(end);
        })
        .map(e => {
          const d = new Date(e.start_date);
          return {
            ...e,
            day: daysKor[d.getDay()],
            dateStr: getDateOnly(e.start_date),
            timeStr: e.start_time?.slice(0, 5) || '',
          };
        });

      setWeeklyEvents(week);
    };

    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#fffaf3] p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        안녕하세요, {user?.name}님
      </h1>
      <button type="button" onClick={showCal} className="mb-6 text-blue-600 underline">
        전체 캘린더 보기
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽: 주간 캘린더 + 오늘 일정 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📅 이번 주 캘린더</h2>
            <WeeklyCalendar />
          </div>

          <div className="bg-yellow-100 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">🟡 오늘 할 일</h2>
            {todayEvents.length ? (
              <ul className="space-y-1">
                {todayEvents.map((e) => (
                  <li key={e.id} className="text-sm text-gray-800">
                    ✅ {e.start_time?.slice(0, 5)} - {e.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">오늘은 할 일이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 오른쪽: 주간 일정 */}
        <div className="bg-blue-50 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">📘 이번 주 일정</h2>
          {weeklyEvents.length ? (
            <ul className="space-y-2">
              {weeklyEvents.map((e) => (
                <li key={e.id} className="text-sm text-gray-700">
                  🔸 {e.day} {e.start_time ? e.start_time.slice(0, 5) : '시간 미정'} - {e.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">예정된 일정이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;