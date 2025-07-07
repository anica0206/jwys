import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { fetchSchedules } from '../../api/scheduleApi';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from '../../components/calendar/WeeklyCalendar';
import '../../index.css'

const Report = () => {
  const { user } = useUser();
  const [allEvents, setAllEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const navigate = useNavigate();

  // WeeklyCalendar 컴포넌트 날짜 선택
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 지난 일정 보기
  const [showPast, setShowPast] = useState(false);

  // 오늘 일정 완료 체크
  const [checked, setChecked] = useState(false);

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

  // n주차 추출
  const getWeekOfMonth = (date = new Date()) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const firstDayWeekDay = firstDay.getDay(); // 0(일) ~ 6(토)
      const offsetDate = date.getDate() + firstDayWeekDay - 1;
      return Math.floor(offsetDate / 7) + 1;
  };

  // YYYY년 MM월 N주차
  const getWeekText = (date = new Date()) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = getWeekOfMonth(date);
      return `${year}년 ${month}월 ${week}주차`;
  };

  // 주간 범위 계산
  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // 일요일
  
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 토요일
  
    return { start, end };
  };

  // 요일별 그룹화
  const groupByDay = (events) => {
    const grouped = {};
  
    events.forEach((e) => {
      if (!grouped[e.day]) grouped[e.day] = [];
      grouped[e.day].push(e);
    });
  
    return Object.entries(grouped).sort((a, b) => {
      const dayOrder = ['일', '월', '화', '수', '목', '금', '토'];
      return dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]);
    });
  };

  // 요일, 시간대 구분
  const groupByDayAndTime = (events) => {
    const dayOrder = ['일', '월', '화', '수', '목', '금', '토'];
    const daysKor = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  
    const grouped = {};
  
    events.forEach((e) => {
      const date = new Date(e.start_date);
      const dayIndex = date.getDay();
      const dayName = daysKor[dayIndex];
  
      if (!grouped[dayName]) {
        grouped[dayName] = { 오전: [], 오후: [], 시간미정: [] };
      }
  
      if (!e.start_time) {
        grouped[dayName]['시간미정'].push(e);
      } else {
        const hour = parseInt(e.start_time.split(':')[0], 10);
        if (hour < 12) {
          grouped[dayName]['오전'].push(e);
        } else {
          grouped[dayName]['오후'].push(e);
        }
      }
    });
  
    // 요일 순서대로 정렬 (일 ~ 토)
    return Object.entries(grouped).sort(
      ([a], [b]) => dayOrder.indexOf(a[0][0]) - dayOrder.indexOf(b[0][0])
    );
  };

  const filtered = showPast
  ? weeklyEvents
  : weeklyEvents.filter(e =>
      toLocalDate(e.start_date) >= toLocalDate(new Date())
    );

  const grouped = groupByDayAndTime(filtered);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const filterEvents = (events, date) => {
    const today = events.filter(e =>
      isSameDate(new Date(e.start_date), date)
    );
    // const start = new Date(date);
    // const end = new Date(date);
    // end.setDate(start.getDate() + 6);
  
    const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
  
    const { start, end } = getWeekRange(selectedDate);

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
    })
    // 날짜 기준 정렬 (일~토 순서 유지됨)
    .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
  
    return { today, week };
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
  
      const events = await fetchSchedules(user.id);
      setAllEvents(events);
  
      const { today, week } = filterEvents(events, selectedDate);
      setTodayEvents(today);
      setWeeklyEvents(week);
    };
  
    load();
  }, [user?.id, selectedDate]);

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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📅 {getWeekText()}</h2>
            <WeeklyCalendar
              selectedDate={selectedDate}
              onDateClick={(date) => setSelectedDate(date)}
              events={allEvents}
            />
          </div>

          <div className="bg-yellow-50 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-bold text-yellow-700 mb-4">🟡 오늘 할 일</h2>
            {todayEvents.length ? (
              <ul className="space-y-3">
                {todayEvents.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-4 bg-white border border-yellow-200 rounded-lg px-4 py-3 hover:shadow-sm transition"
                  >
                    {/* 시간 */}
                    <div className="w-[60px] text-sm text-yellow-600 font-mono pt-0.5 text-center">
                      {e.start_time?.slice(0, 5) || '시간 미정'}
                    </div>

                    {/* 제목 + 설명 (수평 배치) */}
                    <div className="flex flex-1 items-center gap-4">
                      <div className="text-[15px] text-gray-800 font-semibold truncate">
                        {e.title}
                      </div>
                      {e.description && (
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          {e.description}
                        </div>
                      )}
                    </div>

                    {/* 체크박스 */}
                    <label className="relative w-6 h-6 inline-block cursor-pointer">
                      {/* 숨긴 체크박스 */}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                        className="peer sr-only"
                      />

                      {/* 테두리 - 체크되면 숨김 */}
                      <div className="absolute inset-0 rounded-md border-2 border-yellow-500 peer-checked:hidden"></div>

                      {/* 체크 아이콘 - 체크 시만 표시 */}
                      <svg
                        className="absolute top-0 left-0 w-6 h-6 text-yellow-500 hidden peer-checked:block pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 13L9 17L19 7"
                          className="stroke-current stroke-[3]"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-blue-800">📘 이번 주 일정</h2>
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm text-gray-600">지난 일정 보기</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showPast}
                  onChange={() => setShowPast(prev => !prev)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          {grouped.length ? (
            <div className="space-y-6">
              {grouped.map(([day, times]) => (
                <div key={day} className="bg-[#fffaf0] rounded-xl px-4 py-3">
                  <h2 className="text-base font-wanted text-blue-700 mb-3">{day}</h2>
                  {['오전', '오후', '시간미정'].map((period) => (
                    times[period]?.length > 0 && (
                      <div key={period} className="mb-4">
                        <h3 className="text-sm font-wanted text-gray-500 mb-1">{period}</h3>
                        <ul className="divide-y divide-gray-200">
                          {times[period].map((e) => (
                            <li
                              key={e.id}
                              className="py-3 grid grid-cols-[60px_120px_1fr] gap-x-4 items-start"
                            >
                              <span className="text-[13px] text-slate-600 font-wanted tracking-tight text-center">
                                {e.timeStr || ''}
                              </span>
                              <span className="text-[15px] text-slate-800 font-wanted leading-tight">
                                {e.title}
                              </span>
                              <span className="text-[14px] text-slate-500 font-wanted leading-snug">
                                {e.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">예정된 일정이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;