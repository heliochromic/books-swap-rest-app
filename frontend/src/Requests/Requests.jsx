import React, { useState } from "react";
import RequestsSection from "./RequestsSection/RequestsSection";
import './Requests.css'

const Requests = () => {
  const [activeTab, setActiveTab] = useState("requests_to_me");

  return (
    <div className="container" id="requestsContainer">
      <ul className="nav nav-pills" id="requestsNavbar">
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "requests_to_me" ? "active" : ""}`}
            onClick={() => setActiveTab("requests_to_me")}
          >
            Incoming
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "my_requests" ? "active" : ""}`}
            onClick={() => setActiveTab("my_requests")}
          >
            Sent
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => setActiveTab("confirmed")}
          >
            Approved
          </button>
        </li>
      </ul>

      <div className="requests-section">
        {activeTab === "requests_to_me" && <RequestsSection requestType="requests_to_me" />}
        {activeTab === "my_requests" && <RequestsSection requestType="my_requests" />}
        {activeTab === "rejected" && <RequestsSection requestType="rejected" />}
        {activeTab === "confirmed" && <RequestsSection requestType="confirmed" />}
      </div>
    </div>
  );
};

export default Requests;
