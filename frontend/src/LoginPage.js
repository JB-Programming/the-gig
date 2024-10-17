import React, { useState } from 'react';
import axios from 'axios';
import bannerImage from './H&G_pic.png';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif',
    },
    banner: {
      width: '1260px',
      height: '202px',
      marginBottom: '30px',
      borderRadius: '8px',
    },
    loginBox: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: '80%', // Adjust the width as necessary
      padding: '12px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px',
      textAlign: 'center', // Center text inside the input
    },
    button: {
      padding: '12px 20px',
      width: '80%',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      {/* Banner image (above the login box) */}
      <img
        src={bannerImage} // Replace with your actual image URL
        alt="Banner"
        style={styles.banner}
      />

      {/* Login Box */}
      <div style={styles.loginBox}>
        <h1 style={styles.heading}>Login</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
