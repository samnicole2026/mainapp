import React from 'react';
import { CalendarEvent } from '../../types';
import { Plus } from 'lucide-react';

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
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dayDate = new Date(year, month, day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-7 gap-2 h-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="bg-white rounded-lg border border-gray-200" />;
          }

          const dayEvents = getEventsForDay(day);
          const date = new Date(year, month, day);

          return (
            <div
              key={day}
              className={`bg-white rounded-lg border ${
                isToday(day) ? 'border-purple-500 border-2' : 'border-gray-200'
              } p-2 min-h-[100px] flex flex-col hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${
                  isToday(day) ? 'text-purple-600' : 'text-gray-900'
                }`}>
                  {day}
                </span>
                <button
                  onClick={() => onAddEvent(date)}
                  className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                    style={{ backgroundColor: event.category.color }}
                    onClick={() => onRemoveEvent(event.id)}
                  >
                    <div className="font-medium text-white truncate">
                      {event.title}
                    </div>
                    <div className="text-white text-opacity-90">
                      {event.start.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
