import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";

const Nav = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="logo" src="./yada-logo.png" alt="Yada logo" />
      </div>
      {isAuthenticated && (
        <div className="logout-container">
          <LogoutButton />
        </div>
      )}
    </nav>
  );
};

export default Nav;
