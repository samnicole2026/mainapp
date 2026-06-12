import React from 'react';
import { CalendarEvent } from '../../types';

interface YearlyViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (monthIndex: number) => void;
}

const YearlyView: React.FC<YearlyViewProps> = ({
  currentDate,
  events,
  onMonthClick,
}) => {
  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  const getMonthCalendar = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 35) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForMonth = (monthIndex: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === year && eventDate.getMonth() === monthIndex;
    });
  };

  const hasEventsOnDay = (day: Date, monthIndex: number) => {
    if (day.getMonth() !== monthIndex) return false;
    return events.some(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {months.map((monthIndex) => {
          const monthName = new Date(year, monthIndex).toLocaleDateString('en-US', {
            month: 'long',
          });
          const days = getMonthCalendar(monthIndex);
          const monthEvents = getEventsForMonth(monthIndex);

          return (
            <div
              key={monthIndex}
              className="glass-card rounded-xl p-3 cursor-pointer hover:bg-white hover:bg-opacity-20 transition-colors"
              onClick={() => onMonthClick(monthIndex)}
            >
              <h4 className="text-sm font-bold text-black mb-2 text-center">
                {monthName}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div
                    key={i}
                    className="text-xs text-center text-black opacity-60 font-semibold"
                  >
                    {day}
                  </div>
                ))}
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`text-xs text-center p-1 rounded ${
                      day.getMonth() !== monthIndex
                        ? 'text-black opacity-20'
                        : hasEventsOnDay(day, monthIndex)
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-black'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                ))}
              </div>
              {monthEvents.length > 0 && (
                <div className="mt-2 text-xs text-black text-center font-semibold">
                  {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyView;
