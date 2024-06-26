import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import './Header.css';
import axios from "axios";
import Main from '../Main/Main';
import {getConfig} from '../utils';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            checkForAdmin();
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            checkForAdmin();
        }
    }, [isAuthenticated]);

    const checkForAdmin = async () => {
        try {

            const response = await axios.get(`http://localhost:8000/api/user/`, getConfig());
            setIsAdmin(response.data.djuser.is_staff);
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout/', getConfig());
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
        }
        sessionStorage.clear();
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <Router>
            <nav className="navbar navbar-secondary navbar-expand-lg mt-1">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <h2 id="logo">
                            <i>svvap</i>
                        </h2>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {isAuthenticated && <li className="nav-item mx-2">
                                <Link to="/catalog">Catalog</Link>
                            </li>}
                            {isAuthenticated && <li className="nav-item mx-2">
                                <Link to="/profile">Profile</Link>
                            </li>}
                            {isAuthenticated && <li className="nav-item mx-2">
                                <Link to="/map">Map</Link>
                            </li>}
                            {isAuthenticated &&
                                <li className="nav-item mx-2">
                                    <Link to="/requests">Requests</Link>
                                </li>}
                            {isAuthenticated && isAdmin &&
                                <li className="nav-item mx-2">
                                    <Link to="/visualizations">Statistics</Link>
                                </li>}
                            {isAuthenticated && <li className="nav-item mx-2">
                                <Link to="/" onClick={handleLogout}>Logout</Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>
            <Main isAdmin={isAdmin} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        </Router>
    );
};

export default Header;
