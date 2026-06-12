export type AuthMode = 'email' | 'google' | 'microsoft' | 'guest';

export type OnboardingPath = 'chat-first' | 'calendar-first' | null;

export type OnboardingState = 'landing' | 'signin' | 'onboarding' | 'app';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  isGuest: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
