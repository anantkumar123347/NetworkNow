import React from "react";
import "./NavbarHome.css";
import { useNavigate } from "react-router-dom";

function NavbarHome() {
  const navigate = useNavigate();
  return (
    <nav className="navbarHome">
      <h1 className="navbarTitle">Connect Now</h1>
      <button 
        className="navbarButton" 
        onClick={() => navigate("/register")}
      >
        Be a part
      </button>
    </nav>
  );
}

export default NavbarHome;