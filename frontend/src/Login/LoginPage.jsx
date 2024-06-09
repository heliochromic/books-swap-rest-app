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
            const userID = response.data.userID;
            sessionStorage.setItem('token', authToken);
            sessionStorage.setItem('userID', userID);
            setIsAuthenticated(true);
            navigate('/catalog');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            console.error(error);
        }
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center h-75">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-3">
                        <h1 className="text-center mb-3">Log in</h1>
                        <div className='login-container'>
                            <form onSubmit={handleLogin} className="text-center">
                                <div className="mb-4">
                                    <input required
                                           type="text"
                                           value={username}
                                           className="form-control"
                                           id="exampleInputEmail"
                                           placeholder="Enter username"
                                           onChange={(e) => setUsername(e.target.value)}
                                           aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-4">
                                    <input required
                                           type="password"
                                           value={password}
                                           className="form-control"
                                           id="exampleInputPassword"
                                           onChange={(e) => setPassword(e.target.value)}
                                           placeholder="Enter password" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Log In</button>
                                {error && <p style={{color: 'red'}}>{error}</p>}
                            </form>
                            <p className="signup-message text-center mt-3">
                                Don't have an account? <Link to="/signup">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
