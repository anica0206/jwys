import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ events, onEventClick, onDateClick }) => {
    return (
        <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={onDateClick}
                eventClick={onEventClick}
                height="auto"
            />
        </div>
    );
};

export default Calendar;