import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { User, ChatMessage } from '../types';

interface ChatInterfaceProps {
  user: User;
  isOnboarding: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, isOnboarding }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hey ${user.name}! Ready to get your schedule sorted? What's on your mind today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationMemory = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getVariedGreeting = () => {
    const greetings = [
      "Got it!",
      "Okay!",
      "Alright!",
      "Sure thing!",
      "Perfect!",
      "Sounds good!",
      "I hear you!",
      "Understood!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const getVariedFollowUp = () => {
    const followUps = [
      "What else is going on?",
      "Anything else on your plate?",
      "What else should we tackle?",
      "What's next?",
      "Tell me more about your day.",
      "What else do you need to fit in?",
      "What other commitments do you have?",
    ];
    return followUps[Math.floor(Math.random() * followUps.length)];
  };

  const classifyResponse = (text: string): 'task' | 'time' | 'aspiration' | 'indirect' | 'emotional' => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(need to|have to|must|should|got to|gotta)\b/)) {
      return 'task';
    }
    if (lowerText.match(/\b(at|by|around|before|after|morning|afternoon|evening|tonight|today|tomorrow)\b/)) {
      return 'time';
    }
    if (lowerText.match(/\b(want to|would like|hoping to|trying to|planning to)\b/)) {
      return 'aspiration';
    }
    if (lowerText.match(/\b(busy|stressed|overwhelmed|tired|exhausted|hectic|crazy)\b/)) {
      return 'emotional';
    }
    
    return 'indirect';
  };

  const generateDynamicResponse = (userMessage: string): string => {
    const responseType = classifyResponse(userMessage);
    const greeting = getVariedGreeting();
    
    switch (responseType) {
      case 'task':
        return `${greeting} How long do you think that'll take?`;
      
      case 'time':
        return `${greeting} And how much time do you need for that?`;
      
      case 'aspiration':
        return `${greeting} When are you hoping to do that?`;
      
      case 'emotional':
        return `${greeting} Let's see what we can do to help. What's taking up most of your time right now?`;
      
      case 'indirect':
      default:
        return `${greeting} ${getVariedFollowUp()}`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    conversationMemory.current.add(input.toLowerCase());

    setTimeout(() => {
      const response = generateDynamicResponse(input);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'glass-strong text-black'
                  : 'bg-white bg-opacity-90 text-black shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-90 text-black rounded-2xl px-4 py-3 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 glass-strong">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what you need to do..."
            className="w-full pl-4 pr-12 py-3 rounded-xl glass-input text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              input.trim()
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <ArrowUp className={`w-5 h-5 ${input.trim() ? 'text-white' : 'text-gray-500'}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
