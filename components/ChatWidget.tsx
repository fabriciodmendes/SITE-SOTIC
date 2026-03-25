import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MapPin, ExternalLink, Loader2, Navigation } from 'lucide-react';
import { ChatMessage, UserLocation } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<UserLocation | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o assistente virtual da SOTIC. Como posso ajudar você hoje? Posso responder sobre nossos serviços ou ajudar a localizar lugares próximos.',
      timestamp: Date.now(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to get location on mount for better map grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied or error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for context (simplified for this demo to just last few messages could be added)
      const response = await sendMessageToGemini(userMsg.text, [], location);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingChunks: response.groundingChunks,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass backdrop-blur-xl animate-fade-in-up">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-brand-blue/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
                <h3 className="font-display font-bold text-white">SOTIC AI</h3>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-none'
                  }`}
                >
                <div className="markdown-content prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown 
                    components={{
                        a: ({node, ...props}) => <a {...props} className="text-brand-cyan underline" target="_blank" rel="noopener noreferrer" />
                    }}
                  >
                      {msg.text}
                  </ReactMarkdown>
                </div>
                </div>

                {/* Grounding / Map Results */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-2 w-full max-w-[85%] space-y-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider ml-1">Fontes & Mapas</p>
                    <div className="flex flex-col gap-2">
                        {msg.groundingChunks.map((chunk, idx) => {
                            if (chunk.maps) {
                                return (
                                    <a 
                                        key={idx} 
                                        href={chunk.maps.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-cyan/50 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{chunk.maps.title}</p>
                                            <p className="text-xs text-gray-400">Ver no Google Maps</p>
                                        </div>
                                        <ExternalLink size={14} className="text-gray-500 group-hover:text-white" />
                                    </a>
                                );
                            }
                            if (chunk.web) {
                                return (
                                    <a 
                                        key={idx} 
                                        href={chunk.web.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Navigation size={12} />
                                        </div>
                                        <p className="text-xs text-gray-300 truncate flex-1">{chunk.web.title}</p>
                                        <ExternalLink size={12} className="text-gray-500" />
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-brand-cyan" />
                  <span className="text-xs text-gray-400">Pesquisando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-dark-900/50">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-brand-blue/50 focus-within:ring-1 focus-within:ring-brand-blue/50 transition-all">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Pergunte sobre serviços ou locais..."
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-500"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`p-2 rounded-full transition-all ${
                        input.trim() 
                            ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-[0_0_10px_rgba(0,102,255,0.4)]' 
                            : 'bg-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Send size={16} />
                </button>
            </div>
            {location && (
                <div className="text-[10px] text-gray-600 mt-2 text-center flex items-center justify-center gap-1">
                    <MapPin size={10} /> Localização ativada para melhores resultados
                </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-blue hover:bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,102,255,0.4)] hover:shadow-[0_0_30px_rgba(0,102,255,0.6)] transition-all transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;