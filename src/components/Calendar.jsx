import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const Calendar = ({ events, onEventClick, onDateClick }) => {
    return (
    //   <div className="w-full max-w-4xl p-6 bg-[#fffaf3] rounded-2xl shadow-xl">
    <div className="w-full p-2 sm:p-4 md:p-6 bg-yellow-50 rounded-none sm:rounded-2xl shadow-sm sm:shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={onDateClick}
          eventClick={onEventClick}
          height="auto"
          dayCellContent={(args) => (
            <div className="w-full h-full flex items-center justify-center">
              {/* <div className="bg-[#fef5df] text-[#6f4e37] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"> */}
              <div className="bg-[#fef5df] text-[#6f4e37] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] sm:text-sm font-semibold">
                {args.date.getDate()}
              </div>
            </div>
          )}
        />
      </div>
    );
  };

export default Calendar;