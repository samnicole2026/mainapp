import React from 'react';
import { Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartScheduling: () => void;
  darkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartScheduling, darkMode }) => {
  return (
    <div className={`h-full flex items-center justify-center p-8 ${
      darkMode ? 'bg-gray-900' : ''
    }`}>
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Tagline */}
        <h1 className={`text-5xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Plan-elope
        </h1>

        {/* Description */}
        <p className={`text-xl leading-relaxed ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Your AI-powered life planner that aligns your schedule with your goals.
          Tell us what you need to do, and we'll help you make it happen.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartScheduling}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          Start Scheduling
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
