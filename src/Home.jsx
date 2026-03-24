import React, { Component } from "react";
import { ref, onValue, set } from "firebase/database";
import { FaWineBottle, FaArrowsAltV, FaCheckCircle, FaTrash } from "react-icons/fa";
import { database as db } from "./firebaseConfig";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottleCount: 0,
      trashDistance: 0,
      status: "OK",
    };

    this.MAX_BOTTLES = 20; // ✅ max limit
  }

  componentDidMount() {
    this.bottleRef = ref(db, "bottleCount");
    this.trashRef = ref(db, "trashDistance");
    this.statusRef = ref(db, "status");

    // Bottle Count Listener (with limit)
    this.unsubBottle = onValue(this.bottleRef, (snap) => {
      const value = snap.val() ?? 0;
      const limitedValue = Math.min(value, this.MAX_BOTTLES);

      this.setState({ bottleCount: limitedValue });
    });

    // Trash Distance Listener
    this.unsubTrash = onValue(this.trashRef, (snap) => {
      this.setState({ trashDistance: snap.val() ?? 0 });
    });

    // Status Listener
    this.unsubStatus = onValue(this.statusRef, (snap) => {
      this.setState({ status: snap.val() ?? "OK" });
    });
  }

  componentWillUnmount() {
    if (this.unsubBottle) this.unsubBottle();
    if (this.unsubTrash) this.unsubTrash();
    if (this.unsubStatus) this.unsubStatus();
  }

  clearBottleCount = async () => {
  await set(ref(db, "bottleCount"), 0);
  await set(ref(db, "reset"), true);
};

  render() {
    const { bottleCount, trashDistance, status } = this.state;
    const isFull = bottleCount >= this.MAX_BOTTLES;

    return (
      <div className="dashboard">

        {/* Bottle Count */}
        <div className="stat-box bottle-line">
          <FaWineBottle className="stat-icon" />
          <h3>Total Bottles</h3>

          <p>{bottleCount} / {this.MAX_BOTTLES}</p>

          <p className={isFull ? "full-text" : "normal-text"}>
            {isFull ? "FULL" : "Available"}
          </p>

          <button
            className="clear-btn"
            onClick={this.clearBottleCount}
            disabled={bottleCount === 0}
          >
            <FaTrash /> Clear
          </button>
        </div>

        {/* Trash Distance */}
        <div className="stat-box distance-line">
          <FaArrowsAltV className="stat-icon" />
          <h3>Trash Distance</h3>
          <p>{trashDistance} cm</p>
        </div>

        {/* Status */}
        <div className="stat-box status-line">
          <FaCheckCircle className="stat-icon" />
          <h3>Status</h3>
          <p>{status}</p>
        </div>

      </div>
    );
  }
}

export default Home;