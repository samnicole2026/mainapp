import React from 'react';
import { CalendarEvent } from '../../types';
import { Plus } from 'lucide-react';

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

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-2">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const cellDate = new Date(currentDate);
          cellDate.setHours(hour, 0, 0, 0);

          return (
            <div
              key={hour}
              className="flex gap-4 group hover:bg-gray-50 rounded-lg transition-colors p-2"
            >
              <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-600">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              <div className="flex-1 min-h-[60px] border-l-2 border-gray-200 pl-4 relative">
                <button
                  onClick={() => onAddEvent(cellDate)}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded shadow-sm"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <div className="space-y-2">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className="px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                      style={{ backgroundColor: event.category.color }}
                      onClick={() => onRemoveEvent(event.id)}
                    >
                      <div className="font-semibold text-white">
                        {event.title}
                      </div>
                      <div className="text-sm text-white text-opacity-90">
                        {event.start.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })} - {event.end.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyView;
