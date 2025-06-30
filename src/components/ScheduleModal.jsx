import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchSchedules, saveSchedule, getScheduleById, updateSchedule} from '../api/scheduleApi';

const ScheduleModal = ({ userId, onClose, onSave, startDate, initialData }) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        title: '',
        start_date: startDate || null,
        start_time: null,
        end_date: startDate || null,
        end_time: null,
        all_day: false,
        description: '',
        ...initialData // 초기값이 있으면 여기서 덮어씀
    });

    useEffect(() => {
        if (startDate) {
            setFormData((prev) => ({
                ...prev,
                start_date: startDate,
                end_date: startDate,
            }));
        }
    }, [startDate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title ) {
            alert('필수 항목을 입력하세요');
            return;
        }

        try {
            const scheduleData = {
                ...formData,
                user_id: userId    // user_id 추가
            };

        if (isEditMode) {
            // 수정일 경우
            const updated = await updateSchedule(formData.id, scheduleData);
            alert('일정 수정 완료');
            onSave(updated);
        } else {
            // 등록일 경우
            const saved = await saveSchedule(scheduleData);
            alert('일정 저장 완료');
            onSave(saved);
        }

            onClose();
        } catch (err) {
            console.error(err);
            alert(isEditMode ? '수정 실패' : '등록 실패');
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[95%] max-w-lg p-4 md:p-8 rounded-lg shadow-lg relative mx-auto">
            <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl">&times;</button>

                <div className="flex justify-center mb-8 mt-8 md:mt-0">
                    <div className="flex px-4 w-fit space-x-8">
                        <div className="flex flex-col items-center w-16">
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 text-sm bg-blue-500 border-blue-500 text-white">1</div>
                            <span className="text-sm text-center text-blue-600 font-semibold">일정 등록</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="일정 제목" value={formData.title}
                           onChange={handleChange} className="w-full p-2 border rounded mb-4" />

                    <label className="block mb-2 font-medium">시작일시</label>
                    <input type="date" name="start_date" value={formData.start_date}
                           onChange={handleChange} className="w-full p-2 border rounded mb-4" />

                    <label className="block mb-2 font-medium" >시작 시간 (선택)</label>
                    <input
                        type="time"
                        name="start_time"
                        value={formData.start_time || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <label className="block mb-2 font-medium">종료일시</label>
                    <input type="date" name="end_date" value={formData.end_date}
                           onChange={handleChange} className="w-full p-2 border rounded mb-4" />

                    <label className="block mb-2 font-medium">종료 시간 (선택)</label>
                    <input
                        type="time"
                        name="end_time"
                        value={formData.end_time || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <label className="inline-flex items-center mb-4">
                        <input type="checkbox" name="all_day" checked={formData.all_day} onChange={handleChange} className="mr-2" />
                        종일 일정
                    </label>

                    <textarea name="description" placeholder="일정 설명" value={formData.description}
                              onChange={handleChange} className="w-full p-2 border rounded mb-4 h-24" />

                    <div className="flex justify-end md:justify-end pt-6">
                        <button type="submit" className="px-5 py-3 w-full md:w-auto rounded bg-green-500 text-white hover:bg-green-600 font-medium">
                            {isEditMode ? '수정하기' : '등록하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ScheduleModal;
