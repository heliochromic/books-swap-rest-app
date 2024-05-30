import React, {useState} from 'react';
import axios from 'axios';

const Request = ({requestID}) => {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleResponse = async (requestStatus) => {
        try {
            const token = sessionStorage.getItem('token');

            const config = {
                headers: {
                    'Authorization': `Token ${token}`
                }
            };

            const response = await axios.put(`http://localhost:8000/api/requests/${+requestID}`, {
                status: requestStatus
            }, config);
            console.log(response.data)

            setStatus(response.data.status);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="card w-100">
            <div className="card-body">
                <h5 className="card-title">Request ID: {requestID}</h5>
                <p className="card-text">
                    {status ? `Status: ${status}` : "Pending approval or rejection."}
                </p>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <button
                    onClick={() => handleResponse("A")}
                    className="btn btn-primary m-2"
                >
                    Approve
                </button>
                <button
                    onClick={() => handleResponse("R")}
                    className="btn btn-danger"
                >
                    Decline
                </button>
            </div>
        </div>
    );
}

export default Request;
