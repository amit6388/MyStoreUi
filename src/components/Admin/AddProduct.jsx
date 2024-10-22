import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Sidebar from '../SideBar/Sidebar';
import '../Admin/Admincss/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminGetProduct, adminDeleteProduct } from '../services/index';
import ProductModal from './AddProductModal';
import EditProductModal from './EditAddProduct';
import { Button } from 'react-bootstrap'
export default function AddProduct() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowEdit = () => setShowEditModal(true);
  const handleEditClose = () => {
    setShowEditModal(false);
    setEditData(null); // Reset editData on close
  };

  const getList = async () => {
    try {
      const result = await adminGetProduct();
      setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const del = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      adminDeleteProduct(id)
        .then(() => {
          getList();
          toast.success('Product deleted successfully!');
        })
        .catch((error) => {
          console.error("Error deleting product: ", error);
          toast.error('Failed to delete product.');
        });
    } else {
      toast.error('Record Not Deleted');
    }
  };

  return (
    <>
      <Sidebar>
        <div className='container-fluid a' style={{ background: '#e0f7fa', minHeight: "800px" }}>
          <div className='row'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10 py-5'>
              <div className='d-flex justify-content-end'>
                <div className='addProductbtn' onClick={handleShow}>Add Product</div>
              </div>
              <ProductModal show={showModal} getList={getList} handleClose={handleClose} />
            </div>
            <div className='col-sm-1'></div>
          </div>

          <div className='row'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10 '>
              <h2><u style={{ color: '#00796b' }}>Product</u> List</h2>
              {data.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#00796b', padding: '20px' }}>
                  No products have been added yet.
                </div>
              ) : (
                <div className='row'>
                  {data.map((item) => (
                    <div className='col-sm-3 mb-4' key={item._id}>
                      <div className="card shadow-sm" style={{ width: '100%', border: 'none', borderRadius: '10px', position: 'relative' }}>
                        <img
                          src={`http://localhost:8000/api/img/${item.img}`}
                          alt=''
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        />
                        <div className="card-body">
                          <div>
                            <span className="card-text" style={{ color: '#00796b', fontWeight: 'bold' }}>Action</span>
                            <span onClick={() => { setEditData(item); handleShowEdit(); }} style={{ float: 'right', color: 'red' }}>
                              <FaEdit />
                            </span>
                            <span style={{ float: 'right', color: 'red', marginRight: '5px' }} onClick={() => del(item._id)}><MdDelete /></span>
                          </div>
                          <b className="card-title fs-6" style={{ fontWeight: 'bold', color: '#00796b' }}>  Name:- <span style={{ float: "right" }}>{item.name}</span></b><br />
                          <b className="card-text" style={{ color: '#00796b' }}>  Pills:- <span style={{ color: 'green', fontWeight: 'bold', float: "right" }}>{item.pills}</span></b><br />
                          <b className="card-text" style={{ color: '#00796b' }}>  Dose:- <span style={{ color: 'green', fontWeight: 'bold', float: "right" }}>{item.dose} mg</span></b><br />
                          <b className="card-text" style={{ color: '#00796b' }}>  Price:- <span style={{ color: 'green', fontWeight: 'bold', float: "right" }}>${item.price}</span></b><br />
                          <b className="card-text" style={{ color: '#00796b' }}>  Discount:- <span style={{ color: 'green', fontWeight: 'bold', float: "right" }}>{item.discount}%</span></b><br />
                          <br />
                          {item?.outofstock !== undefined && (
                            <Button
                              variant="primary"
                              type="submit"
                              style={{ backgroundColor: item.outofstock ? 'red' : 'green', borderColor: item.outofstock ? 'red' : 'green', width: '100%' }}
                            >
                              {item.outofstock ? "Out of Stock" : "Add To Cart"}
                            </Button>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='col-sm-1'></div>
          </div>
          <ToastContainer />
        </div>
      </Sidebar>

      <EditProductModal
        show={showEditModal}
        handleeditClose={handleEditClose}
        getList={getList}
        existingProduct={editData}
      />
    </>
  );
}
