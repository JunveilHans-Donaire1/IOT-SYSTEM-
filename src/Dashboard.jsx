import React, { Component } from "react";
import Home from "./Home.jsx";
import History from "./History.jsx";
import Profile from "./Profile.jsx";
import { FaHome, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import { getDatabase, ref, set } from "firebase/database";
import "./Dashboard.css";
import logo from "./assets/smartlogo.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",
    };
  }

  // 🔥 LOGOUT
  handleLogout = async () => {
    try {
      await signOut(auth);
      this.props.setLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 🔁 CHANGE PAGE
  setPage = (page) => {
    this.setState({ currentPage: page });
  };

  // 🔄 RESET BOTTLE COUNT
  handleClear = () => {
    const db = getDatabase();
    set(ref(db, "resetCount"), true);
  };

  // 📄 RENDER PAGE
  renderPage = () => {
    switch (this.state.currentPage) {
      case "home":
        return <Home onClear={this.handleClear} />;
      case "history":
        return <History />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  render() {
    const { currentPage } = this.state;

    return (
      <div className="dashboard-container">
        <nav className="nav-bar">

          <div className="logo-container">
            <div className="logo-bg"> {/* para ni sa logo nga mabutngan white bg */}
            <img src={logo} alt="Logo" className="logo" />
            </div>
            <h2 className="app-name">Smart Trash Bin</h2>
          </div>

          <div className="nav-buttons">
            <button
              onClick={() => this.setPage("home")}
              className={currentPage === "home" ? "active" : ""}
            >
              <FaHome /> Home
            </button>

            <button
              onClick={() => this.setPage("history")}
              className={currentPage === "history" ? "active" : ""}
            >
              <FaHistory /> History
            </button>

            <button
              onClick={() => this.setPage("profile")}
              className={currentPage === "profile" ? "active" : ""}
            >
              <FaUser /> Profile
            </button>
          </div>

          <button onClick={this.handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </nav>

        <div className="page-container">
          {this.renderPage()}
        </div>
      </div>
    );
  }
}

export default Dashboard;