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
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordChange;
