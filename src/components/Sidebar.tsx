import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, MessageSquare, User, LogOut } from 'lucide-react';
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
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  onSignIn,
  onSignOut,
  currentChatId,
  chats,
  onNewChat,
  onSelectChat,
  onViewCalendars,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div
      className={`glass-strong h-full flex flex-col transition-all duration-300 shadow-lg ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Collapse/Expand Button */}
      <div className="p-2 border-b border-purple-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all flex items-center justify-center group"
          title={isExpanded ? 'Minimize' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-purple-600 group-hover:text-purple-700" strokeWidth={2} />
          ) : (
            <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-blue-700" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Calendars Button */}
      <div className="p-2 border-b border-purple-100">
        <button
          onClick={onViewCalendars}
          className="w-full p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all flex items-center gap-3 group"
          title="View All Calendars"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md group-hover:shadow-lg transition-shadow">
            <Calendar className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          {isExpanded && <span className="text-sm font-semibold text-gray-800">Calendars</span>}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2 border-b border-purple-100">
        <button
          onClick={onNewChat}
          className="w-full p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all flex items-center gap-3 group"
          title="New Chat"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-md group-hover:shadow-lg transition-shadow">
            <Plus className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          {isExpanded && <span className="text-sm font-semibold text-gray-800">New Chat</span>}
        </button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto p-2">
        {isExpanded && (
          <div className="mb-2 px-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Chats
            </span>
          </div>
        )}
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full p-2 rounded-lg transition-all flex items-center gap-3 group ${
                currentChatId === chat.id
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 shadow-sm'
                  : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
              }`}
              title={isExpanded ? undefined : chat.title}
            >
              <div className={`p-1 rounded-lg transition-all ${
                currentChatId === chat.id
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-md'
                  : 'bg-gradient-to-br from-purple-400 to-blue-400 opacity-70 group-hover:opacity-100'
              }`}>
                <MessageSquare className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              {isExpanded && (
                <span className={`text-sm truncate font-medium ${
                  currentChatId === chat.id ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {chat.title}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sign In / User Profile */}
      <div className="p-2 border-t border-purple-100 relative">
        {user ? (
          <div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {isExpanded && (
                <span className="text-sm font-semibold text-gray-800 truncate">{user.name}</span>
              )}
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-2 right-2 mb-2 glass-strong rounded-lg shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    onSignOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all flex items-center gap-3 group"
                >
                  <div className="p-1 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 shadow-sm">
                    <LogOut className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="w-full p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all flex items-center gap-3 group"
            title="Sign In"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-md group-hover:shadow-lg transition-shadow">
              <User className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            {isExpanded && <span className="text-sm font-semibold text-gray-800">Sign In</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
