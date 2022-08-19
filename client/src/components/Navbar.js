import React from "react";
import { NavLink } from "react-router-dom";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import "./Navbar.css";

function Navbar() {
  return(
    <div className="navbar">
      <div className="header-navlink-container">
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/"
        >
          Get started
        </NavLink>  
      </div>
      <p className="navbar-section-header">Inventory</p>  
      <div className="navlink-container">
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/inventory/create"
        >
          <AddBoxRoundedIcon className="navbar-icon" fontSize="small"/>
          Create item
        </NavLink>
      </div>
      <div className="navlink-container">
        <NavLink
          className={(navData) => (navData.isActive ? "active" : "link")}
          to="/inventory/list"
        >
          <SearchRoundedIcon className="navbar-icon" fontSize="small"/>
          View items
        </NavLink>
      </div>
      <p className="navbar-section-header">Recipes</p>
      <div className="navlink-container">
        <NavLink
            className={(navData) => (navData.isActive ? "active" : "link")}
            to="/recipe/create"
          >
            <AddBoxRoundedIcon className="navbar-icon" fontSize="small"/>
            Create recipe
        </NavLink>      
      </div>
      <div className="navlink-container">
        <NavLink
            className={(navData) => (navData.isActive ? "active" : "link")}
            to="/recipe/list"
          >
            <SearchRoundedIcon className="navbar-icon" fontSize="small"/>
            View recipes
        </NavLink>  
      </div>
      <p className="navbar-section-header">Orders</p>
      <div className="navlink-container">
        <NavLink
            className={(navData) => (navData.isActive ? "active" : "link")}
            to="/order/test"
          >
            <AddBoxRoundedIcon className="navbar-icon" fontSize="small"/>
            Create test order
        </NavLink>  
      </div>      
    </div>
  )
}

export default Navbar;