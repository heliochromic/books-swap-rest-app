import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Offcanvas.css";
import Request from "./Request/Request";

const Offcanvas = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                };

                const response = await axios.get('http://localhost:8000/api/requests/', config);
                console.log(response)
                setRequests(response.data);
            } catch (error) {
                setError("Failed to fetch requests.");
            }
        };

        fetchRequests();
    }, []);

    return (
        <section className="offcanvasContainer">
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptions">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptions">Backdrop with scrolling</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <Request key={request.requestID} requestID={request.requestID} />
                        ))
                    ) : (
                        <p>No requests found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Offcanvas;
