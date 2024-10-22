import React from 'react';
import RecentlyAdded from './RecentlyAdded';
import Bestsellers from './Bestsellers';
import './css/landingpage.css'
const Home = () => {
  return (
    <div className="home">
      <header className="welcome-message">
        <h1>Welcome to Our Medical E-Commerce Store</h1>
        <p>Your one-stop shop for all your medical needs.</p>
      </header>
      <RecentlyAdded />
      <Bestsellers />
    </div>
  );
};

export default Home;