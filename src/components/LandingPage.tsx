import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartScheduling: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartScheduling }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="glass-card rounded-2xl p-5 shadow-lg">
            <Calendar className="w-16 h-16 text-purple-600" strokeWidth={2} />
          </div>
          <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Plan-elope
          </h1>
        </div>
        
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" strokeWidth={2} />
            <p className="text-3xl font-semibold text-gray-800">
              Stop being busy. Start being intentional.
            </p>
            <Sparkles className="w-6 h-6 text-pink-500" strokeWidth={2} />
          </div>
          <p className="text-xl text-gray-600">
            Your AI-powered life planner that aligns your schedule with your goals.
          </p>
        </div>

        <button
          onClick={onStartScheduling}
          className="glass-button rounded-2xl px-16 py-5 text-2xl font-semibold text-purple-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
        >
          Start Scheduling
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
