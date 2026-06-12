import React, { useState } from 'react';
import { X, Star, Plus } from 'lucide-react';
import { CalendarEvent, Category } from '../types';
import { PRESET_COLORS } from '../utils/categories';

interface EventModalProps {
  categories: Category[];
  selectedDate: Date | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onAddCategory: (name: string, color: string) => Category;
}

const EventModal: React.FC<EventModalProps> = ({
  categories,
  selectedDate,
  onClose,
  onSave,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState('09:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [importance, setImportance] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMovable, setIsMovable] = useState(true);
  const [isImmovable, setIsImmovable] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0].value);

  const handleSave = () => {
    if (!title.trim() || !selectedCategory) return;

    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      start: startDate,
      end: endDate,
      category: selectedCategory,
      importance,
      isMovable,
      isImmovable,
      isLockedIn,
    };

    onSave(newEvent);
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const category = onAddCategory(newCategoryName.trim(), newCategoryColor);
    setSelectedCategory(category);
    setShowNewCategory(false);
    setNewCategoryName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">Add Event</h3>
          <button
            onClick={onClose}
            className="glass-button rounded-xl p-2"
          >
            <X className="w-5 h-5 text-black" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-black"
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-black"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-black">All Day</span>
            </label>
            {!isAllDay && (
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full glass-input rounded-xl p-3 text-black"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Importance
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setImportance(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= importance
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category *
            </label>
            {!showNewCategory ? (
              <div className="space-y-2">
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
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="w-full glass-button rounded-xl p-3 flex items-center justify-center gap-2 text-black font-semibold"
                >
                  <Plus className="w-5 h-5" strokeWidth={2} />
                  Add New Category
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full glass-input rounded-xl p-3 text-black"
                />
                <div className="grid grid-cols-9 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewCategoryColor(color.value)}
                      className={`w-8 h-8 rounded-lg ${
                        newCategoryColor === color.value
                          ? 'ring-2 ring-black ring-offset-2'
                          : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 glass-button rounded-xl p-3 text-black font-semibold"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowNewCategory(false)}
                    className="flex-1 glass-button rounded-xl p-3 text-black font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isMovable}
                onChange={(e) => {
                  setIsMovable(e.target.checked);
                  if (e.target.checked) setIsImmovable(false);
                }}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-black">Movable</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isImmovable}
                onChange={(e) => {
                  setIsImmovable(e.target.checked);
                  if (e.target.checked) setIsMovable(false);
                }}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-black">Immovable</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLockedIn(true)}
                className={`flex-1 rounded-xl p-3 font-semibold ${
                  isLockedIn
                    ? 'bg-green-500 text-white'
                    : 'glass-button text-black'
                }`}
              >
                Locked In
              </button>
              <button
                onClick={() => setIsLockedIn(false)}
                className={`flex-1 rounded-xl p-3 font-semibold ${
                  !isLockedIn
                    ? 'bg-blue-500 text-white'
                    : 'glass-button text-black'
                }`}
              >
                Tentative
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 glass-button rounded-xl p-3 font-semibold text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !selectedCategory}
            className="flex-1 glass-button rounded-xl p-3 font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
