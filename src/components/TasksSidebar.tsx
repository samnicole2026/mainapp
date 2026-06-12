import React, { useState } from 'react';
import { X, Plus, Clock, Calendar, Star, Trash2 } from 'lucide-react';
import { Task, Category } from '../types';
import { PRESET_COLORS } from '../utils/categories';

interface TasksSidebarProps {
  tasks: Task[];
  categories: Category[];
  onAddTask: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
  onScheduleTask: (taskId: string, date: Date, time: string) => void;
  onAddCategory: (name: string, color: string) => Category;
  onClose: () => void;
}

const TasksSidebar: React.FC<TasksSidebarProps> = ({
  tasks,
  categories,
  onAddTask,
  onRemoveTask,
  onScheduleTask,
  onAddCategory,
  onClose,
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [importance, setImportance] = useState(3);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
  const [isMovable, setIsMovable] = useState(true);
  const [schedulingTaskId, setSchedulingTaskId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  const handleAddTask = () => {
    if (!taskName.trim() || !selectedCategory) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      category: selectedCategory,
      importance,
      duration,
      durationUnit,
      isMovable,
      isImmovable: !isMovable,
      isLockedIn: false,
    };

    onAddTask(newTask);
    setTaskName('');
    setSelectedCategory(null);
    setImportance(3);
    setDuration(1);
    setShowAddTask(false);
  };

  const handleScheduleTask = (taskId: string) => {
    if (!scheduleDate || !scheduleTime) return;
    onScheduleTask(taskId, new Date(scheduleDate), scheduleTime);
    setSchedulingTaskId(null);
    setScheduleDate('');
    setScheduleTime('09:00');
  };

  return (
    <div className="w-80 glass-strong h-full flex flex-col border-l border-white border-opacity-20">
      <div className="p-4 border-b border-white border-opacity-20 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Unscheduled Tasks</h3>
        <button
          onClick={onClose}
          className="glass-button rounded-xl p-2"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white text-sm">No unscheduled tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="glass-card rounded-xl p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-black">{task.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: task.category.color }}
                    >
                      {task.category.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(task.importance)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-black">
                    <Clock className="w-3 h-3" strokeWidth={2} />
                    <span>
                      {task.duration} {task.durationUnit}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveTask(task.id)}
                  className="glass-button rounded-lg p-1"
                >
                  <Trash2 className="w-4 h-4 text-black" strokeWidth={2} />
                </button>
              </div>

              {schedulingTaskId === task.id ? (
                <div className="space-y-2 pt-2 border-t border-black border-opacity-10">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full glass-input rounded-lg p-2 text-black text-sm"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full glass-input rounded-lg p-2 text-black text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleScheduleTask(task.id)}
                      className="flex-1 glass-button rounded-lg p-2 text-xs font-semibold text-black"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setSchedulingTaskId(null)}
                      className="flex-1 glass-button rounded-lg p-2 text-xs font-semibold text-black"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSchedulingTaskId(task.id)}
                  className="w-full glass-button rounded-lg p-2 flex items-center justify-center gap-2 text-black font-semibold text-sm"
                >
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  Schedule
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white border-opacity-20">
        {!showAddTask ? (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full glass-button rounded-xl p-3 flex items-center justify-center gap-2 text-white font-semibold"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Add Task
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name"
              className="w-full glass-input rounded-xl p-3 text-black"
            />
            <select
              value={selectedCategory?.id || ''}
              onChange={(e) => {
                const category = categories.find(c => c.id === e.target.value);
                setSelectedCategory(category || null);
              }}
              className="w-full glass-input rounded-xl p-3 text-black"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                className="flex-1 glass-input rounded-xl p-3 text-black"
              />
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days')}
                className="glass-input rounded-xl p-3 text-black"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setImportance(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= importance
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                disabled={!taskName.trim() || !selectedCategory}
                className="flex-1 glass-button rounded-xl p-3 text-white font-semibold disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 glass-button rounded-xl p-3 text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksSidebar;
