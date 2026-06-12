import React from 'react';
import { CalendarEvent } from '../../types';
import { Plus } from 'lucide-react';

interface WeeklyViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onRemoveEvent: (eventId: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentDate,
  events,
  onAddEvent,
  onRemoveEvent,
}) => {
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="p-2 border-r border-gray-200"></div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center border-r border-gray-200 ${
                isToday(day) ? 'bg-purple-50' : ''
              }`}
            >
              <div className="text-xs text-gray-600 font-medium">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${
                isToday(day) ? 'text-purple-600' : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-2 text-xs text-gray-600 font-medium border-r border-gray-200 bg-white">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDayAndHour(day, hour);
              const cellDate = new Date(day);
              cellDate.setHours(hour, 0, 0, 0);

              return (
                <div
                  key={dayIndex}
                  className={`p-1 border-r border-gray-200 min-h-[60px] hover:bg-gray-50 transition-colors group relative ${
                    isToday(day) ? 'bg-purple-50 bg-opacity-30' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => onAddEvent(cellDate)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="space-y-1">
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
