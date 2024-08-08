import React,{useState , useEffect} from 'react';
import '../style.css';
import { jwtDecode } from 'jwt-decode'; // Correct named impor

import BookList from '../components/Details';




function App() {
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username);
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }
}, []);
  return (
    <div className="container">
      <div className="main">
        <h1 className='mx-10 my-10 text-5xl font-serif text-slate-700'>Hello {username} </h1>
        
        <BookList />
        
        
      </div>
    </div>
  );
}

export default App;
