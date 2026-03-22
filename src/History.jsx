import React, { Component } from "react";
import { ref, onValue, remove, set } from "firebase/database";
import { FaTrashAlt } from "react-icons/fa";
import { database as db } from "./firebaseConfig";
import "./History.css";

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      bottleHistory: [],
    };
  }

  componentDidMount() {
    this.historyRef = ref(db, "history");
    this.bottleHistoryRef = ref(db, "bottleHistory");

    this.unsubHistory = onValue(this.historyRef, (snap) => {
      const data = snap.val() ?? {};
      const arr = Object.keys(data)
        .map((key) => ({ firebaseKey: key, ...data[key] }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      this.setState({ history: arr });
    });

    this.unsubBottleHistory = onValue(this.bottleHistoryRef, (snap) => {
      const data = snap.val() ?? {};
      const arr = Object.keys(data)
        .map((key) => ({ firebaseKey: key, ...data[key] }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      this.setState({ bottleHistory: arr });
    });
  }

  componentWillUnmount() {
    if (this.unsubHistory) this.unsubHistory();
    if (this.unsubBottleHistory) this.unsubBottleHistory();
  }

  deleteHistoryItem = (key) => {
    remove(ref(db, `history/${key}`));
  };

  deleteBottleHistoryItem = async (key) => {
    await remove(ref(db, `bottleHistory/${key}`));
    await set(ref(db, "bottleCount"), 0);
  };

  render() {
    const { history, bottleHistory } = this.state;

    return (
      <div>
        <h2>History Log (Bin Full Events)</h2>

        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Distance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan="4">No history available</td></tr>
            ) : (
              history.map((event) => (
                <tr key={event.firebaseKey}>
                  <td>{event.timestamp}</td>
                  <td>{event.status}</td>
                  <td>{event.distance}</td>
                  <td>
                    <button onClick={() => this.deleteHistoryItem(event.firebaseKey)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h2>Bottle Insertion History</h2>

        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Bottle Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bottleHistory.length === 0 ? (
              <tr><td colSpan="3">No bottle insertion history</td></tr>
            ) : (
              bottleHistory.map((event) => (
                <tr key={event.firebaseKey}>
                  <td>{event.timestamp}</td>
                  <td>{event.bottleCount}</td>
                  <td>
                    <button onClick={() => this.deleteBottleHistoryItem(event.firebaseKey)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default History;