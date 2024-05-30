import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import Main from '../Main/Main';
import {getConfig} from '../utils'
import Offcanvas from "../Offcanvas/Offcanvas";



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
            const config = getConfig()
            // Send POST request to logout endpoint
            await axios.post('http://localhost:8000/api/logout/', {}, config);
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
                    {isAuthenticated && <div>
                        <Link to="/catalog">Catalog</Link>
                    </div>}
                    {isAuthenticated && <div>
                        <Link to="/profile">Profile</Link>
                    </div>}
                    {isAuthenticated && <div>
                        <Link to="/map">Map</Link>
                    </div>}

                    {isAuthenticated && (
                        <>
                            <div className="offcanvasButton" type="button" data-bs-toggle="offcanvas"
                                 data-bs-target="#offcanvasWithBothOptions"
                                 aria-controls="offcanvasWithBothOptions"
                                 title="Open Offcanvas">
                                Requests
                            </div>
                            <Offcanvas/>
                        </>
                    )}

                    {!isAuthenticated && (
                        <div className="login-ref">
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
            <Main setIsAuthenticated={setIsAuthenticated}/>
        </Router>
    );
};

export default Header;
