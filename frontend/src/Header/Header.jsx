import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Catalog from '../Catalog';
import Profile from '../Profile/Profile';
import Map from '../Map/Map';
import LoginPage from "../Login/LoginPage";
import LogoutButton from "./Logout";

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
                <div>
                    <Link to="/login">Log In</Link>
                </div>
                 <LogoutButton />
            </nav>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/map" element={<Map />} />
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </Router>
    );
};

export default Header;
