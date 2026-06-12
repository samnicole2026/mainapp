import React from 'react';
import { CalendarEvent } from '../../types';
import { Trash2 } from 'lucide-react';

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

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return {
      top: `${startHour * 40}px`,
      height: `${Math.max(duration * 40, 20)}px`,
    };
  };

  return (
    <div className="h-full overflow-auto">
      <div className="flex border-b border-black border-opacity-10 sticky top-0 glass-card z-10">
        <div className="w-12 flex-shrink-0" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 p-2 text-center border-l border-black border-opacity-10"
          >
            <div className="text-xs font-semibold text-black opacity-60">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${
              day.toDateString() === new Date().toDateString()
                ? 'text-purple-600'
                : 'text-black'
            }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <div className="w-12 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="h-[40px] text-xs text-black p-1">
              {hour.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className="flex-1 relative border-l border-black border-opacity-10"
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[40px] border-b border-black border-opacity-10 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                  onClick={() => {
                    const date = new Date(day);
                    date.setHours(hour, 0, 0, 0);
                    onAddEvent(date);
                  }}
                />
              ))}
              
              {dayEvents.map((event) => {
                const position = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 rounded p-1 text-white text-xs font-semibold shadow group"
                    style={{
                      ...position,
                      backgroundColor: event.category.color,
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0 truncate">{event.title}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveEvent(event.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-20 rounded p-0.5"
                      >
                        <Trash2 className="w-2.5 h-2.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
