import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Calendar from '../../components/Calendar'; // Calendar 컴포넌트 import
import { Menu } from 'lucide-react'; // 햄버거 메뉴 아이콘
import { ChevronLeft } from 'lucide-react';

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

    const [sidebarOpen, setSidebarOpen] = useState(false);

    console.log('sidebarOpen 상태:', sidebarOpen);

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
        <div className="relative min-h-screen flex bg-gray-100">
            {/* 사이드바 */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="font-bold text-lg">메뉴</div>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </div>
                <ul className="p-4 space-y-2">
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">캘린더 추가</li>
                    {/* <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">내 정보</li> */}
                </ul>
            </div>

            {/* 오버레이 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 본문 영역 */}
            <div className="flex-1 flex flex-col p-4 sm:p-8 w-full">
                <div className="flex items-center mb-4">
                    <button
                        type="button"
                        className="text-gray-700 focus:outline-none mr-4"
                        onClick={() => {
                            console.log('햄버거 버튼 클릭됨');
                            setSidebarOpen(true);
                        }}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-1">메인 페이지</h1>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
                    안녕하세요, {user?.name || '사용자'}님
                </h2>

                <div className="w-full max-w-screen-xl self-center">
                    <Calendar
                        events={events}
                        onDateClick={handleDateClick}
                        onEventClick={handleEventClick}
                    />
                </div>
            </div>
        </div>
    );
};


export default MainPage;