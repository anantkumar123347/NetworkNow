import React from "react";
import "./NavbarHome.css";
import { useNavigate } from "react-router-dom";
function NavbarHome() {
  const navigate=useNavigate();
  return (
    <nav>
      <h1>Connect Now</h1>
      <button onClick={()=>{
        navigate('/register')
      }}>Be a part</button>
    </nav>
  );
}

export default NavbarHome;
