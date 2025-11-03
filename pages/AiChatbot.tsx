import React, { useState, useRef, useEffect } from 'react';
import { askGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { UserIcon, AiChatbotIcon } from '../components/Icons';

const AiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = async (prompt: string) => {
    if (prompt.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponseText = await askGemini(prompt);
    const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (messages.length === 0) {
       setMessages([{
          sender: 'bot',
          text: "Hello! I'm your AI farming assistant. How can I help you today? You can ask me about crop management, fertilizers, market trends, and more."
       }]);
    }
  }, []);

  useEffect(scrollToBottom, [messages]);


  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">AI Chatbot</h2>
        <p className="text-sm text-gray-500">Ask any farming-related question.</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><AiChatbotIcon className="w-5 h-5 text-green-600"/></div>}
            <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
              <div className="prose" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
            </div>
            {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600"/></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><AiChatbotIcon className="w-5 h-5 text-green-600"/></div>
            <div className="max-w-md p-3 rounded-lg bg-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white rounded-b-xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="e.g., Best pesticide for aphids on tomatoes?"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || input.trim() === ''}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatbot;