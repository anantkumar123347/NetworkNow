import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h1>Connect Now</h1>
      <div className="navbar-buttons">
      <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
        <button 
          className="logout" 
          onClick={() => {
            localStorage.removeItem("token");
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
