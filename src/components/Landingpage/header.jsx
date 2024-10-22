import React from 'react';
import { Link } from 'react-router-dom';
import './css/landingpage.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <Link to="/" className="logo">MyStore</Link>
      </div>

      {/* Center: Search Bar */}
      <div className="header-center">
        <div className="search-bar-container">
          <input type="text" placeholder="Search for medicines..." className="search-bar" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Right: Cart, Login, and Signup */}
      <div className="header-right">
        <Link to="/" className="home-link">Home</Link>
        <Link to="/shop" className="shop-link">Shop</Link>
        <Link to="/user/register" className="auth-link">SignUp</Link>

        {/* Using NavDropdown from Bootstrap */}
        <NavDropdown
          title="Login"
          id="navbarScrollingDropdown"
          className="nav-dropdown-custom"
        >
          <NavDropdown.Item as={Link} to="/user/login" className="nav-dropdown-custom">
            User
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/login" className="nav-dropdown-custom">
            Admin
          </NavDropdown.Item>
        </NavDropdown>


      </div>
    </header>
  );
};

export default Header;
