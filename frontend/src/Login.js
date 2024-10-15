import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/login/', {
            username: username,
            password: password
        })
        .then((response) => {
            alert("Login successful");
            setError('');
        })
        .catch((error) => {
            setError("Invalid credentials");
        });
    };

    return (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Benutzer:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Benutzer"
                    />
                </div>
                <div>
                    <label>Kennwort:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Kennwort"
                    />
                </div>
                <button type="submit">Anmelden</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
