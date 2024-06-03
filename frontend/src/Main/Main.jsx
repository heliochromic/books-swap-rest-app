import React from 'react';
import {Routes, Route} from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Catalog from '../Catalog/Catalog';
import Profile from '../Profile/Profile';
import Map from '../Map/Map';
import LoginPage from "../Login/LoginPage";

import BookItemPage from "../BookItemPage/BookItemPage";
import SignUpPage from "../SignUp/SignUpPage";
import AddBookPage from "../AddBookPage/AddBookPage";
import UserProfile from "../UserProfile/UserProfile";
import PasswordChangePage from "../Profile/PasswordChange/PasswordChangePage";
import Requests from "../Requests/Requests";

const Main = ({isAuthenticated, setIsAuthenticated}) => {
    return (
        <main>
            <section id="content-section">
                <Routes>
                    <Route path="/" element={<HomePage isAuthenticated={isAuthenticated}/>}/>
                    <Route path="/catalog" element={<Catalog/>}/>
                    <Route path="/catalog/:id" element={<BookItemPage/>}/>
                    <Route path="/catalog/add" element={<AddBookPage/>}/>
                    <Route path="/profile" element={<Profile setIsAuthenticated={setIsAuthenticated}/>}/>
                    <Route path="/map" element={<Map/>}/>
                    <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated}/>}/>
                    <Route path="/signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated}/>}/>
                    <Route path="/requests" element={<Requests/>}/>
                    <Route path="/user/:id" element={<UserProfile/>}/>
                    <Route path="/password-change" element={<PasswordChangePage/>}/>
                </Routes>
            </section>
        </main>
    );
};

export default Main;
