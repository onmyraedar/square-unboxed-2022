import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [activeLinkID, setActiveLinkID] = useState("home-link");

  function isActive(ID) {
    console.log(ID);
    return ID === activeLinkID;
  }

  function updateActiveLink(event) {
    setActiveLinkID(event.target.id);
  }

  return(
    <div className="navbar">
      <div className="link-container">
        <Link to="/">Get started</Link>
      </div>
      <p className="navbar-section-header">Inventory</p>
      <div className="link-container">
        <Link to="/inventory/create">Create item</Link>
      </div>
      <div className="link-container">
        <Link to="/inventory/list">View items</Link>
      </div>
      <p className="navbar-section-header">Recipes</p>
      <div className="link-container">
        <Link to="/recipe/create">Create recipe</Link>
      </div>
    </div>
  )
}

export default Navbar;