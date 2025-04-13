import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaUsers } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <FaHome className="icon" /> Scroll
          </Link>
        </li>
        <li>
          <Link to="/dashboard/discover">
            <FaSearch className="icon" /> Discover
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaUsers className="icon" /> My Connections
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
