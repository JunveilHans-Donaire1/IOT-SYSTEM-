import React, { Component } from "react";
import Home from "./Home.jsx";
import History from "./History.jsx";
import Profile from "./Profile.jsx";
import { FaHome, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import "./Dashboard.css";
import logo from "./assets/smartlogo.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",

      // ✅ FORM STATE
      collectionDate: "",
      bottleCount: "",

      // ✅ SENSOR STATE (NEW)
      ultrasonic: {
        detection_status: "Unknown",
        status: "Inactive"
      },
      ir: {
        detection_status: "Unknown",
        status: "Inactive"
      }
    };
  }

  // 🔔 LISTEN FOR FULL STATUS + SENSOR DATA
  componentDidMount() {
    const db = getDatabase();

    // ✅ FULL STATUS ALERT (UNCHANGED)
    this.statusRef = ref(db, "status");
    this.unsubscribeStatus = onValue(this.statusRef, (snapshot) => {
      const status = snapshot.val();

      if (status === "FULL") {
        alert("⚠️ Trash Bin is FULL! Please collect now.");
      }
    });

    // ✅ SENSOR LISTENER (NEW)
    this.sensorRef = ref(db, "sensorData");
    this.unsubscribeSensor = onValue(this.sensorRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        this.setState({
          ultrasonic: data.ultrasonic || {},
          ir: data.ir || {}
        });
      }
    });
  }

  // 🧹 CLEANUP
  componentWillUnmount() {
    if (this.unsubscribeStatus) this.unsubscribeStatus();
    if (this.unsubscribeSensor) this.unsubscribeSensor();
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

  // ✅ HANDLE INPUT
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // ✅ SAVE COLLECTION
  handleSaveCollection = () => {
    const db = getDatabase();
    const { collectionDate, bottleCount } = this.state;

    if (!collectionDate || !bottleCount) {
      alert("Please fill all fields!");
      return;
    }

    const newRef = push(ref(db, "collections"));

    set(newRef, {
      date: collectionDate,
      bottles: bottleCount
    })
      .then(() => {
        alert("Completed!");
        this.setState({
          collectionDate: "",
          bottleCount: ""
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSubmit = () => {
    const { collectionDate } = this.state;
    const timestamp = new Date(collectionDate).getTime();

    console.log("Timestamp:", timestamp);
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
    const { currentPage, collectionDate, bottleCount, ultrasonic, ir } = this.state;

    return (
      <div className="dashboard-container">
        <nav className="nav-bar">
          <div className="logo-container">
            <div className="logo-bg">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h2 className="app-name">Admin Dashboard</h2>
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

          {/* ✅ COLLECTION FORM */}
          {currentPage === "home" && (
            <>
              <div className="collection-form">
                <h3>Schedule Collection</h3><br />

                <input
                  type="date"
                  name="collectionDate"
                  value={collectionDate}
                  onChange={this.handleInputChange}
                />

                <input
                  type="number"
                  name="bottleCount"
                  placeholder="Number of bottles"
                  value={bottleCount}
                  onChange={this.handleInputChange}
                />

                <button onClick={this.handleSaveCollection}>
                  Save Collection
                </button>
              </div>

              {/* ✅ SENSOR MONITORING (NEW) */}
              <div className="sensor-status">
             
        
                <div className="sensor-card">
                  <h4>Ultrasonic Sensor</h4>
                  <p>Detection: {ultrasonic.detection_status}</p>
                  <p>Status: {ultrasonic.status}</p>
                </div>

                <div className="sensor-card">
                  <h4>IR Sensor</h4>
                  <p>Detection: {ir.detection_status}</p>
                  <p>Status: {ir.status}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;