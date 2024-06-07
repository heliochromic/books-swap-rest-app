import React from 'react';
import "./errorPage.css"

const ErrorPage = ({ error }) => {
    if (!error) return null;
    console.log(error)
    return (
        <div class="d-flex flex-column align-items-center justify-content-center vh-100">
            <div class="text-center">
                <h2>Error {error.response.status} {error.response.statusText}</h2>
                <p>{error.response.data.error}</p>
            </div>
            <div class="img-container">
                <img src="http://localhost:8000/media/8598876.jpg" alt="Error"></img>
            </div>
        </div>
    );
}
export default ErrorPage;