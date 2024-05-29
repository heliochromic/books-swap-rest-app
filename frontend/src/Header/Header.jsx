import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import Main from '../Main/Main';
import Offcanvas from "../Offcanvas/Offcanvas";

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
};

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const csrftoken = getCookie('csrftoken');
            const authToken = sessionStorage.getItem('token');
            const headers = {
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${authToken}`
            };

            await axios.post('http://localhost:8000/api/logout/', {}, {headers});
            sessionStorage.removeItem('token');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
        sessionStorage.clear();
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
            <Main setIsAuthenticated={setIsAuthenticated}/>
        </Router>
    );
};

export default Header;
