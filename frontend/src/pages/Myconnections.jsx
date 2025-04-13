import React, { useState, useEffect } from "react";
import "./Myconnections.css";

function MyConnections() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const fetchRequests = async () => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/user/getConnectionRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
        console.log(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching connection requests", error);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/user/user_connection_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        setConnections(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching connections", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/user/accept_connection_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          requestId,
          action_type: "accept",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(requests.filter((request) => request._id !== requestId));
        fetchConnections();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error accepting connection request", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch("https://networknow-1.onrender.com/user/accept_connection_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          requestId,
          action_type: "reject",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(requests.filter((request) => request._id !== requestId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error rejecting connection request", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
      fetchConnections();
    }
  }, [token]);

  return (
    <div className="connections-wrapper">
      <h1>Connection Requests</h1>
      <div className="request-list">
        {requests.length === 0 ? (
          <p>No new connection requests</p>
        ) : (
          requests.map((request) => (
            <div className="request-item" key={request._id}>
              <img
                src={request.userId.profilePicture}
                alt="profile"
                className="profile-image"
              />
              <div className="request-details">
                <h3>{request.userId.name}</h3>
                <p>@{request.userId.username}</p>
              </div>
              <div className="request-actions">
                <button className="accept-btn" onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                <button className="reject-btn" onClick={() => handleRejectRequest(request._id)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h1>My Connections</h1>
      <div className="connection-list">
        {connections.length === 0 ? (
          <p>No connections yet</p>
        ) : (
          connections.map((connection) => (
            <div className="connection-item" key={connection._id}>
              <img
                src={connection.userId.profilePicture}
                alt="profile"
                className="profile-image"
              />
              <div className="connection-details">
                <h3>{connection.userId.name}</h3>
                <p>@{connection.userId.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyConnections;
