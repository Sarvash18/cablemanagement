import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../cable-logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query === "") {
      navigate("/subscribers");
    } else {
      navigate(`/subscribers/${query}`);
    }
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a className="navbar-brand ms-0" href="#">
            <img src={logo} alt="Bootstrap" width="75" height="75" />
          </a>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 mx-5">
            <li>
              <NavLink to="/" className="nav-link px-2 text-white">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/subscribers" className="nav-link px-2 text-white">
                All Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="/unpaid" className="nav-link px-2 text-white">
                Unpaid Customers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payments-by-date"
                className="nav-link px-2 text-white"
              >
                Payments By Date
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin-panel" className="nav-link px-2 text-white">
                Admin Panel
              </NavLink>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search by Customer ID"
              type="search"
              className="input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
