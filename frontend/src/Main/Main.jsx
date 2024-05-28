import React from 'react';
import {Routes, Route} from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Catalog from '../Catalog/Catalog';
import Profile from '../Profile/Profile';
import Map from '../Map/Map';
import LoginPage from "../Login/LoginPage";

import BookItemPage from "../Catalog/BookItemPage/BookItemPage";
import SignUpPage from "../SignUp/SignUpPage";
import AddBookPage from "../AddBookPage/AddBookPage";

const Main = ({setIsAuthenticated}) => {
    return (
        <main>
            <section>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/catalog" element={<Catalog/>}/>
                    <Route path="/catalog/:id" element={<BookItemPage/>}/>
                    <Route path="/catalog/add" element={<AddBookPage/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/map" element={<Map/>}/>
                    <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated}/>}/>
                    <Route path="/signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated}/>}/>
                </Routes>
            </section>
        </main>
    );
};

export default Main;
