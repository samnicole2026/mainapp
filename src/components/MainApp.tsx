import React from 'react';
import ChatInterface from './ChatInterface';
import CalendarView from './CalendarView';
import TasksSidebar from './TasksSidebar';
import { User } from '../types';

interface MainAppProps {
  user: User;
  showCalendar: boolean;
  showTasks: boolean;
  darkMode: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ user, showCalendar, showTasks, darkMode }) => {
  return (
    <div className={`h-full flex ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'
    }`}>
      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface user={user} isOnboarding={false} darkMode={darkMode} />
      </div>

      {/* Calendar Panel - DEFAULT SHOWN */}
      {showCalendar && (
        <div className="w-96 border-l border-purple-100 overflow-hidden">
          <CalendarView darkMode={darkMode} />
        </div>
      )}

      {/* Tasks Sidebar */}
      {showTasks && (
        <div className="w-80 border-l border-purple-100 overflow-hidden">
          <TasksSidebar darkMode={darkMode} />
        </div>
      )}
    </div>
  );
};

export default MainApp;
