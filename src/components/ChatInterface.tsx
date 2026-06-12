import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { User, ChatMessage } from '../types';
import { AILogic } from '../utils/aiLogic';

interface ChatInterfaceProps {
  user: User;
  isOnboarding: boolean;
  darkMode: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, isOnboarding, darkMode }) => {
  const [aiLogic] = useState(() => new AILogic());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: aiLogic.getInitialGreeting(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Process message through AI logic
    setTimeout(() => {
      const { acknowledgment, followUp } = aiLogic.processUserMessage(input);
      
      // SINGLE FLOWING MESSAGE - combine naturally
      const fullResponse = followUp 
        ? `${acknowledgment} ${followUp}`
        : acknowledgment;
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
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
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-lg ${
                message.role === 'user'
                  ? 'bg-white text-gray-900 border-2 border-purple-200'
                  : 'bg-pink-200 text-gray-900 border-2 border-pink-300'
              }`}
            >
              <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 bg-pink-200 border-2 border-pink-300 shadow-lg">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what you need to do..."
            className="w-full pl-4 pr-12 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg border-2 border-purple-200 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-gray-500'}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
