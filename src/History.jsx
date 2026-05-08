

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

      // ✅ NEW STATE
      collections: [],
    };
  }

  componentDidMount() {
    this.historyRef = ref(db, "history");
    this.bottleHistoryRef = ref(db, "bottleHistory");

    // ✅ NEW REF
    this.collectionsRef = ref(db, "collections");

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

    // ✅ NEW LISTENER (collections)
    this.unsubCollections = onValue(this.collectionsRef, (snap) => {
      const data = snap.val() ?? {};
      const arr = Object.keys(data)
        .map((key) => ({ firebaseKey: key, ...data[key] }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      this.setState({ collections: arr });
    });
  }

  componentWillUnmount() {
    if (this.unsubHistory) this.unsubHistory();
    if (this.unsubBottleHistory) this.unsubBottleHistory();

    // ✅ CLEANUP
    if (this.unsubCollections) this.unsubCollections();
  }

  deleteHistoryItem = (key) => {
    remove(ref(db, `history/${key}`));
  };

  deleteBottleHistoryItem = async (key) => {
    await remove(ref(db, `bottleHistory/${key}`));
    await set(ref(db, "bottleCount"), 0);
  };

  // ✅ OPTIONAL DELETE (collections)
  deleteCollectionItem = (key) => {
    remove(ref(db, `collections/${key}`));
  };

  render() {
    const { history, bottleHistory, collections } = this.state;

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

        {/* ✅ NEW TABLE */}
        <h2>Collection History (Admin Input)</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bottles Collected</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr><td colSpan="3">No collection data</td></tr>
            ) : (
              collections.map((item) => (
                <tr key={item.firebaseKey}>
                  <td>{item.timestamp}</td>
                  <td>{item.bottles}</td>
                  <td>
                    <button onClick={() => this.deleteCollectionItem(item.firebaseKey)}>
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



