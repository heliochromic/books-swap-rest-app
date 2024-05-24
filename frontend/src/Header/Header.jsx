import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Catalog from '../Catalog/Catalog';
import Profile from '../Profile/Profile';
import Map from '../Map/Map';

const Header = () => {
    return (
        <Router>
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
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/map" element={<Map />} />
            </Routes>
        </Router>
    );
};

export default Header;
