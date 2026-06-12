import React from 'react';
import { CalendarEvent } from '../../types';

interface MonthlyViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onRemoveEvent: (eventId: string) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  events,
  onAddEvent,
  onRemoveEvent,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  while (days.length < 42) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  const isToday = (day: Date) => {
    return day.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === month;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 border-b border-black border-opacity-10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-bold text-black"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={index}
              className={`border-r border-b border-black border-opacity-10 p-2 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors ${
                !isCurrentMonth(day) ? 'opacity-40' : ''
              }`}
              onClick={() => onAddEvent(day)}
            >
              <div
                className={`text-sm font-semibold mb-1 ${
                  isToday(day)
                    ? 'bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : 'text-black'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white font-semibold truncate group relative"
                    style={{ backgroundColor: event.category.color }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-black font-semibold">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
