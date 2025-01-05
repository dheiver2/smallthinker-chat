import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sun, Moon, Menu, Plus, Settings, MessageSquare, Bot } from 'lucide-react';

const AlertMessage = ({ children }) => (
  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700" role="alert">
    <p>{children}</p>
  </div>
);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nova conversa', active: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const createNewChat = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: 'Nova conversa',
      active: true
    };
    setConversations(prev => prev.map(conv => ({...conv, active: false})).concat(newConversation));
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    setError(null);
    setIsLoading(true);
    const newMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, newMessage]);
    
    try {
      const response = await fetch('https://powerinfer-smallthinker-demo.hf.space/run/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 0,
          data: [
            inputMessage,
            messages.map(msg => [msg.content, msg.role === 'assistant' ? msg.content : ''])
          ]
        }),
      });

      if (!response.ok) throw new Error('Falha na comunicação com o servidor');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.data[0]
      }]);

      if (messages.length === 0) {
        setConversations(prev => 
          prev.map(conv => 
            conv.active ? {...conv, title: inputMessage.slice(0, 30) + '...'} : conv
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
    }

    setIsLoading(false);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}>
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nova Conversa
          </button>
        </div>
        
        <div className="px-2 space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`w-full text-left p-3 rounded-lg truncate flex items-center gap-2 transition-colors ${
                conv.active 
                  ? 'bg-gray-200 dark:bg-gray-800' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <MessageSquare size={18} />
              {conv.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-4 whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <Loader2 className="animate-spin" />
              </div>
            </div>
          )}
          {error && <AlertMessage>{error}</AlertMessage>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="1"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
