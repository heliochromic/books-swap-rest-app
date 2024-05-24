import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Catalog from '../Catalog/Catalog';
import Profile from '../Profile/Profile';
import Map from '../Map/Map';
import LoginPage from "../Login/LoginPage";
import './Header.css';
import axios from "axios";

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};
const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the token is present in session storage
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);


    const handleLogout = async () => {
        try {
            // Get CSRF token from cookies
            const csrftoken = getCookie('csrftoken');
            const authToken = sessionStorage.getItem('token');
            // Include CSRF token in headers
            const headers = {
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${authToken}`
            };

            // Send POST request to logout endpoint
            await axios.post('http://localhost:8000/api/logout/', {}, {headers});
            sessionStorage.removeItem('token');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
        // Clear session storage
        sessionStorage.clear();
        // Redirect to home page
        window.location.href = '/';
    };

    return (
        <Router>
            <header>
                <h2>Logo</h2>
                <nav>
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <div>
                        <Link to="/catalog">Catalog</Link>
                    </div>
                    <div>
                        <Link to="/profile">Profile</Link>
                    </div>
                    <div>
                        <Link to="/map">Map</Link>
                    </div>
                    {!isAuthenticated && (
                        <div>
                            <Link to="/login">Log In</Link>
                        </div>
                    )}
                    {isAuthenticated && (
                        <div>
                            <Link to="/" onClick={handleLogout}>Logout</Link>
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <section>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/catalog" element={<Catalog/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/map" element={<Map/>}/>
                        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated}/>}/>
                    </Routes>
                </section>
            </main>
        </Router>
    );
};

export default Header;
