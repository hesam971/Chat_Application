import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type Params = {
  id: string;
}

function Dashboard() {
  const { id } = useParams<Params>();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

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
    </div>
  );
};

export default Dashboard;