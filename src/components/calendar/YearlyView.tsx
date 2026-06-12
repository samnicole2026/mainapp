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

  const getEventsForMonth = (monthIndex: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getMonth() === monthIndex &&
        eventDate.getFullYear() === year
      );
    });
  };

  const getDaysInMonth = (monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (monthIndex: number) => {
    return new Date(year, monthIndex, 1).getDay();
  };

  const renderMiniMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex);
    const firstDay = getFirstDayOfMonth(monthIndex);
    const monthEvents = getEventsForMonth(monthIndex);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const hasEventOnDay = (day: number) => {
      return monthEvents.some(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === day;
      });
    };

    return (
      <div
        className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:shadow-lg transition-all hover:border-purple-300"
        onClick={() => onMonthClick(monthIndex)}
      >
        <div className="text-center font-semibold text-gray-900 mb-2">
          {new Date(year, monthIndex).toLocaleDateString('en-US', { month: 'long' })}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`text-center text-xs py-1 ${
                day === null
                  ? ''
                  : hasEventOnDay(day)
                  ? 'bg-purple-100 text-purple-700 font-semibold rounded'
                  : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600 text-center">
          {monthEvents.length} {monthEvents.length === 1 ? 'event' : 'events'}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
        {months.map(month => (
          <div key={month}>
            {renderMiniMonth(month)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearlyView;
