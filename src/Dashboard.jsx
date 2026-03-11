import React, { useState } from "react";
import Home from "./Home.jsx";
import History from "./History.jsx";
import { FaHome, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import "./Dashboard.css";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload(); // Go back to login
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "history":
        return <History />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="nav-bar">
        <button onClick={() => setCurrentPage("home")}>
          <FaHome /> Home
        </button>
        <button onClick={() => setCurrentPage("history")}>
          <FaHistory /> History
        </button>
        <button onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="page-container">{renderPage()}</div>
    </div>
  );
}

export default Dashboard;