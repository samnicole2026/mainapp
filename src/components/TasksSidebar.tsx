import React, { useState } from 'react';
import { Plus, Check, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksSidebarProps {
  darkMode: boolean;
}

const TasksSidebar: React.FC<TasksSidebarProps> = ({ darkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review project proposal', completed: false },
    { id: '2', title: 'Schedule team meeting', completed: true },
    { id: '3', title: 'Update documentation', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className={`h-full flex flex-col ${
      darkMode ? 'bg-gray-800 bg-opacity-95' : 'bg-white bg-opacity-90'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-purple-100'
      }`}>
        <h2 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Tasks</h2>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full p-3 rounded-lg transition-all flex items-center gap-3 text-left ${
              darkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-purple-50'
            }`}
          >
            {task.completed ? (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            ) : (
              <Circle className={`flex-shrink-0 w-5 h-5 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} strokeWidth={2} />
            )}
            <span className={`flex-1 text-sm ${
              task.completed 
                ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                : darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {task.title}
            </span>
          </button>
        ))}
      </div>

      {/* Add Task Input */}
      <div className={`p-4 border-t ${
        darkMode ? 'border-gray-700' : 'border-purple-100'
      }`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              darkMode 
                ? 'bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500' 
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            onClick={addTask}
            className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksSidebar;
