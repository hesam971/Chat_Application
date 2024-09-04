import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Chats from './Chats';


const socket = io('http://localhost:3000')

type Params = {
  id: string;
}


function Dashboard() {
  const { id } = useParams<Params>();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatRoom, setChatRoom] = useState('')
  const [message, setMessage] = useState('')

  const handleClick = () => {
    if(!newMessage || !chatRoom){
      setError('all field are required!')
      clearData()
    }else{
    // Emit an event to the server
    const messageData = {
      newMessage,
      chatRoom,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    }
      socket.emit('join_room', messageData)
    }
  };



  function clearData() {
    setNewMessage('')
    setChatRoom('')
  }
  

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






  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>

   
    <div>
        {error? error: ''}
      </div>
    <input type="text" placeholder='username' value={newMessage} onChange={(prev) => {setNewMessage(prev.target.value)}}  />
      <input type="text" placeholder='join the chat Room' value={chatRoom} onChange={(prev) => {setChatRoom(prev.target.value)}} />
      <button onClick={handleClick}>Join</button>
      <Chats socket={socket} username={username} chatRoom={chatRoom} />

    </div>
  );
};

export default Dashboard;