import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Calendar from '../../components/Calendar'; // Calendar 컴포넌트 import
import ScheduleModal from '../../components/ScheduleModal';  // 아까 만든 팝업 import
import { fetchSchedules, saveSchedule, getScheduleById } from '../../api/scheduleApi';

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
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
            />

            {modalOpen && (
                <ScheduleModal
                    userId={user.id}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedEvent(null);
                    }}
                    onSave={() => {
                        // 저장 후 일정 다시 불러오기
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
                        loadSchedules(); // 일정 갱신
                    }}
                    startDate={selectedDate}
                    initialData={selectedEvent} // ✅ 여기가 핵심!
                />
            )}
        </div>
    );
};


export default MainPage;