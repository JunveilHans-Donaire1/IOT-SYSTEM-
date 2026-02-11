import "./App.css";

import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, database as db } from "./firebaseConfig";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [bottleCount, setBottleCount] = useState(0);
  const [trashDistance, setTrashDistance] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loggedIn) return;

    const bottleRef = ref(db, "/bottleCount");
    const trashRef = ref(db, "/trashDistance");
    const statusRef = ref(db, "/status");

    onValue(bottleRef, snap => setBottleCount(snap.val() ?? 0));
    onValue(trashRef, snap => setTrashDistance(snap.val() ?? 0));
    onValue(statusRef, snap => setStatus(snap.val() ?? "OK"));
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch {
      alert("Invalid admin credentials");
    }
  };

  const resetCount = () => {
    set(ref(db, "/bottleCount"), 0);
  };

  const logout = async () => {
    await signOut(auth);
    setLoggedIn(false);
  };

 if (!loggedIn) {
  return (
    <div className="container">
      <div className="card">
        <h2>Admin Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}


 return (
  <div className="container">
    <div className="card">
      <h1>Smart Bottle-Only Trash Bin</h1>

      <div className="dashboard">
        <div className="stat-box">
          <h3>Total Bottles</h3>
          <p>{bottleCount}</p>
        </div>

        <div className="stat-box">
          <h3>Trash Distance (cm)</h3>
          <p>{trashDistance}</p>
        </div>

        <div className="stat-box">
          <h3>Status</h3>
          <p>{status}</p>
        </div>
      </div>

      <div className="actions">
        <button className="reset-btn" onClick={resetCount}>
          Reset Bottle Count
        </button>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="status">
        Real-time data synced with Firebase
      </div>
    </div>
  </div>
);

}

export default App;
