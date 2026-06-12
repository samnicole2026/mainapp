import React from 'react';
import { CalendarEvent } from '../../types';
import { Clock, Trash2 } from 'lucide-react';

interface DailyViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onRemoveEvent: (eventId: string) => void;
}

const DailyView: React.FC<DailyViewProps> = ({
  currentDate,
  events,
  onAddEvent,
  onRemoveEvent,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === currentDate.toDateString();
  });

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-[60px] border-b border-black border-opacity-10 flex"
          >
            <div className="w-16 flex-shrink-0 p-2 text-xs font-semibold text-black">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div
              className="flex-1 relative cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
              onClick={() => {
                const date = new Date(currentDate);
                date.setHours(hour, 0, 0, 0);
                onAddEvent(date);
              }}
            />
          </div>
        ))}
        
        {dayEvents.map((event) => {
          const position = getEventPosition(event);
          return (
            <div
              key={event.id}
              className="absolute left-16 right-4 rounded-lg p-2 text-white text-sm font-semibold shadow-lg group"
              style={{
                ...position,
                backgroundColor: event.category.color,
                minHeight: '30px',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{event.title}</div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    <Clock className="w-3 h-3" strokeWidth={2} />
                    {new Date(event.start).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveEvent(event.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-20 rounded p-1"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyView;
