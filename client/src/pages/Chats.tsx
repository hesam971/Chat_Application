import React, { useEffect, useState } from 'react';

type Socket = {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
};

type Message = {
  username: string;
  chatRoom: string;
  chat: string;
  time: string;
};

function Chats({ socket, chatRoom, username }: { socket: Socket, chatRoom: string, username: string }) {
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Handle sending messages
  const sendMessage = () => {
    if (chat.trim() && chatRoom) {
      const messageData = {
        username,
        chatRoom,
        chat,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      socket.emit('send_message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setChat(''); // Clear chat input
    }
  };

  // Listen for new messages
  useEffect(() => {
    socket.on('receive_message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up event listener on component unmount
  }, [socket]);

  return (
    <div className="d-flex flex-column h-100">
      {/* Messages display area */}
      <div className="messages flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        {messages.map((msg, index) => (
          <div key={index} className="message mb-2">
            <strong>{msg.username}:</strong> {msg.chat} <small className="text-muted">({msg.time})</small>
          </div>
        ))}
      </div>

      {/* Chat input area at the bottom */}
      <div className="chat-input d-flex mt-2" style={{ borderTop: '1px solid #dee2e6', paddingTop: '10px' }}>
        <input
          type="text"
          placeholder="Write a message..."
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          className="form-control me-2"
          style={{ flexGrow: 1 }}
        />
        <button onClick={sendMessage} className="btn btn-success">Send</button>
      </div>
    </div>
  );
}

export default Chats;
