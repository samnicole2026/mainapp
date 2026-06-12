import React from 'react';
import { MessageSquare, Calendar, Upload } from 'lucide-react';
import { OnboardingPath, User } from '../types';

interface OnboardingFlowProps {
  user: User;
  onPathSelect: (path: OnboardingPath) => void;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onPathSelect, onComplete }) => {
  const handleChatFirst = () => {
    onPathSelect('chat-first');
  };

  const handleCalendarFirst = () => {
    onPathSelect('calendar-first');
  };

  return (
    <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-purple-400 via-pink-300 to-violet-400">
      <div className="max-w-4xl w-full">
        <div className="glass-strong rounded-3xl p-8 mb-8 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 text-black">Choose Your Path</h2>
          <p className="text-lg text-black opacity-80">How would you like to start building your schedule?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={handleChatFirst}
            className="glass-card rounded-3xl p-8 text-left hover:scale-105 transition-transform shadow-xl"
          >
            <MessageSquare className="w-12 h-12 mb-4 text-purple-600" strokeWidth={2} />
            <h3 className="text-2xl font-bold mb-2 text-black">Chat with PLANelope</h3>
            <p className="text-sm text-black opacity-70">Build your schedule from scratch through conversation</p>
          </button>

          <div className="space-y-4">
            <button
              onClick={handleCalendarFirst}
              className="w-full glass-card rounded-3xl p-8 text-left hover:scale-105 transition-transform shadow-xl"
            >
              <Calendar className="w-12 h-12 mb-4 text-purple-600" strokeWidth={2} />
              <h3 className="text-2xl font-bold mb-2 text-black">Connect Your Calendar</h3>
              <p className="text-sm text-black opacity-70">Import and optimize your existing schedule</p>
            </button>

            <button
              onClick={handleCalendarFirst}
              className="w-full glass-card rounded-3xl p-8 text-left hover:scale-105 transition-transform shadow-xl"
            >
              <Upload className="w-12 h-12 mb-4 text-purple-600" strokeWidth={2} />
              <h3 className="text-2xl font-bold mb-2 text-black">Input Your Calendar</h3>
              <p className="text-sm text-black opacity-70">Manually add your current commitments</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
