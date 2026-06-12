import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'classes', name: 'Classes', color: '#3b82f6', isDefault: true },
  { id: 'meetings', name: 'Meetings', color: '#8b5cf6', isDefault: true },
  { id: 'ccas', name: 'CCAs & Other Commitments', color: '#ec4899', isDefault: true },
  { id: 'events', name: 'Events', color: '#f59e0b', isDefault: true },
  { id: 'volunteer', name: 'Volunteer', color: '#10b981', isDefault: true },
  { id: 'work', name: 'Work', color: '#ef4444', isDefault: true },
  { id: 'tasks', name: 'Tasks', color: '#6366f1', isDefault: true },
];

export const PRESET_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#10b981' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];
