import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <RightSidebar />
      <div className="maindiv">
        <Outlet />
      </div>
    </>
  );
}

export default Dashboard;
