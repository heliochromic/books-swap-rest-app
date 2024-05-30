import {Link} from "react-router-dom";
import React from "react";

const AddBookBadge = () => {
    return (

        <Link to="/catalog/add">
            <div id="newBookBadge" className="card text-bg-dark mb-3">
                <div className="card-body p-3">
                    <h5 className="card-title">Wanna add new book?</h5>
                    <p className="card-text">So just click here</p>
                </div>
            </div>
        </Link>
    );
};

export default AddBookBadge;