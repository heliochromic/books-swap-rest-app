import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getConfig } from '../../utils';

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/password-change/', {
                current_password: currentPassword,
                new_password: newPassword,
            }, getConfig());
            setMessage(response.data.detail);
            navigate('/profile');
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.current_password ? error.response.data.current_password[0] : 'Error changing password');
            } else {
                setMessage('Error connecting to server');
            }
        }
    };

    return (
        <div className="password-change-page d-flex justify-content-center align-items-center h-75">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h1 className="text-center mb-3">Change Password</h1>
                        <div className="password-change-container">
                            <form onSubmit={handleSubmit} className="text-center">
                                <div className="mb-4">
                                    <input required
                                           type="password"
                                           value={currentPassword}
                                           className="form-control"
                                           placeholder="Current Password"
                                           onChange={(e) => setCurrentPassword(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <input required
                                           type="password"
                                           value={newPassword}
                                           className="form-control"
                                           placeholder="New Password"
                                           onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Change Password</button>
                                {message && <p style={{color: 'red'}}>{message}</p>}
                            </form>
                            <p className="text-center mt-3">
                                Go back to <Link to="/profile">Profile</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;
