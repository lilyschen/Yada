import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/upload');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="main">
      <div className="homepage">
        <h1 className="heading">Welcome to YADA</h1>
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to create a personalized study guide!
          </p>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Log In</button>
          ) : (
            <>
              <p>Welcome, {user.name}</p>
              <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
