import React, {useEffect, useState} from "react";
import axios from "axios";
import {getConfig} from "../../utils";

const RequestsSection = ({title, requestType}) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/requests/${requestType}/`, getConfig());
                console.log(response.data)
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRequests().then(e => console.log(e));
    }, [requestType]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="requestBlock">
            {requests.length > 0 ? (
                requests.map((request) => (
                    <div key={request.id} className="request-item">
                        <p>{request.requestID}</p>
                    </div>
                ))
            ) : (
                <p>No requests found.</p>
            )}
        </div>
    );
};

export default RequestsSection;
