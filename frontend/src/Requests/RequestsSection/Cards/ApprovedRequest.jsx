import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getConfig } from "../../../utils";
import {LoadingScreen} from "../../../Header/LoadingScreen";

const ApprovedRequest = ({ request }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/profile/${request.sender_book.userID}`, getConfig());
                console.log(response.data)
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching user profile");
                setLoading(false);
            }
        };

        fetchUser();
    }, [request.sender_book.userID]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`card approved-requests ${isExpanded ? "expanded" : ""}`}>
            <div className="card-body swapContainer">
                <div className="request-body">
                    <div className="book-info">
                        <div className="image-crop tiny">
                            <span
                                className="image-preview tiny"
                                style={{
                                    backgroundImage: `url(http://localhost:8000/${request.receiver_book.photo})`,
                                }}
                            />
                        </div>
                        <Link className="book-info-text" to={`/catalog/${request.receiver_book.itemID}`}>
                            <h5>{request.receiver_book.title}</h5>
                            <p>Автор: {request.receiver_book.author}</p>
                        </Link>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" transform="matrix(0 -1 1 0 0 24)"/>
                        <g fill="#231f20">
                            <path
                                d="m4 9h13l-1.6 1.2a1 1 0 0 0 -.2 1.4 1 1 0 0 0 .8.4 1 1 0 0 0 .6-.2l4-3a1 1 0 0 0 0-1.59l-3.86-3a1 1 0 0 0 -1.23 1.58l1.57 1.21h-13.08a1 1 0 0 0 0 2z"/>
                            <path
                                d="m20 16h-13l1.6-1.2a1 1 0 0 0 -1.2-1.6l-4 3a1 1 0 0 0 0 1.59l3.86 3a1 1 0 0 0 .61.21 1 1 0 0 0 .79-.39 1 1 0 0 0 -.17-1.4l-1.57-1.21h13.08a1 1 0 0 0 0-2z"/>
                        </g>
                    </svg>
                    <div className="book-info">
                        <div className="image-crop tiny">
                            <span
                                className="image-preview tiny"
                                style={{
                                    backgroundImage: `url(http://localhost:8000/${request.sender_book.photo})`,
                                }}
                            />
                        </div>
                        <Link className="book-info-text" to={`/catalog/${request.sender_book.itemID}`}>
                            <h5>{request.sender_book.title}</h5>
                            <p>Автор: {request.sender_book.author}</p>
                        </Link>
                    </div>
                    <div className="request-answer">
                        <div>
                            <strong>Contacts:</strong>
                        </div>
                       <div>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : user ? (
                                     <Link to={`/user/${user.userID}`}>
                                    <div>
                                        <p>Name: {user.first_name} {user.last_name}</p>
                                        <p>Phone: {user.phone_number}</p>
                                    </div>
                                         </Link>
                                ) : (
                                    <p>No user data available.</p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovedRequest;
