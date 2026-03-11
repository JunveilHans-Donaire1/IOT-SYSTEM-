import React, { useState } from "react";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;