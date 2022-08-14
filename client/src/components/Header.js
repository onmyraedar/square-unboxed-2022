import React from "react";
import "./Header.css";

function Header() {
  return(
    <header>
      <div className="header">
        <img className="header-logo" src={require("../assets/bento-logo-cropped.png")} alt="Bento Logo" />
      </div>
    </header>
  );
}

export default Header;