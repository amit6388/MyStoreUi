import React, { useEffect, useState } from 'react';
import Sidebar from '../SideBar/Sidebar';
import { useNavigate } from 'react-router-dom';
import '../Admin/Admincss/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSingleUserCart } from '../services/index';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { userCartDelete, createOrder } from '../../components/services/index';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function Shop() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);

  const validationSchema = Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip Code is required'),
    country: Yup.string().required('Country is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const getList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const result = await getSingleUserCart(token?._id);
      setData(result.data);

      const initialQuantities = result.data.reduce((acc, item) => {
        acc[item._id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const handleDeleteAddToCart = async (itemId) => {
    try {
      const result = await userCartDelete(itemId);

      if (result?.code === 201 || result?.code === 200) {
        toast.success(result.message);
        getList();
      } else {
        toast.error(result?.message || 'Failed to delete from cart. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const incrementQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: prevQuantities[itemId] + 1,
    }));
  };

  const decrementQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(prevQuantities[itemId] - 1, 1),
    }));
  };

  const calculateTotalPrice = () => {
    return data.reduce((total, item) => {
      const quantity = quantities[item._id];
      const discountPrice = item.productDetail.price * (1 - item.productDetail.discount / 100);
      return total + discountPrice * quantity;
    }, 0);
  };

  const orderNow = async (shippingDetails) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      // Prepare products array
      const products = data.map((item) => ({
        productId: item.productDetail._id,
        quantity: quantities[item._id],
        price: item.productDetail.price,
      }));

      // Prepare order details
      const orderDetails = {
        userId: token?._id,
        products: products,
        totalPrice: calculateTotalPrice(),
        shippingAddress: shippingDetails,
      };

      const result = await createOrder(orderDetails);

      if (result?.code === 201 || result?.status === 200) {
        toast.success(result?.message || 'Order created successfully!');
        // Clear cart after successful order
        data.forEach(async (item) => {
          await userCartDelete(item._id);
        });
        // Refresh the cart
        setShowModal(false);
        getList();
      } else {
        toast.error(result?.message || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data) => {
    orderNow(data);
  };

  return (
    <>
      <Sidebar>
        <div className='container-fluid a' style={{ background: '#e0f7fa', minHeight: "100vh" }}>
          <div className="row">
            <div className='col-sm-12 mt-5'>
              <h2><u style={{ color: '#00796b' }}>Cart Invoice</u></h2>

              {/* Invoice Table */}
              {data.length > 0 && (
                <div className="table-responsive">
                  <Table striped bordered hover className="mt-4">
                    <thead>
                      <tr style={{ textAlign: 'center', backgroundColor: '#00796b', color: 'white' }}>
                        <th>Sr No.</th>
                        <th>Product Name</th>
                        <th>Actual Price</th>
                        <th>Discount %</th>
                        <th>Discount Price</th>
                        <th>Payable Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => {
                        const quantity = quantities[item._id];
                        const discountPrice = item.productDetail.price * (item.productDetail.discount / 100);
                        const payablePrice = (item.productDetail.price - discountPrice) * quantity;

                        return (
                          <tr key={item._id} style={{ textAlign: 'center' }}>
                            <td>{index + 1}</td>
                            <td>{item.productDetail.name}</td>
                            <td>${item.productDetail.price.toFixed(2)}</td>
                            <td>{item.productDetail.discount}%</td>
                            <td>${discountPrice.toFixed(2)}</td>
                            <td>${payablePrice.toFixed(2)}</td>
                            <td>
                              <div className="quantity-controls">
                                <Button
                                  variant="secondary"
                                  onClick={() => decrementQuantity(item._id)}
                                  style={{ marginRight: '10px' }}
                                >
                                  -
                                </Button>
                                <span>{quantity}</span>
                                <Button
                                  variant="secondary"
                                  onClick={() => incrementQuantity(item._id)}
                                  style={{ marginLeft: '10px' }}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td>
                              <RiDeleteBin6Fill
                                onClick={() => handleDeleteAddToCart(item._id)}
                                style={{ color: "red", height: "25px", width: "25px" }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ textAlign: 'end', fontWeight: 'bold', fontSize: '18px', backgroundColor: '#e0f7fa' }}>
                        <td colSpan="5">Total Payable Price:</td>
                        <td style={{ color: "green", textAlign: "center" }}>${calculateTotalPrice().toFixed(2)}</td>
                        <td colSpan="2" style={{ color: "green", textAlign: "left" }}>
                          <Button
                            variant="secondary"
                            onClick={handleShowModal}
                            style={{ marginLeft: '10px' }}
                          >
                            Order Now
                          </Button>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              )}
            </div>
          </div>

          {/* Cart Products Section */}
          <div className='row mt-5'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10'>
              <h2><u style={{ color: '#00796b' }}>Cart Products</u> Details</h2>
              {data.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#00796b', padding: '20px' }}>
                  No products have been added yet in your cart.
                </div>
              ) : (
                <div className='row'>
                  {data.map((item) => (
                    <div className='col-sm-3 mb-4' key={item?.productDetail._id}>
                      <div className="card shadow-sm" style={{ width: '100%', border: 'none', borderRadius: '10px', position: 'relative' }}>
                        <img
                          src={`http://localhost:8000/api/img/${item?.productDetail?.img}`}
                          alt=''
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{item.productDetail.name}</h5>
                          <p className="card-text">Price: ${item.productDetail.price.toFixed(2)}</p>
                          <p className="card-text">Discount: {item.productDetail.discount}%</p>
                          <p className="card-text">Quantity: {quantities[item._id]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='col-sm-1'></div>
          </div>
        </div>

        {/* Order Now Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ background: '#00796b', borderBottom: 'none' }}>
            <Modal.Title style={{ color: '#e0f7fa' }}>Shipping Address</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: '#e0f7fa', color: '#00796b', padding: '30px' }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="formStreet">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  {...register('street')}
                  style={{ border: '1px solid #00796b', borderRadius: '5px' }}
                  placeholder="Enter your street address"
                />
                {errors.street && <p className="text-danger">{errors.street.message}</p>}
              </Form.Group>

              <Form.Group controlId="formCity" style={{ marginTop: '20px' }}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  {...register('city')}
                  style={{ border: '1px solid #00796b', borderRadius: '5px' }}
                  placeholder="Enter your city"
                />
                {errors.city && <p className="text-danger">{errors.city.message}</p>}
              </Form.Group>

              <Form.Group controlId="formState" style={{ marginTop: '20px' }}>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  {...register('state')}
                  style={{ border: '1px solid #00796b', borderRadius: '5px' }}
                  placeholder="Enter your state"
                />
                {errors.state && <p className="text-danger">{errors.state.message}</p>}
              </Form.Group>

              <Form.Group controlId="formZipCode" style={{ marginTop: '20px' }}>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  {...register('zipCode')}
                  style={{ border: '1px solid #00796b', borderRadius: '5px' }}
                  placeholder="Enter your zip code"
                />
                {errors.zipCode && <p className="text-danger">{errors.zipCode.message}</p>}
              </Form.Group>

              <Form.Group controlId="formCountry" style={{ marginTop: '20px' }}>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  {...register('country')}
                  style={{ border: '1px solid #00796b', borderRadius: '5px' }}
                  placeholder="Enter your country"
                />
                {errors.country && <p className="text-danger">{errors.country.message}</p>}
              </Form.Group>

              <Button
                variant="success"
                type="submit"
                style={{ marginTop: '30px', backgroundColor: '#00796b', borderColor: '#00796b' }}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>


        <ToastContainer />
      </Sidebar>
    </>
  );
}

