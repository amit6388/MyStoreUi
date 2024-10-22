import React, { Fragment } from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// common
import Header from './components/Landingpage/header';
import Slideshow from './components/Landingpage/Slideshow';
import Home from './components/Landingpage/Home';
import Error from './components/Landingpage/Error';
import Shop from './components/Landingpage/Shop';
// admin
import AdminLogin from './components/Admin/AdminLogin';
import AddCartList from './components/Admin/AddCardList';
import AddProduct from './components/Admin/AddProduct';
import OrderList from './components/Admin/OrderList';
import Shipment from './components/Admin/Shipment';

// user
import Register from './components/User/Register';
import UserLogin from './components/User/UserLogin';
import AddCart from './components/User/AddCart';
import ProductList from './components/User/ProductList';
import ProductOder from './components/User/ProductOder';
import UserShipmment from './components/User/UserShipmment';

const App = () => {
  const location = useLocation();  // Get current path

  // Define an array of paths where the Header should be displayed
  const showHeaderPaths = ['/', '/admin/login', '/user/register', '/user/login', '/shop'];

  return (
    <Fragment>
      {/* Conditionally render the Header component on the specified routes */}
      {showHeaderPaths.includes(location.pathname) && <Header />}

      {/* Conditionally render the Slideshow component only on the homepage */}
      {location.pathname === '/' && <Slideshow />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/shop" element={<Shop />} />
        {/* user */}
        <Route path="/user/product-list" element={<ProductList />} />
        <Route path="/user/addcart" element={<AddCart />} />
        <Route path="/user/order" element={<ProductOder />} />
        <Route path="/user/shipment" element={<UserShipmment />} />
        {/* admin */}
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/addcart-list" element={<AddCartList />} />
        <Route path="/admin/order-list" element={<OrderList />} />
        <Route path="/admin/shipment" element={<Shipment />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Fragment>
  );
};

export default App;
