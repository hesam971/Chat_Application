import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')

type Params = {
  id: string;
}


function Dashboard() {
  const { id } = useParams<Params>();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/dashboard/${id}`);
        setUsername(response.data.username);
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
      setMessages(data.message);
    });
  }, []);

  const handleClick = () => {
    // Emit an event to the server
    socket.emit('requestMessage', { userId: id });
  };


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <button onClick={handleClick}>Send</button>
      <p>{messages}</p>
    </div>
  );
};

export default Dashboard;