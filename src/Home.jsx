import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { FaWineBottle, FaArrowsAltV, FaCheckCircle } from "react-icons/fa";
import { database as db } from "./firebaseConfig";

function Home() {
  const [bottleCount, setBottleCount] = useState(0);
  const [trashDistance, setTrashDistance] = useState(0);
  const [status, setStatus] = useState("OK");

  useEffect(() => {
    const bottleRef = ref(db, "bottleCount");
    const trashRef = ref(db, "trashDistance");
    const statusRef = ref(db, "status");

    const unsubBottle = onValue(bottleRef, snap => setBottleCount(snap.val() ?? 0));
    const unsubTrash = onValue(trashRef, snap => setTrashDistance(snap.val() ?? 0));
    const unsubStatus = onValue(statusRef, snap => setStatus(snap.val() ?? "OK"));

    return () => {
      unsubBottle();
      unsubTrash();
      unsubStatus();
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="stat-box">
        <FaWineBottle className="stat-icon" />
        <h3>Total Bottles</h3>
        <p>{bottleCount}</p>
      </div>
      <div className="stat-box">
        <FaArrowsAltV className="stat-icon" />
        <h3>Trash Distance</h3>
        <p>{trashDistance} cm</p>
      </div>
      <div className="stat-box">
        <FaCheckCircle className="stat-icon" />
        <h3>Status</h3>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default Home;