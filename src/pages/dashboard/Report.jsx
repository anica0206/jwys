import React from 'react';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';
import WeeklyCalendar from '../../components/calendar/WeeklyCalendar';
import { useNavigate } from 'react-router-dom';

const Report = () => {
    const { user } = useUser();
    const [allEvents, setAllEvents] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [weeklyEvents, setWeeklyEvents] = useState([]);
    const navigate = useNavigate();

    const showCal = async () => {
        navigate('/main');
    }
  
    useEffect(() => {
        const events = [
            { id: 1, title: '회의', start_date: '2025-06-30', start_time: '10:00' },
            { id: 2, title: '친구들', start_date: '2025-07-02', start_time: '18:30' },
            { id: 3, title: '요가', start_date: '2025-07-03', start_time: '19:00' },
            { id: 4, title: '수영', start_date: '2025-07-04', start_time: '07:00' },
        ];
    
        setAllEvents(events);
    
        const todayStr = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        const today = events.filter(e => e.start_date === todayStr);
        setTodayEvents(today);
    
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 6);

        const toDate = (str) => {
            const [yyyy, mm, dd] = str.split('-').map(Number);
            return new Date(yyyy, mm - 1, dd);
        };

        const week = events
        .filter(e => {
          const d = toDate(e.start_date);
          return d >= start && d <= end;
        })
        .map(e => {
          const d = toDate(e.start_date);
          const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
          return {
            ...e,
            day: daysKor[d.getDay()],
          };
        });
        setWeeklyEvents(week);
    }, []);

    return (
        <div className="min-h-screen bg-[#fffaf3] p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">안녕하세요, {user?.name}님</h1>
        <button type="button" onClick={showCal}>전체 캘린더 보기</button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽: 캘린더 + 오늘 일정 */}
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
                        ✅ {e.start_time} - {e.title}
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
                    🔸 {e.day} - {e.title}
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