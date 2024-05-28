import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

const AddBookBadge = () => {
    return (
        <Link to="/catalog/add">
            <div className="card text-bg-dark mb-3 newBookBadge">
                <div className="card-body p-3">
                    <h5 className="card-title">Wanna add new book?</h5>
                    <p className="card-text">So just click here</p>
                </div>
            </div>
        </Link>
    );
};

export default AddBookBadge;