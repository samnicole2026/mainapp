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
  data?: any;
}

const STORAGE_KEYS = {
  USER: 'planelope_user',
  CHATS: 'planelope_chats',
  CURRENT_CHAT: 'planelope_current_chat',
  DARK_MODE: 'planelope_dark_mode',
};

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showCalendar, setShowCalendar] = useState(true); // DEFAULT = true (Chat + Schedule)
  const [showTasks, setShowTasks] = useState(false); // DEFAULT = false
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState('Plan-elope v1 - after meeting 2');
  const [darkMode, setDarkMode] = useState(false);

  // Load user, chats, and dark mode preference from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
    const savedCurrentChat = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);

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

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
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

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  }, [darkMode]);

  const handleStartScheduling = () => {
    setShowSignIn(true);
  };

  const handleSignIn = (userData: User) => {
    setUser(userData);
    setShowSignIn(false);
    setState('app');
    
    if (chats.length === 0) {
      handleNewChat();
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setState('landing');
    setShowSignIn(false);
    setShowCalendar(true); // Reset to default
    setShowTasks(false); // Reset to default
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
    console.log('View all calendars from all chats');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleViewCalendar = () => {
    console.log('View calendar clicked');
    setShowCalendar(true);
  };

  const handleLinkCalendar = () => {
    console.log('Link calendar clicked');
    // TODO: Open calendar linking modal
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${darkMode ? 'dark' : ''}`}>
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
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
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
          darkMode={darkMode}
          onViewCalendar={state === 'app' ? handleViewCalendar : undefined}
          onLinkCalendar={state === 'app' ? handleLinkCalendar : undefined}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {state === 'landing' && (
            <LandingPage onStartScheduling={handleStartScheduling} darkMode={darkMode} />
          )}
          
          {showSignIn && (
            <SignInModal 
              onClose={() => setShowSignIn(false)}
              onSignIn={handleSignIn}
              darkMode={darkMode}
            />
          )}

          {state === 'app' && user && (
            <MainApp 
              user={user}
              showCalendar={showCalendar}
              showTasks={showTasks}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
