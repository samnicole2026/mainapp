import React, { useState } from 'react';
import { MessageSquare, Calendar, Plus, User, Moon, Sun, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';

interface Chat {
  id: string;
  title: string;
  lastModified: Date;
}

interface SidebarProps {
  user: UserType | null;
  onSignIn: () => void;
  onSignOut: () => void;
  currentChatId: string | null;
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onViewCalendars: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  onSignIn,
  onSignOut,
  currentChatId,
  chats,
  onNewChat,
  onSelectChat,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // DEFAULT = minimized

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full flex flex-col transition-all duration-300 ${
      darkMode ? 'bg-gray-900 border-r border-gray-700' : 'bg-white border-r border-gray-200'
    }`}>
      {/* Collapse/Expand Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          ) : (
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Calendars Button - ABOVE New Chat */}
      <div className="px-4 mb-2">
        <button
          className={`w-full py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
            isCollapsed ? 'justify-center' : 'px-3'
          } bg-gradient-to-br from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500`}
          title="Calendars"
        >
          <Calendar className="w-5 h-5 text-white flex-shrink-0" strokeWidth={2} />
          {!isCollapsed && <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Calendars</span>}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-4">
        <button
          onClick={onNewChat}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500`}
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          {!isCollapsed && <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Chat</span>}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full py-2.5 rounded-lg flex items-center gap-3 transition-all ${
              currentChatId === chat.id
                ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-md'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
            } ${isCollapsed ? 'justify-center' : 'px-3'}`}
            title={chat.title}
          >
            <MessageSquare 
              className={`w-5 h-5 flex-shrink-0 ${
                currentChatId === chat.id ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} 
              strokeWidth={2} 
            />
            {!isCollapsed && (
              <span className={`text-sm font-medium truncate ${
                currentChatId === chat.id ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {chat.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User Profile / Sign In */}
      <div className="px-4 pb-4 relative">
        {user ? (
          <div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                isCollapsed ? 'justify-center' : 'px-3'
              } bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500`}
              title={user.name}
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <span className={`font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</span>
              )}
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className={`absolute bottom-full left-4 right-4 mb-2 rounded-lg shadow-xl overflow-hidden ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    onToggleDarkMode();
                  }}
                  className={`w-full p-3 transition-all flex items-center justify-between ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="w-4 h-4 text-purple-400" strokeWidth={2} />
                    ) : (
                      <Sun className="w-4 h-4 text-purple-400" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  
                  {/* Animated Toggle Switch */}
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${
                    darkMode ? 'bg-purple-400' : 'bg-gray-300'
                  }`}>
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        darkMode ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>

                {/* Settings Button */}
                <button
                  className={`w-full p-3 transition-all flex items-center gap-2 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Settings</span>
                </button>

                {/* Log Out Button */}
                <button
                  onClick={() => {
                    onSignOut();
                    setShowUserMenu(false);
                  }}
                  className={`w-full p-3 transition-all flex items-center gap-2 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <LogOut className="w-4 h-4 text-pink-400" strokeWidth={2} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className={`w-full py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
              isCollapsed ? 'justify-center' : 'px-3'
            } bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500`}
            title="Sign In"
          >
            <User className="w-5 h-5 text-white flex-shrink-0" strokeWidth={2} />
            {!isCollapsed && <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sign In</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
