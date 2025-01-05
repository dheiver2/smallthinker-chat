import React, { useState, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Prompt for username when the component mounts
    const name = prompt('Please enter your username:') || 'Anonymous';
    setUsername(name);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: username,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Simple Chat App</h1>
      
      <div className="h-64 overflow-y-auto mb-4 border p-2 rounded">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="mb-2 p-2 bg-gray-100 rounded"
          >
            <div className="flex justify-between">
              <span className="font-bold">{msg.sender}</span>
              <span className="text-sm text-gray-500">{msg.timestamp}</span>
            </div>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l-lg"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
