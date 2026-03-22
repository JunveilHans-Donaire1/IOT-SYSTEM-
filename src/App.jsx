import React, { Component } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loading: true,
    };
  }

  componentDidMount() {
    // Check auth state
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({
        loggedIn: !!user,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    // Cleanup listener
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setLoggedIn = (value) => {
    this.setState({ loggedIn: value });
  };

  render() {
    const { loggedIn, loading } = this.state;

    // Loading screen
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
           /* background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",*/
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              borderTopColor: "white",
              animation: "spin 1s ease-in-out infinite",
            }}
          ></div>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    return (
      <>
        {!loggedIn ? (
          <Login setLoggedIn={this.setLoggedIn} />
        ) : (
          <Dashboard setLoggedIn={this.setLoggedIn} />
        )}
      </>
    );
  }
}

export default App;