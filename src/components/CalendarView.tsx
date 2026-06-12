import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarEvent, Category, ViewMode } from '../types';
import EventModal from './EventModal';
import DailyView from './calendar/DailyView';
import WeeklyView from './calendar/WeeklyView';
import MonthlyView from './calendar/MonthlyView';
import YearlyView from './calendar/YearlyView';

interface CalendarViewProps {
  events: CalendarEvent[];
  categories: Category[];
  onAddEvent: (event: CalendarEvent) => void;
  onRemoveEvent: (eventId: string) => void;
  onAddCategory: (name: string, color: string) => Category;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  categories,
  onAddEvent,
  onRemoveEvent,
  onAddCategory,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const getDateDisplay = () => {
    switch (viewMode) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'yearly':
        return currentDate.getFullYear().toString();
    }
  };

  const handleAddEvent = (date?: Date) => {
    setSelectedDate(date || null);
    setShowEventModal(true);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setViewMode('monthly');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="glass-card p-4 border-b border-white border-opacity-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">Your Schedule</h2>
          <div className="flex items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="glass-input rounded-xl px-3 py-2 text-black font-semibold"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={() => handleAddEvent()}
              className="glass-button rounded-xl px-4 py-2 font-semibold flex items-center gap-2 text-black"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Add Event
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="glass-button rounded-xl p-2"
          >
            <ChevronLeft className="w-6 h-6 text-black" strokeWidth={2} />
          </button>
          <div className="text-center">
            <p className="text-2xl font-bold text-black">{getDateDisplay()}</p>
          </div>
          <button
            onClick={handleNext}
            className="glass-button rounded-xl p-2"
          >
            <ChevronRight className="w-6 h-6 text-black" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {viewMode === 'daily' && (
          <DailyView
            currentDate={currentDate}
            events={events}
            onAddEvent={handleAddEvent}
            onRemoveEvent={onRemoveEvent}
          />
        )}
        {viewMode === 'weekly' && (
          <WeeklyView
            currentDate={currentDate}
            events={events}
            onAddEvent={handleAddEvent}
            onRemoveEvent={onRemoveEvent}
          />
        )}
        {viewMode === 'monthly' && (
          <MonthlyView
            currentDate={currentDate}
            events={events}
            onAddEvent={handleAddEvent}
            onRemoveEvent={onRemoveEvent}
          />
        )}
        {viewMode === 'yearly' && (
          <YearlyView
            currentDate={currentDate}
            events={events}
            onMonthClick={handleMonthClick}
          />
        )}
      </div>

      {showEventModal && (
        <EventModal
          categories={categories}
          selectedDate={selectedDate}
          onClose={() => setShowEventModal(false)}
          onSave={onAddEvent}
          onAddCategory={onAddCategory}
        />
      )}
    </div>
  );
};

export default CalendarView;
