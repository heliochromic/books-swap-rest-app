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
            Запити мені
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "my_requests" ? "active" : ""}`}
            onClick={() => setActiveTab("my_requests")}
          >
            Мої запити
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Відхилені
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn nav-link ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => setActiveTab("confirmed")}
          >
            Підтверджені
          </button>
        </li>
      </ul>

      <div className="requests-section">
        {activeTab === "requests_to_me" && <RequestsSection title="Запити мені" requestType="requests_to_me" />}
        {activeTab === "my_requests" && <RequestsSection title="Мої запити" requestType="my_requests" />}
        {activeTab === "rejected" && <RequestsSection title="Відхилені запити" requestType="rejected" />}
        {activeTab === "confirmed" && <RequestsSection title="Підтверджені запити" requestType="confirmed" />}
      </div>
    </div>
  );
};

export default Requests;
