import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ isAuthed, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          port<span>folio</span>
        </NavLink>
        <nav className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
          {isAuthed ? (
            <>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                Admin
              </NavLink>
              <button className="navbar__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
