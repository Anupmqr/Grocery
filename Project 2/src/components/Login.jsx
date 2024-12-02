import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading

    try {
      // Check for Admin Login
      if (username === 'Manikanta' && password === '5678') {
        localStorage.setItem('isLoggedIn', 'admin'); // Set login state for admin
        setIsLoading(false);
        navigate('/AdminDashboard'); // Redirect to Admin Dashboard
        return;
      }

      // Fetch User Data
      const response = await axios.get('http://localhost:3000/users');
      if (response.data && Array.isArray(response.data)) {
        const user = response.data.find(
          (user) =>
            user.uname.toLowerCase() === username.toLowerCase() &&
            user.password === password
        );

        if (user) {
          localStorage.setItem('isLoggedIn', 'customer'); // Set login state for customer
          localStorage.setItem('username', user.uname); // Store username
          setIsLoading(false);
          navigate('/CustomerDashboard'); // Redirect to Customer Dashboard
        } else {
          setIsLoading(false);
          setError('Invalid username or password'); // Show error message if not found
        }
      } else {
        setIsLoading(false);
        setError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setIsLoading(false);
      setError('There was an error during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Error message display */}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
