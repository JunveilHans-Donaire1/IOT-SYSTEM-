
import React, { Component } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "./assets/smartlogo.png";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showReset: false,
      resetEmail: "",
      showPassword: false,
      isLoading: false,
      error: "",
      successMessage: "",
      touchedFields: {
        email: false,
        password: false,
        resetEmail: false,
      },
    };
  }

  validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

 validatePassword = (password) => password.length >= 8 && password.length <= 12;

  handleBlur = (field) => {
    this.setState((prevState) => ({
      touchedFields: { ...prevState.touchedFields, [field]: true },
    }));
  };

  getFieldError = (field, value) => {
    const { touchedFields } = this.state;
    if (!touchedFields[field]) return null;

    switch (field) {
      case "email":
      case "resetEmail":
        return !this.validateEmail(value) ? "Please enter a valid email address" : null;
      case "password":
        return !this.validatePassword(value)
          ? "Password must be 8 to 12 characters"
          : null;
      default:
        return null;
    }
  };

  handleLogin = async (e) => {
    e.preventDefault();
    this.setState({ error: "" });
    const { email, password } = this.state;

    if (!this.validateEmail(email)) {
      this.setState({ error: "Please enter a valid email address" });
      return;
    }

    if (!this.validatePassword(password)) {
      this.setState({ error: "Password must be at least 6 characters" });
      return;
    }

    this.setState({ isLoading: true });

    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.props.setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          this.setState({ error: "Invalid email or password" });
          break;
        case "auth/too-many-requests":
          this.setState({ error: "Too many failed attempts. Please try again later." });
          break;
        default:
          this.setState({ error: "Login failed. Please try again." });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleResetPassword = async (e) => {
    e.preventDefault();
    this.setState({ error: "" });
    const { resetEmail } = this.state;

    if (!this.validateEmail(resetEmail)) {
      this.setState({ error: "Please enter a valid email address" });
      return;
    }

    this.setState({ isLoading: true });

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      this.setState({ successMessage: "Password reset link sent! Check your email." });

      setTimeout(() => {
        this.setState({ showReset: false, successMessage: "" });
      }, 3000);
    } catch (error) {
      console.error("Reset error:", error);
      if (error.code === "auth/user-not-found") {
        this.setState({ error: "No account found with this email" });
      } else {
        this.setState({ error: "Failed to send reset email. Please try again." });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      email,
      password,
      showReset,
      resetEmail,
      showPassword,
      isLoading,
      error,
      successMessage,
    } = this.state;

    if (showReset) {
      return (
        <div className="container-login">
          <div className="card-login">
            <h2>Reset Password</h2>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={this.handleResetPassword}>
              <div
                className={`input-group ${
                  this.getFieldError("resetEmail", resetEmail) ? "error" : ""
                }`}
              >
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => this.setState({ resetEmail: e.target.value })}
                  onBlur={() => this.handleBlur("resetEmail")}
                  required
                  disabled={isLoading}
                />
              </div>

              {this.getFieldError("resetEmail", resetEmail) && (
                <div className="error-message">
                  {this.getFieldError("resetEmail", resetEmail)}
                </div>
              )}

              <button type="submit" disabled={isLoading} className={isLoading ? "button-loading" : ""}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p
              onClick={() => !isLoading && this.setState({ showReset: false })}
              tabIndex="0"
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && this.setState({ showReset: false })
              }
              role="button"
              aria-label="Back to login"
            >
              ← Back to Login
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container-login">
        <div className="card-login">
        <img
  src={logo}
  style={{ width: "130px", marginBottom: "10px" }}
/>

          <h2>Welcome Back!</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={this.handleLogin}>
            <div className={`input-group ${this.getFieldError("email", email) ? "error" : ""}`}>
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                onBlur={() => this.handleBlur("email")}
                required
                disabled={isLoading}
                aria-label="Email address"
              />
            </div>

            {this.getFieldError("email", email) && (
              <div className="error-message">{this.getFieldError("email", email)}</div>
            )}

            <div className={`input-group ${this.getFieldError("password", password) ? "error" : ""}`}>
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                onBlur={() => this.handleBlur("password")}
                required
                disabled={isLoading}
                aria-label="Password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => this.setState({ showPassword: !showPassword })}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {this.getFieldError("password", password) && (
              <div className="error-message">{this.getFieldError("password", password)}</div>
            )}

            <p
              onClick={() => !isLoading && this.setState({ showReset: true })}
              tabIndex="0"
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && this.setState({ showReset: true })
              }
              role="button"
              aria-label="Forgot password"
            >
              Forgot Password?
            </p>

            <button type="submit" disabled={isLoading} className={isLoading ? "button-loading" : ""}>
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
