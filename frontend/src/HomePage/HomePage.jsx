import React from 'react';
import './HomePage.css';
import {Link} from "react-router-dom";

const HomePage = (isAuthenticated) => {
    return (
        <div id="landing-page">
            <div className="row">
                <div className="col-lg-7 main-banner"></div>
                <div className="col-lg-5 col-md-12 px-5 pb-5 my-auto">
                    <h2><i>svvap</i></h2>
                    <h6><i>Your Community for Sharing and Discovering Books!</i></h6>
                    {!isAuthenticated.isAuthenticated && <div className="mt-4">
                        <Link to="/signup">
                            <button type="button" className="btn btn-primary mx-2">Sign Up</button>
                        </Link>
                        <Link to="/login">
                            <button type="button" className="btn btn-outline-secondary">Log In</button>
                        </Link>
                    </div>}
                    {isAuthenticated.isAuthenticated && <div className="mt-4">
                        <Link to="/catalog">
                            <button type="button" className="btn btn-primary mx-2">Catalog</button>
                        </Link>
                        <Link to="/catalog/add">
                            <button type="button" className="btn btn-outline-secondary">Add new book</button>
                        </Link>
                    </div>}
                </div>

            </div>
        </div>
    );
}

export default HomePage;
