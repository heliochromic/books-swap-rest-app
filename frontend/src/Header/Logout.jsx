import React from 'react';
import axios from 'axios';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            // Get CSRF token from cookies
            const csrftoken = getCookie('csrftoken');

            // Include CSRF token in headers
            const headers = {
                'X-CSRFToken': csrftoken
            };

            // Send POST request to logout endpoint
            await axios.post('http://localhost:8000/api/logout/', {}, { headers });

            // Optionally, perform any additional logout actions (e.g., clear local storage, redirect)
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Function to get CSRF token from cookies
    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;