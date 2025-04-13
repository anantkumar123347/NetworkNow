import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RightSidebar.css";

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("https://networknow-1.onrender.com/user/get_all_users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="right-sidebar">
      <h2>Profiles</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className="clickable-profile"
            onClick={() => navigate(`discover/user-profile/${user._id}`)}
          >
            <img src={user.profilePicture} alt={user.name} className="avatar" />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
