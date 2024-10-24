import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ToastContainer, Toast, Form } from 'react-bootstrap';
import Sidebar from '../SideBar/Sidebar';
import { adminGetOrder, updateOrderStatusAPI } from '../services'; // Import your API services
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// import { LiaRupeeSignSolid } from "react-icons/lia";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const orderStatusOptions = ['confirmed', 'shipped', 'delivered', 'cancelled'];
  const paymentStatusOptions = ['pending', 'completed', 'failed'];

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    orderStatus: Yup.string().oneOf(orderStatusOptions, 'Invalid Order Status').required('Order status is required'),
    paymentStatus: Yup.string().oneOf(paymentStatusOptions, 'Invalid Payment Status').required('Payment status is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await adminGetOrder();
        if (result?.code === 200) {
          setOrders(result.data);
          setToastMessage(result.message);
          setToastVisible(true);
        } else {
          setToastMessage(result?.message || 'Failed to fetch orders.');
          setToastVisible(true);
        }
      } catch (err) {
        console.error(err);
        setToastMessage('An error occurred. Please try again later.');
        setToastVisible(true);
      }
    };

    fetchOrders();
  }, []);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    // Reset the form with prefilled values from the selected order
    reset({
      orderStatus: order.orderStatus || '', // Default to empty string if not provided
      paymentStatus: order.paymentStatus || '', // Default to empty string if not provided
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const onSubmit = async (data) => {
    const isConfirmed = window.confirm("Are you sure you want to update this order?");
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }
    try {
      const updatedOrder = {
        orderStatus: data.orderStatus,
        paymentStatus: data.paymentStatus,
      };

      const result = await updateOrderStatusAPI(selectedOrder._id, updatedOrder);
      if (result?.code === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, orderStatus: data.orderStatus, paymentStatus: data.paymentStatus }
              : order
          )
        );
        setToastMessage('Order updated successfully');
        setToastVisible(true);
        handleCloseModal();
      } else {
        setToastMessage('Failed to update the order.');
        setToastVisible(true);
      }
    } catch (error) {
      setToastMessage('Error updating the order.');
      setToastVisible(true);
    }
  };

  const styles = {
    container: {
      background: '#e0f7fa',
      color: '#00796b',
      padding: '20px',
    },
    modalHeader: {
      background: '#e0f7fa',
      color: '#00796b',
    },
    modalBody: {
      background: '#e0f7fa',
      color: '#00796b',
    },
    centeredHeading: {
      textAlign: 'center',
      color: '#00796b',
    },
    statusText: {
      color: 'red',
    },
    tableContainer: {
      maxHeight: '300px',
      overflowY: 'auto',
    },
    totalPrice: {
      textAlign: 'right',
      fontWeight: 'bold',
    },
  };

  return (
    <Sidebar>
      <div style={styles.container}>
        <h2>Order List</h2>
        <Table striped bordered hover variant="light" responsive>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.userId.name}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.orderStatus}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  <Button variant="info" style={styles.modalHeader} onClick={() => handleShowModal(order)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-end">
        <Toast onClose={() => setToastVisible(false)} show={toastVisible} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {selectedOrder && (
            <div>
              <h5>Shipping Address</h5>
              <Table bordered variant="light" responsive>
                <tbody>
                  <tr>
                    <td>{selectedOrder.shippingAddress.street}</td>
                  </tr>
                  <tr>
                    <td>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                    </td>
                  </tr>
                  <tr>
                    <td>{selectedOrder.shippingAddress.country}</td>
                  </tr>
                </tbody>
              </Table>

              <h5>Products</h5>
              <div style={styles.tableContainer}>
                <Table striped bordered hover variant="light" responsive>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Product Name</th>
                      <th>Actual Price</th>
                      <th>Discount %</th>
                      <th>Discount Price</th>
                      <th>Payable Price</th>
                      <th>Quantity</th>
                      <th>Total Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product, index) => {
                      const actualPrice = product.productId.price; // Actual price from product
                      const discountPercent = product.productId.discount; // Discount percent
                      const discountPrice = (actualPrice * discountPercent) / 100; // Calculate discount price
                      const payablePrice = actualPrice - discountPrice; // Calculate payable price
                      const totalPayable = payablePrice * product.quantity; // Total payable for the product

                      return (
                        <tr key={product._id}>
                          <td>{index + 1}</td>
                          <td>{product.productId.name}</td>
                          <td>${actualPrice.toFixed(2)}</td>
                          <td>{discountPercent}%</td>
                          <td>${discountPrice.toFixed(2)}</td>
                          <td>${payablePrice.toFixed(2)}</td>
                          <td>{product.quantity}</td>
                          <td>${totalPayable.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {/* Total Price Row */}
                    <tr>
                      <td colSpan="7" style={styles.totalPrice}>Total Price:</td>
                      <td>${selectedOrder.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
               
              </div>
              
              {/* Centered Status Headings with Custom Colors
              */}
<div>
<h5 style={styles.centeredHeading}>
                Order Status: <span style={styles.statusText}>{selectedOrder.orderStatus}</span>
              </h5>
              <h5 style={styles.centeredHeading}>
                Payment Status: <span style={styles.statusText}>{selectedOrder.paymentStatus}</span>
              </h5>
              <h5 style={styles.centeredHeading}>
                Order Date: <span style={styles.statusText}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </h5>
</div>

              {/* Status Update Form */}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formOrderStatus">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Control as="select" {...register('orderStatus')} isInvalid={!!errors.orderStatus}>
                    <option value="">Select Status</option>
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.orderStatus?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPaymentStatus">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Control as="select" {...register('paymentStatus')} isInvalid={!!errors.paymentStatus}>
                    <option value="">Select Payment Status</option>
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.paymentStatus?.message}</Form.Control.Feedback>
                  
                </Form.Group>
                <br/>
                <Button style={styles.modalHeader} variant="primary" type="submit">
                  Update Order Status
                </Button>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Sidebar>
  );
}

export default OrderList;
