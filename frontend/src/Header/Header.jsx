import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import HomePage from './HomePage';
import Catalog from './Catalog';
import Profile from './Profile';
import Map from './Map';

const Header = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/catalog">Catalog</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/map">Map</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/catalog" component={Catalog} />
                <Route path="/profile" component={Profile} />
                <Route path="/map" component={Map} />
            </Switch>
        </Router>
    );
};

export default Header;
