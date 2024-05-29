import React from 'react';
import axios from 'axios';
import {getConfig} from "../utils";

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout/', {}, getConfig());
            sessionStorage.removeItem('token');

            sessionStorage.clear();

        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onSubmit={handleLogout}>Logout</button>
    );
};