import React, { useState } from 'react';
import { User as UserType, Category, CalendarEvent, Task, Goal } from '../types';
import ChatInterface from './ChatInterface';
import CalendarView from './CalendarView';
import TasksSidebar from './TasksSidebar';
import { DEFAULT_CATEGORIES } from '../utils/categories';

interface MainAppProps {
  user: UserType;
  showCalendar: boolean;
  showTasks: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ user, showCalendar, showTasks }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      name,
      color,
      isDefault: false,
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const addEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const removeEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const scheduleTask = (taskId: string, date: Date, time: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const [hours, minutes] = time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    
    const end = new Date(start);
    end.setHours(start.getHours() + task.duration);

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: task.name,
      start,
      end,
      category: task.category,
      importance: task.importance,
      isMovable: task.isMovable,
      isImmovable: task.isImmovable,
      isLockedIn: task.isLockedIn,
    };

    addEvent(newEvent);
    removeTask(taskId);
  };

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-purple-400 via-pink-300 to-violet-400">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className={`${showCalendar ? 'w-1/2' : 'w-full'} overflow-hidden`}>
          <ChatInterface user={user} isOnboarding={false} />
        </div>

        {/* Calendar View */}
        {showCalendar && (
          <>
            <div className="w-1 bg-white bg-opacity-30" />
            <div className="w-1/2 overflow-hidden">
              <CalendarView
                events={events}
                categories={categories}
                onAddEvent={addEvent}
                onRemoveEvent={removeEvent}
                onAddCategory={addCategory}
              />
            </div>
          </>
        )}
      </div>

      {/* Tasks Sidebar */}
      {showTasks && (
        <div className="shadow-2xl">
          <TasksSidebar
            tasks={tasks}
            categories={categories}
            onAddTask={addTask}
            onRemoveTask={removeTask}
            onScheduleTask={scheduleTask}
            onAddCategory={addCategory}
            onClose={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default MainApp;
