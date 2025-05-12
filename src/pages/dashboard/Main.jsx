import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Calendar from '../../components/Calendar'; // Calendar 컴포넌트 import

const MainPage = () => {
    const { user } = useUser();

    // 더미 일정 데이터
    const [events, setEvents] = useState([
        {
            id: '1',
            title: '회의',
            start: '2025-05-13',
            end: '2025-05-13',
        },
        {
            id: '2',
            title: '출근',
            start: '2025-05-14',
            end: '2025-05-14',
        },
    ]);

    const handleDateClick = (info) => {
        const title = prompt('일정 제목을 입력하세요:');
        if (title) {
            const newEvent = {
                id: String(events.length + 1),
                title,
                start: info.dateStr,
                end: info.dateStr,
            };
            setEvents([...events, newEvent]);
        }
    };

    const handleEventClick = (info) => {
        if (window.confirm(`"${info.event.title}" 일정을 삭제할까요?`)) {
            setEvents(events.filter((e) => e.id !== info.event.id));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 shadow-md mb-4 text-center">
                메인 페이지
            </h1>
            <h2 className="text-3xl font-semibold text-gray-900 shadow-lg mb-8 text-center">
                안녕하세요, {user?.name || '사용자'}님
            </h2>

            <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
            />
        </div>
    );
};


export default MainPage;