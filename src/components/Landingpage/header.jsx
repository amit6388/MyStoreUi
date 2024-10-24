import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/landingpage.css';
import { FaSearch } from 'react-icons/fa';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
  const userType = JSON.parse(localStorage.getItem('userType'));
  const navigate = useNavigate();

  const handleLogOut = () => {
    const redirectPath = `/${userType}/login`;
    // Clear token and userType
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    // Redirect to login page based on user type
    navigate(redirectPath);
  };

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
        {!userType && <Link to="/user/register" className="auth-link">SignUp</Link>}

        {/* Conditional rendering for Dashboard or Login Dropdown */}
        {!userType ? (
          <NavDropdown title="Login" id="navbarScrollingDropdown" className="nav-dropdown-custom">
            <NavDropdown.Item as={Link} to="/user/login" className="nav-dropdown-custom">User</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/login" className="nav-dropdown-custom">Admin</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <>
            <Link
              to={userType === 'admin' ? '/admin/add-product' : '/user/product-list'}
              className="auth-link"
            >
              Dashboard
            </Link>
            <Link to={`/${userType}/login`} onClick={handleLogOut} className="auth-link">
              LogOut
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
