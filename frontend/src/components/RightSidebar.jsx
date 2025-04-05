import React, { useEffect, useState } from "react";
import "./RightSidebar.css";

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/get_all_users");
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
            <li key={user._id}>
              <img src={user.profilePicture} alt={user.name} className="avatar" />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default RightSidebar;
