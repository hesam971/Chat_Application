import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Chats from './Chats';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:3000');


function Dashboard({ setAuth }: { setAuth: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    if (!newMessage || !chatRoom) {
      setError('All fields are required!');
      clearData();
    } else {
      // Emit an event to the server
      const messageData = {
        newMessage,
        chatRoom,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
      };
      socket.emit('join_room', messageData);
    }
  };

  function clearData() {
    setNewMessage('');
    setChatRoom('');
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/dashboard`, { headers: { Authorization: token } });
        setUsername(response.data.username);
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setAuth(false);
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container vh-100 d-flex flex-column justify-content-between">
      <div className="row">
        <div className="col-12">
          {/* Logout button at the top left */}
          <button onClick={logout} className="btn btn-danger mt-2">
            Logout
          </button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 text-center">
          {/* Welcome message */}
          <h1>Welcome, {username}!</h1>
        </div>
        <div className="col-12 text-center">
          {/* Error message display */}
          {error &&
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
            </div>
          }
        </div>
        <div className="col-12 d-flex flex-column align-items-center">
          {/* Input fields for chat room and new message */}
          <input type="text" placeholder='Chat Room' value={chatRoom} onChange={(prev) => setChatRoom(prev.target.value)} className="form-control my-2" style={{ maxWidth: '400px' }} />
          <input type="text" placeholder='Write a message...' value={newMessage} onChange={(prev) => setNewMessage(prev.target.value)} className="form-control my-2" style={{ maxWidth: '400px' }} />
          <button onClick={handleClick} className="btn btn-primary my-2" style={{ maxWidth: '400px' }}>Join</button>
        </div>
      </div>
      <div className="row flex-grow-1">
        {/* Chat display component */}
        <Chats socket={socket} username={username} chatRoom={chatRoom} />
      </div>
    </div>
  );
}

export default Dashboard;
