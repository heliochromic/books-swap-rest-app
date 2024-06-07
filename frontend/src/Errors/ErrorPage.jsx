import React from 'react';
import "./errorPage.css"

const ErrorPage = ({ error }) => {
    if (!error) return null;
    console.log(error)
    return (
        <div className="d-flex flex-column align-items-center justify-content-center pt-5">
            <div className="text-center">
                <h2>Error {error.response.status} {error.response.statusText}</h2>
                <p>{error.response.data.error}</p>
            </div>
            <div className="img-container">
                <img src="http://localhost:8000/media/8598876.jpg" alt="Error"></img>
            </div>
        </div>
    );
}
export default ErrorPage;