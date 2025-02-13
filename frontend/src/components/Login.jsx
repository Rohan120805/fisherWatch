import { useState } from 'react';
import api from '../utils/axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Remove /auth since it's in baseURL
        const response = await api.post('/login', {
          username,
          password
        });
  
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          onLogin();
        }
      } catch (err) {
        setError('Invalid credentials');
        console.error(err);
      }
    };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;