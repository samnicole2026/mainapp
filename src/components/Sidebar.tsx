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
          className="w-full p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
          title={isExpanded ? 'Minimize' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Calendars Button */}
      <div className="p-2 border-b border-purple-100">
        <button
          onClick={onViewCalendars}
          className="w-full p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
          title="View All Calendars"
        >
          <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
          {isExpanded && <span className="text-sm font-medium text-gray-800">Calendars</span>}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2 border-b border-purple-100">
        <button
          onClick={onNewChat}
          className="w-full p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
          {isExpanded && <span className="text-sm font-medium text-gray-800">New Chat</span>}
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
              className={`w-full p-2 rounded-lg transition-colors flex items-center gap-3 ${
                currentChatId === chat.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'hover:bg-purple-50 text-gray-700'
              }`}
              title={isExpanded ? undefined : chat.title}
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              {isExpanded && (
                <span className="text-sm truncate">{chat.title}</span>
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
              className="w-full p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {isExpanded && (
                <span className="text-sm font-medium text-gray-800 truncate">{user.name}</span>
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
                  className="w-full p-3 hover:bg-purple-50 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-gray-800">Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="w-full p-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3"
            title="Sign In"
          >
            <User className="w-5 h-5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
            {isExpanded && <span className="text-sm font-medium text-gray-800">Sign In</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
