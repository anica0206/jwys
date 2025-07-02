import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Calendar from '../../components/Calendar'; // Calendar 컴포넌트 import
import ScheduleModal from '../../components/ScheduleModal';  // 아까 만든 팝업 import
import { fetchSchedules, saveSchedule, getScheduleById } from '../../api/scheduleApi';
import { Menu } from 'lucide-react'; // 햄버거 메뉴 아이콘
import { ChevronLeft } from 'lucide-react';

const MainPage = () => {
    const { user } = useUser();

    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // 한국시간
    const toLocalDateString = (utcDateStr) => {
        if (!utcDateStr) return '';
        const date = new Date(utcDateStr);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                const data = await fetchSchedules(user.id);  // user.id를 제대로 넘겨줘야 함

                const mapped = data.map(e => {
                    const hasTime = e.start_time && e.end_time;

                    return {
                        id: e.id,
                        title: e.title,
                        start: hasTime
                            ? `${e.start_date}T${e.start_time}`
                            : e.start_date,
                        end: hasTime
                            ? `${e.end_date}T${e.end_time}`
                            : e.end_date,
                        allDay: !hasTime || e.all_day === true,
                    };
                });

                setEvents(mapped);
            } catch (err) {
                console.error('일정 조회 실패', err);
            }
        };

        if (user?.id) {
            loadSchedules();
        }
    }, [user?.id]);

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr); // 날짜 저장
        setModalOpen(true); // 모달 열기
    };

    const handleEventClick = async (info) => {
        try {
            const eventId = info.event.id;
            const data = await getScheduleById(eventId); // ← axios 함수 사용

            console.log(data)
            const clickedEvent = {
                id: data.id,
                title: data.title,
                start_date: toLocalDateString(data.start_date)?.slice(0, 10),  // ← 시간 제거
                start_time: data.start_time || null,
                end_date: toLocalDateString(data.start_date)?.slice(0, 10),
                end_time: data.end_time || null,
                all_day: data.all_day,
                description: data.description || '',
            };

            setSelectedEvent(clickedEvent);
            setModalOpen(true);
        } catch (err) {
            console.error('일정 상세 조회 실패:', err);
            alert('일정을 불러오는 데 실패했습니다.');
        }
    };

    return (
        <div className="relative min-h-screen flex bg-gray-100">
            {/* 👉 사이드바 */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="font-bold text-lg">메뉴</div>
                    <button
                        type="button"
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </div>
                <ul className="p-4 space-y-2">
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">일정 추가</li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">내 정보</li>
                </ul>
            </div>
        
            {/* 👉 오버레이 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        
            {/* 👉 본문 */}
            <div className="flex-1 flex flex-col p-4 sm:p-8 w-full items-center">
                {/* 햄버거 메뉴 */}
                <div className="w-full flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-700 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-1 -ml-6">메인 페이지</h1>
                </div>
        
                {/* 달력 */}
                <Calendar
                    events={events}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />
        
                {/* 모달 */}
                {modalOpen && (
                    <ScheduleModal
                        userId={user.id}
                        onClose={() => {
                            setModalOpen(false);
                            setSelectedEvent(null);
                        }}
                        onSave={() => {
                            const loadSchedules = async () => {
                                try {
                                    const data = await fetchSchedules(user.id);
                                    const mapped = data.map(e => {
                                        const hasTime = e.start_time && e.end_time;
                                        return {
                                            id: e.id,
                                            title: e.title,
                                            start: hasTime ? `${e.start_date}T${e.start_time}` : e.start_date,
                                            end: hasTime ? `${e.end_date}T${e.end_time}` : e.end_date,
                                            allDay: !hasTime || e.all_day === true,
                                        };
                                    });
                                    setEvents(mapped);
                                } catch (err) {
                                    console.error('일정 조회 실패', err);
                                }
                            };
                            loadSchedules();
                        }}
                        startDate={selectedDate}
                        initialData={selectedEvent}
                    />
                )}
            </div>
        </div>        
    );
};

export default MainPage;