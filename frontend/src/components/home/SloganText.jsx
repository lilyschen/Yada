import React from "react";

const SloganText = ({ isAuthenticated, user, loginWithRedirect, handleNavigate }) => (
  <div className="text-box">
    <p className="slogan-text">REVOLUTIONIZE YOUR MEMORIZATION</p>
    {!isAuthenticated ? (
      <button className="get-started-btn" onClick={loginWithRedirect}>
        Get Started
      </button>
    ) : (
      <>
        <p className="subtitle">Welcome, {user.name}</p>
        <button className="upload-btn" onClick={handleNavigate}>
          Upload Your Notes
        </button>
      </>
    )}
  </div>
);

export default SloganText;
