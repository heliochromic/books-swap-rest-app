import React, { useEffect, useState } from "react";
import axios from "axios";
import { getConfig } from "../../utils";
import RequestToMe from "./Cards/RequestToMe";
import MyRequest from "./Cards/MyRequest";
import ApprovedRequest from "./Cards/ApprovedRequest";
import RejectedRequest from "./Cards/RejectedRequest";
import {LoadingScreen} from "../../Header/LoadingScreen";

const RequestsSection = ({ requestType }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/requests/${requestType}/`,
                getConfig()
            );
            setRequests(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [requestType]);

    if (loading) {
        return <LoadingScreen></LoadingScreen>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div id="requestBlock">
            {requests.length > 0 ? (
                requests.map((request) => (
                    <React.Fragment key={request.requestID}>
                        {requestType === "requests_to_me" && (
                            <RequestToMe request={request} refreshRequests={fetchRequests} />
                        )}
                        {requestType === "my_requests" && (
                            <MyRequest request={request} refreshRequests={fetchRequests} />
                        )}
                        {requestType === "rejected" && (
                            <RejectedRequest request={request} refreshRequests={fetchRequests} />
                        )}
                        {requestType === "confirmed" && (
                            <ApprovedRequest request={request} refreshRequests={fetchRequests} />
                        )}
                    </React.Fragment>
                ))
            ) : (
                <p>No requests found.</p>
            )}
        </div>
    );
};

export default RequestsSection;
