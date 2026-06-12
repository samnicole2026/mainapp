import React, { useState } from 'react';
import { X, Plus, Target, Trash2, Calendar } from 'lucide-react';
import { Goal } from '../types';
import { SUGGESTED_GOALS } from '../utils/suggestedGoals';

interface GoalsPanelProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onRemoveGoal: (goalId: string) => void;
  onClose: () => void;
}

const GoalsPanel: React.FC<GoalsPanelProps> = ({
  goals,
  onAddGoal,
  onRemoveGoal,
  onClose,
}) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [goalCategory, setGoalCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleAddGoal = () => {
    if (!goalTitle.trim()) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalTitle.trim(),
      type: goalType,
      category: goalCategory || 'General',
      targetDate: targetDate ? new Date(targetDate) : undefined,
    };

    onAddGoal(newGoal);
    setGoalTitle('');
    setGoalCategory('');
    setTargetDate('');
    setShowAddGoal(false);
  };

  const handleAddSuggestedGoal = (suggested: { title: string; category: string }) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: suggested.title,
      type: 'long-term',
      category: suggested.category,
    };
    onAddGoal(newGoal);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">Your Goals</h3>
          <button
            onClick={onClose}
            className="glass-button rounded-xl p-2"
          >
            <X className="w-5 h-5 text-black" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-black mx-auto mb-2 opacity-50" strokeWidth={2} />
              <p className="text-black">No goals yet. Add your first goal!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="glass-card rounded-xl p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold text-white ${
                        goal.type === 'short-term' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                    >
                      {goal.type === 'short-term' ? 'Short-term' : 'Long-term'}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-200 text-black">
                      {goal.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-black">{goal.title}</h4>
                  {goal.targetDate && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-black">
                      <Calendar className="w-3 h-3" strokeWidth={2} />
                      <span>Target: {goal.targetDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onRemoveGoal(goal.id)}
                  className="glass-button rounded-lg p-2"
                >
                  <Trash2 className="w-4 h-4 text-black" strokeWidth={2} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          {!showAddGoal && !showSuggested ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex-1 glass-button rounded-xl p-3 flex items-center justify-center gap-2 text-black font-semibold"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Add Custom Goal
              </button>
              <button
                onClick={() => setShowSuggested(true)}
                className="flex-1 glass-button rounded-xl p-3 flex items-center justify-center gap-2 text-black font-semibold"
              >
                <Target className="w-5 h-5" strokeWidth={2} />
                Browse Suggested
              </button>
            </div>
          ) : showAddGoal ? (
            <div className="space-y-3">
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Goal title"
                className="w-full glass-input rounded-xl p-3 text-black"
              />
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value as 'short-term' | 'long-term')}
                className="w-full glass-input rounded-xl p-3 text-black"
              >
                <option value="short-term">Short-term</option>
                <option value="long-term">Long-term</option>
              </select>
              <input
                type="text"
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                placeholder="Category (optional)"
                className="w-full glass-input rounded-xl p-3 text-black"
              />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full glass-input rounded-xl p-3 text-black"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddGoal}
                  disabled={!goalTitle.trim()}
                  className="flex-1 glass-button rounded-xl p-3 text-black font-semibold disabled:opacity-50"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 glass-button rounded-xl p-3 text-black font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(SUGGESTED_GOALS).map(([category, categoryGoals]) => (
                <div key={category}>
                  <h4 className="font-bold text-black mb-2">{category}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryGoals.map((goal, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddSuggestedGoal(goal)}
                        className="glass-button rounded-xl p-3 text-left text-black hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        {goal.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowSuggested(false)}
                className="w-full glass-button rounded-xl p-3 text-black font-semibold"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPanel;
