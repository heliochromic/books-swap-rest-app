import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const LoginPage = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password
            });

            const authToken = response.data.token;
            sessionStorage.setItem('token', authToken);
            setIsAuthenticated(true);
            navigate('/catalog');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('There was an error logging in:', error);
        }
    };

    return (
        <div className="login-page">
            <h2>Svvap</h2>
            <div className='login-container'>
            <form onSubmit={handleLogin}>
                <div className='username-div'>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder={username ? '' : 'Enter your username'}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = username ? '' : 'Enter your username'}
                    />
                </div>
                <div className="password-div">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={password ? '' : 'Enter your password'}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = password ? '' : 'Enter your password'}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className='login-button'>Log In</button>
            </form>
            <p className="signup-message">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
                </div>
        </div>
    );
};

export default LoginPage;
