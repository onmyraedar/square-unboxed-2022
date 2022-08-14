import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/"
        >
          Get started
        </NavLink>  
      </div>
      <p className="navbar-section-header">Inventory</p>  
      <div className="link-container">
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/inventory/create"
        >
          Create item
        </NavLink>
      </div>
      <div className="link-container">
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/inventory/list"
        >
          View items
        </NavLink>
      </div>
      <p className="navbar-section-header">Recipes</p>
      <div className="link-container">
        <NavLink
            className={(navData) => (navData.isActive ? "active" : "link")}
            to="/recipe/create"
          >
            Create recipe
          </NavLink>
        </div>
    </div>
  )
}

export default Navbar;