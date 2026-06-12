import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import SignInModal from './components/SignInModal';
import MainApp from './components/MainApp';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import { User } from './types';

type AppState = 'landing' | 'app';

interface Chat {
  id: string;
  title: string;
  lastModified: Date;
  data?: any; // Store chat-specific data
}

const STORAGE_KEYS = {
  USER: 'planelope_user',
  CHATS: 'planelope_chats',
  CURRENT_CHAT: 'planelope_current_chat',
};

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState('Plan-elope v1 - after meeting 2');

  // Load user and chats from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
    const savedCurrentChat = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      
      if (savedCurrentChat && parsedChats.find((c: Chat) => c.id === savedCurrentChat)) {
        setCurrentChatId(savedCurrentChat);
        const currentChat = parsedChats.find((c: Chat) => c.id === savedCurrentChat);
        if (currentChat) {
          setChatTitle(currentChat.title);
        }
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    }
  }, [chats]);

  // Save current chat ID to localStorage
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, currentChatId);
    }
  }, [currentChatId]);

  const handleStartScheduling = () => {
    setShowSignIn(true);
  };

  const handleSignIn = (userData: User) => {
    setUser(userData);
    setShowSignIn(false);
    setState('app');
    
    // Create initial chat if none exists
    if (chats.length === 0) {
      handleNewChat();
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setState('landing');
    setShowSignIn(false);
    setShowCalendar(false);
    setShowTasks(true);
    // Keep chats in localStorage for when user signs back in
  };

  const handleReturnToLanding = () => {
    setState('landing');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: `New Chat ${chats.length + 1}`,
      lastModified: new Date(),
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
    setChatTitle(newChat.title);
    setState('app');
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatTitle(chat.title);
      setState('app');
    }
  };

  const handleChatTitleChange = (newTitle: string) => {
    setChatTitle(newTitle);
    if (currentChatId) {
      setChats(chats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, title: newTitle, lastModified: new Date() }
          : chat
      ));
    }
  };

  const handleViewCalendars = () => {
    // TODO: Implement calendars view modal
    console.log('View all calendars from all chats');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Left Sidebar - Always Visible */}
      <Sidebar
        user={user}
        onSignIn={() => setShowSignIn(true)}
        onSignOut={handleSignOut}
        currentChatId={currentChatId}
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onViewCalendars={handleViewCalendars}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Always Visible */}
        <TopNav 
          onReturnToLanding={handleReturnToLanding}
          showReturnButton={state === 'app'}
          onToggleCalendar={() => setShowCalendar(!showCalendar)}
          showCalendar={showCalendar}
          onToggleTasks={() => setShowTasks(!showTasks)}
          showTasks={showTasks}
          onSignIn={() => setShowSignIn(true)}
          isLandingPage={state === 'landing'}
          chatTitle={chatTitle}
          onChatTitleChange={handleChatTitleChange}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {state === 'landing' && (
            <LandingPage onStartScheduling={handleStartScheduling} />
          )}
          
          {showSignIn && (
            <SignInModal 
              onClose={() => setShowSignIn(false)}
              onSignIn={handleSignIn}
            />
          )}

          {state === 'app' && user && (
            <MainApp 
              user={user}
              showCalendar={showCalendar}
              showTasks={showTasks}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
