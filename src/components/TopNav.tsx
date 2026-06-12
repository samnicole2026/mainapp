import React, { useState } from 'react';
import { Link, CheckSquare } from 'lucide-react';

interface TopNavProps {
  onReturnToLanding: () => void;
  showReturnButton: boolean;
  onToggleCalendar: () => void;
  showCalendar: boolean;
  onToggleTasks: () => void;
  showTasks: boolean;
  onSignIn: () => void;
  isLandingPage: boolean;
  chatTitle: string;
  onChatTitleChange: (newTitle: string) => void;
  darkMode: boolean;
  onViewCalendar?: () => void;
  onLinkCalendar?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  showCalendar,
  onToggleCalendar,
  onToggleTasks,
  isLandingPage,
  chatTitle,
  onChatTitleChange,
  darkMode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(chatTitle);

  const handleTitleClick = () => {
    if (!isLandingPage) {
      setIsEditingTitle(true);
      setTempTitle(chatTitle);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onChatTitleChange(tempTitle);
    } else {
      setTempTitle(chatTitle);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle(chatTitle);
    }
  };

  return (
    <div className={`h-14 flex items-center justify-between px-6 ${
      darkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'
    }`}>
      {/* Left - App Name */}
      <div className="flex items-center">
        <span className={`text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
          Plan-elope
        </span>
      </div>

      {/* Center - Chat Title (editable) */}
      {!isLandingPage && (
        <div className="flex-1 flex items-center justify-center">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyPress}
              className={`px-3 py-1 rounded-lg border focus:outline-none font-medium text-center ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              autoFocus
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className={`px-3 py-1 rounded-lg transition-all font-medium ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {chatTitle}
            </button>
          )}
        </div>
      )}

      {/* Right - Link Icon, Tasks Icon, View Calendar Button */}
      {!isLandingPage && (
        <div className="flex items-center gap-3">
          {/* Link Icon Button */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-gradient-to-br from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500"
            title="Link Calendar"
          >
            <Link className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* Tasks Icon Button */}
          <button
            onClick={onToggleTasks}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-gradient-to-br from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            title="Tasks"
          >
            <CheckSquare className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* View Calendar Button */}
          <button
            onClick={onToggleCalendar}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all shadow-sm hover:shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
          >
            {showCalendar ? 'Hide Calendar' : 'View Calendar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopNav;
