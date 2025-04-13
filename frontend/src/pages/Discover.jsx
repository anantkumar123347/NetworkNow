import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Discover.css";

function Discover() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/get_all_users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="discover-container">
      <h2>Discover People</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div
            key={user._id}
            className="user-card"
            onClick={() => navigate(`user-profile/${user._id}`)} // ✅ fixed this line
          >
            <img
              src={user.profilePicture}
              alt={user.name}
              className="user-avatar"
            />
            <h4>{user.name}</h4>
            <p>@{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
