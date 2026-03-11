import React, { useEffect, useState } from "react";
import { ref, onValue, remove, set } from "firebase/database";
import { FaTrashAlt } from "react-icons/fa";
import { database as db } from "./firebaseConfig";
import "./History.css"; // Import the CSS file



function History() {
  const [history, setHistory] = useState([]);
  const [bottleHistory, setBottleHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(db, "history");
    const bottleHistoryRef = ref(db, "bottleHistory");

    const unsubHistory = onValue(historyRef, snap => {
      const data = snap.val() ?? {};
      const arr = Object.keys(data)
        .map(key => ({ firebaseKey: key, ...data[key] }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHistory(arr);
    });

    const unsubBottleHistory = onValue(bottleHistoryRef, snap => {
      const data = snap.val() ?? {};
      const arr = Object.keys(data)
        .map(key => ({ firebaseKey: key, ...data[key] }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setBottleHistory(arr);
    });

    return () => {
      unsubHistory();
      unsubBottleHistory();
    };
  }, []);

  const deleteHistoryItem = key => remove(ref(db, `history/${key}`));
  const deleteBottleHistoryItem = async key => {
    await remove(ref(db, `bottleHistory/${key}`));
    await set(ref(db, "bottleCount"), 0);
  };

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
            history.map(event => (
              <tr key={event.firebaseKey}>
                <td>{event.timestamp}</td>
                <td>{event.status}</td>
                <td>{event.distance}</td>
                <td>
                  <button onClick={() => deleteHistoryItem(event.firebaseKey)}>
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
            bottleHistory.map(event => (
              <tr key={event.firebaseKey}>
                <td>{event.timestamp}</td>
                <td>{event.bottleCount}</td>
                <td>
                  <button onClick={() => deleteBottleHistoryItem(event.firebaseKey)}>
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

export default History;