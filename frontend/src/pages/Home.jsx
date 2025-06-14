import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    marginTop: '4rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px'
  },
  input: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '1rem'
  },
  button: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#646cff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  error: {
    color: '#ff4444',
    fontSize: '0.9rem',
    textAlign: 'center'
  }
};

function Home() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/users/check-auth', {
        credentials: 'include'
      });
      setIsLoggedIn(response.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      window.dispatchEvent(new Event('auth-change'));
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Fisher Watch</h1>
      <p>A place where the Towers are watched.</p>
      
      {!isLoggedIn && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Login</h2>
          {error && <div style={styles.error}>{error}</div>}
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      )}
    </div>
  );
}

export default Home;