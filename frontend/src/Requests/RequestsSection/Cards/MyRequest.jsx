import {Link} from "react-router-dom";
import React from "react";

const MyRequest = ({request}) => {
    return (
        <div className="card my-requests">
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
                </div>
                <div className="request-answer">Request is waiting for being approved</div>
            </div>
        </div>
    );
}

export default MyRequest;