import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/NavBar";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/upload");
  };

  const handleLogin = async () => {
    if (user) {
      try {
        const token = await getAccessTokenSilently();
        const userInfo = {
          sub: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
          updated_at: user.updated_at,
        };
        await fetch("http://localhost:3000/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: userInfo }),
        });
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } }).then(() => {
      window.location.href = "http://localhost:3001";
    });
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      handleLogin();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="overlay">
      <Nav />
      <div className="homepage">
        <div className="definition-box">
          <h1 className="heading">Yada</h1>
          <p className="definition">
            /yaa-da/ | noun (punjabi) <br />
            def: memory; memorization
          </p>
        </div>
        <div className="text-box">
          <p className="subtitle">
            Revolutionize your studying and improve memorisation with our
            AI-generated flashcards
          </p>
          {!isAuthenticated ? (
            <button
              className="get-started-btn"
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </button>
          ) : (
            <>
              <p>Welcome, {user.name}</p>
              <button className="upload-btn" onClick={handleNavigate}>
                Upload Your Notes
              </button>
              <LogoutButton />
              {/* <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
