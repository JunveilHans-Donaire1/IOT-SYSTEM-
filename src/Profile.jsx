import React, { Component } from "react";
import "./Profile.css";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaCheckCircle,
  FaCamera,
} from "react-icons/fa";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePic: localStorage.getItem("profilePic") || null,
    };
  }

  handlePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event) => {
        localStorage.setItem("profilePic", event.target.result);
        this.setState({ profilePic: event.target.result });
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const { profilePic } = this.state;

    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <h2 className="title">
            <FaUser /> Admin Profile
          </h2>

          <div className="image-container">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
            />

            <label className="camera-btn">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={this.handlePicChange}
                hidden
              />
            </label>
          </div>

          <div className="info">
            <div className="info-row">
              <FaUser /> Maintenance Personnel
            </div>

            <div className="info-row">
              <FaEnvelope /> smarttrashadmin@gmail.com
            </div>

            <div className="info-row">
              <FaUserShield /> System Administrator
            </div>

            <div className="info-row status">
              <FaCheckCircle /> Active
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;