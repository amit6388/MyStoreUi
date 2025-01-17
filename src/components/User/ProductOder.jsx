import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ToastContainer, Toast } from 'react-bootstrap';
import Sidebar from '../SideBar/Sidebar';
import { GetUserOrder, updateOrderStatusAPI } from '../services'; // Ensure updateOrderStatusAPI is imported

function ProductOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const result = await GetUserOrder(token?._id);
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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }
  
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const payload = {
        paymentStatus: selectedOrder.paymentStatus, // Send prefilled payment status
        orderStatus: "Cancelled" // Update order status to "Cancelled"
      };
      const result = await updateOrderStatusAPI(selectedOrder._id, payload);
      if (result?.code === 200) {
        // Update the orders state to reflect the cancelled order
        setOrders(orders.map(order => 
          order._id === selectedOrder._id ? { ...order, orderStatus: "Cancelled" } : order
        ));
        setToastMessage('Order cancelled successfully.');
      } else {
        setToastMessage(result?.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
      setToastMessage('An error occurred while cancelling the order.');
    } finally {
      setToastVisible(true);
      handleCloseModal(); // Close the modal after attempting to cancel
    }
  };
  

  const styles = {
    container: {
      background: '#e0f7fa',
      color: '#00796b',
      padding: '20px'
    },
    modalHeader: {
      background: '#e0f7fa',
      color: '#00796b'
    },
    modalBody: {
      background: '#e0f7fa',
      color: '#00796b'
    },
    centeredHeading: {
      textAlign: 'center',
      color: '#00796b'
    },
    statusText: {
      color: 'red'
    },
    tableContainer: {
      maxHeight: '300px',
      overflowY: 'auto'
    },
    totalPrice: {
      textAlign: 'right',
      fontWeight: 'bold'
    }
  };

  return (
    <Sidebar>
      <div className='pt-5' style={styles.container}>
        <h2>My Order List</h2>
        <Table striped bordered hover variant="light" responsive>
          <thead>
            <tr>
              <th>Sr. No.</th>
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

              {/* Display User Contact Information */}
              <table className="table text-center">
                <tbody>
                  <tr>
                    <td>
                      <strong>Email:</strong> {selectedOrder.userId.email}
                    </td>
                    <td>
                      <strong>Contact No:</strong> {selectedOrder.userId.contact}
                    </td>
                  </tr>
                </tbody>
              </table>

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

              {/* Centered Status Headings with Custom Colors */}
              <h5 style={styles.centeredHeading}>
                Order Status: <span style={styles.statusText}>{selectedOrder.orderStatus}</span>
              </h5>
              <h5 style={styles.centeredHeading}>
                Payment Status: <span style={styles.statusText}>{selectedOrder.paymentStatus}</span>
              </h5>
              <h5 style={styles.centeredHeading}>
                Order Date: <span style={styles.statusText}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </h5>

              {/* Cancel Order Button */}
              <Button variant="danger" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
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

export default ProductOrder;
