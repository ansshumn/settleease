import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  onNavigate?: (path: string) => void;
}

const quickActions = [
  { label: 'Find PG 🏠', query: 'pg chahiye' },
  { label: 'Tiffin Service 🍱', query: 'tiffin service' },
  { label: 'Emergency 🚨', query: 'emergency' },
  { label: 'Language Help 🗣️', query: 'language help' },
];

const welcomeMessage: Message = {
  id: '1',
  text: "Namaste! 👋 Main SettleEase hoon. Main aapki kaise help kar sakta hoon aaj?",
  isBot: true,
  timestamp: new Date(),
};

function getBotResponse(query: string): { text: string; navigate?: string } {
  const lowerQuery = query.toLowerCase();

  // Logic remains same, just enhanced UI
  if (lowerQuery.includes('pg') || lowerQuery.includes('hostel') || lowerQuery.includes('room')) {
    return {
      text: "PG dhundh rahe ho? Services page par check karo, wahan area aur budget ke hisaab se filter kar sakte ho! 🏠",
      navigate: '/services'
    };
  }
  if (lowerQuery.includes('tiffin') || lowerQuery.includes('food')) {
    return {
      text: "Ghar jaisa khana? Humare paas best tiffin services hain. Services page par check karo 🍱",
      navigate: '/services'
    };
  }
  if (lowerQuery.includes('emergency') || lowerQuery.includes('help')) {
    return {
      text: "Emergency SOS page par le jaata hoon. Wahan hospitals aur police stations ki details milengi! 🚨",
      navigate: '/emergency'
    };
  }
  if (lowerQuery.includes('language') || lowerQuery.includes('bolna')) {
    return {
      text: "Language seekhni hai? Language Help page par jaao! 🗣️",
      navigate: '/language'
    };
  }

  return {
    text: "Main samajh gaya! Aap mujhse PG, tiffin, ya emergency help ke baare mein pooch sakte ho. Kya chahiye aapko? 😊"
  };
}

export function ChatBot({ onNavigate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll to bottom if there are new messages past the welcome message
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Django Backend API ko call karo
      const response = await fetch('http://127.0.0.1:8001/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await response.json();

      // 2. AI ka reply extract karo
      const replyText = data.reply || (data.bot_reply && data.bot_reply.message) || "Koi response nahi mila.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Backend se connect nahi ho paya. Please check karein Django server 8001 par chal raha hai.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div id="chatbot" className="w-full max-w-4xl mx-auto py-12">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 ring-1 ring-gray-100/50">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">SettleEase AI</h3>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Always active
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Sidebar / Quick Actions (Desktop) */}
          <div className="hidden md:block w-1/3 bg-gray-50/50 border-r border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Shortcuts</h4>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.query)}
                  className="w-full text-left p-3 rounded-xl bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all text-sm font-medium text-gray-700 hover:text-purple-700 flex items-center gap-3 shadow-sm hover:shadow-md group"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-500 transition-colors" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${message.isBot
                        ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none'
                        }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <span className="text-[10px] opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask anything (e.g., PG in Indiranagar)..."
                  className="flex-1 bg-white text-gray-800 placeholder-gray-400 border-0 ring-1 ring-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 shadow-sm transition-all outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="bg-purple-600 text-white rounded-xl px-6 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Quick Actions */}
              <div className="md:hidden flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-hide">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
