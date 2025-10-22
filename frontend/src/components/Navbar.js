// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // inside Navbar or DashboardNavbar component
const handleChangeSchool = () => {
  localStorage.removeItem("schoolId");
  localStorage.removeItem("selectedSchool");
  window.location.href = "/select-school";
};

  
return(
  <nav className="navbar navbar-expand-md bg-light fixed-top text-primary-emphasis">
  <div className="container-fluid">
    <Link className="navbar-brand fw-bold" to="/">
      ISSD
    </Link>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarContent"
      aria-controls="navbarContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
   
<button
  className="btn btn-outline-secondary ms-2"
  onClick={handleChangeSchool}
>
  Change School
</button>

    <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
      <ul className="navbar-nav mb-2 mb-md-0">
        <li className="nav-item">
          <Link className="nav-link px-3" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link px-3" to="/sign-in">
            Sign In
          </Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-primary ms-md-2" to="/signup">
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
);
};

export default Navbar;
