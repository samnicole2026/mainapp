import React, { useState } from 'react';
import { Calendar, ListTodo, Link2, Edit2, Check, User } from 'lucide-react';

interface TopNavProps {
  onReturnToLanding?: () => void;
  showReturnButton?: boolean;
  onToggleCalendar?: () => void;
  showCalendar?: boolean;
  onToggleTasks?: () => void;
  showTasks?: boolean;
  onSignIn?: () => void;
  isLandingPage?: boolean;
  chatTitle?: string;
  onChatTitleChange?: (title: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ 
  onReturnToLanding, 
  showReturnButton = true,
  onToggleCalendar,
  showCalendar = false,
  onToggleTasks,
  showTasks = false,
  onSignIn,
  isLandingPage = false,
  chatTitle = 'Plan-elope v1 - after meeting 2',
  onChatTitleChange,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(chatTitle);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(chatTitle);
  };

  const handleTitleSave = () => {
    if (onChatTitleChange) {
      onChatTitleChange(tempTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(chatTitle);
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  return (
    <>
      <div className="glass-strong shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Left: Logo + App Name */}
          <button
            onClick={showReturnButton && onReturnToLanding ? onReturnToLanding : undefined}
            className={`flex items-center gap-3 ${
              showReturnButton && onReturnToLanding ? 'hover:scale-105 transition-transform cursor-pointer' : 'cursor-default'
            }`}
            disabled={!showReturnButton || !onReturnToLanding}
          >
            <div className="glass-card rounded-xl p-2 shadow-md bg-gradient-to-br from-purple-500 to-pink-500">
              <Calendar className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Plan-elope</h1>
          </button>

          {/* Center: Chat Title (Editable) - Only in App Mode */}
          {!isLandingPage && (
            <div className="flex-1 flex justify-center px-8">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 max-w-md w-full">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleTitleSave}
                    autoFocus
                    className="flex-1 px-3 py-1.5 rounded-lg glass-input text-gray-800 text-sm"
                  />
                  <button
                    onClick={handleTitleSave}
                    className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 hover:shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTitleEdit}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all group"
                >
                  <span className="text-sm font-medium text-gray-800">{chatTitle}</span>
                  <Edit2 className="w-3.5 h-3.5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                </button>
              )}
            </div>
          )}

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {isLandingPage ? (
              /* Landing Page: Sign In Button */
              <button
                onClick={onSignIn}
                className="rounded-xl px-5 py-2 font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                <User className="w-4 h-4" strokeWidth={2} />
                Sign In
              </button>
            ) : (
              /* App Mode: Full Navigation */
              <>
                {/* Unscheduled Tasks Button */}
                <button
                  onClick={onToggleTasks}
                  className={`p-2 rounded-xl transition-all shadow-md hover:shadow-lg ${
                    showTasks 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' 
                      : 'bg-gradient-to-br from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500'
                  }`}
                  title="Unscheduled Tasks"
                >
                  <ListTodo className="w-5 h-5" strokeWidth={2} />
                </button>

                {/* Connect Calendar Button */}
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                  title="Connect Google Calendar"
                >
                  <Link2 className="w-5 h-5" strokeWidth={2} />
                </button>

                {/* View Calendar Button */}
                <button
                  onClick={onToggleCalendar}
                  className={`rounded-xl px-4 py-2 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${
                    showCalendar 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500'
                  }`}
                >
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  {showCalendar ? 'Hide Calendar' : 'View Calendar'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Connect Calendar Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Connect Google Calendar</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Connect your Google Calendar to sync your events and keep everything in one place.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // TODO: Implement Google Calendar OAuth
                  console.log('Connect Google Calendar');
                  setShowConnectModal(false);
                }}
                className="w-full rounded-xl px-4 py-3 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Link2 className="w-5 h-5" strokeWidth={2} />
                Connect with Google
              </button>

              <button
                onClick={() => setShowConnectModal(false)}
                className="w-full px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
