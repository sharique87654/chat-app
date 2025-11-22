import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: true,
});

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log('connected:', socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('disconnected');
      setIsConnected(false);
    }

    function onChatMessage(msg) {
      console.log('received:', msg);
      setMessages((prev) => [...prev, msg]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat_message', onChatMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat_message', onChatMessage);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit('chat_message', message);
    setMessage('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat App</h2>
      <p>Connection: {isConnected ? 'online' : 'offline'}</p>

      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
          padding: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          style={{ width: '80%' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
