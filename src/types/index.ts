export type OnboardingState = 'landing' | 'onboarding' | 'app';
export type OnboardingPath = 'chat-first' | 'calendar-first' | null;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  importance?: 'low' | 'medium' | 'high';
  isMovable?: boolean;
  isImmovable?: boolean;
  isLockedIn?: boolean;
  description?: string;
}

export interface Task {
  id: string;
  name: string;
  category: string;
  duration: number;
  importance: 'low' | 'medium' | 'high';
  deadline?: Date;
  isMovable: boolean;
  isImmovable: boolean;
  isLockedIn: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'long-term';
  category: string;
  description?: string;
  targetDate?: Date;
  isCompleted: boolean;
}

export type CalendarView = 'daily' | 'weekly' | 'monthly' | 'yearly';
