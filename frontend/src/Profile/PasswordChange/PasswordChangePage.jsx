import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {getConfig} from "../../utils";

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/password-change/', {
                current_password: currentPassword,
                new_password: newPassword,
            }, getConfig());
            setMessage(response.data.detail);
            navigate('/profile')
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.current_password ? error.response.data.current_password[0] : 'Error changing password');
            } else {
                setMessage('Error connecting to server');
            }
        }
    };

    return (
        <div className="change-container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="password"
                        id="cur-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder={currentPassword ? '' : 'Enter your current password'}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = currentPassword ? '' : 'Enter your current password'}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                         placeholder={newPassword ? '' : 'Enter your new password'}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = newPassword ? '' : 'Enter your new password'}
                    />
                </div>
                <button type="submit" className="change-button">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordChange;
