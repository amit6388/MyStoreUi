import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Sidebar from '../SideBar/Sidebar';
import '../Admin/Admincss/Admin.css';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminAddProduct, adminGetProduct, adminDeleteProduct } from '../services/index'; // Assume this is your service for adding products

// Validation schema for product form
const schema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  price: Yup.number().required('Price is required').positive('Price must be a positive number'),
  dose: Yup.string().required('Dose is required'),
  discount: Yup.number().required('Discount is required').min(0, 'Discount cannot be negative'),
  outofstock: Yup.string().required('Out of stock status is required'),
  pills: Yup.number().required('Number of pills is required').integer('Must be a whole number').min(1, 'Must have at least 1 pill'),
  img: Yup.mixed().required('Image is required').test('fileSize', 'File is too large', (value) => {
    return value && value[0] && value[0].size <= 2000000; // 2MB file size limit
  }).test('fileType', 'Unsupported File Format', (value) => {
    return value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
  }),
});

export default function AddProduct() {
  const [data, setData] = useState([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const productSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // Append product details to formData
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('dose', data.dose);
    formData.append('discount', data.discount);
    formData.append('outofstock', data.outofstock);
    formData.append('pills', data.pills);
    // Append the image file
    formData.append('img', data.img[0]);

    try {
      const result = await adminAddProduct(formData);
      if (result?.status === true && result?.code === 200) {
        toast.success(result.message);
        navigate('/user/product-list');
      } else {
        toast.error(result?.message || "Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const getList = async (data) => {
    try {
      const result = await adminGetProduct(data);
      setData(result.data)
      console.log(result.data)
    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    getList()
  }, [])


  function del(id) {
    if (window.confirm('Are you sure you want to delete?')) {
      adminDeleteProduct(id)
        .then(() => {
          getList();
        })
        .catch((error) => {
          console.error("Error deleting product: ", error);
        });
    } else {
      toast.error('Record Not Deleted', {
      });
    }
  }



  return (
    <>
      <Sidebar>
        <div className='container-fluid a' style={{ background: '#e0f7fa', minHeight: "800px" }}>
          <div className='row'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10 py-5'>
              <h2><u style={{ color: '#00796b' }}>Add</u> Product</h2>
              <form onSubmit={handleSubmit(productSubmit)}>
                <div className='row'>
                  {/* Product Name */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="text"
                      className={`form-control w-100 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder='Enter Product Name'
                      {...register('name')}
                    />

                  </div>

                  {/* Price */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="number"
                      className={`form-control w-100 ${errors.price ? 'is-invalid' : ''}`}
                      placeholder='Enter Price'
                      {...register('price')}
                    />

                  </div>

                  {/* Dose */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="text"
                      className={`form-control w-100 ${errors.dose ? 'is-invalid' : ''}`}
                      placeholder='Enter Dose'
                      {...register('dose')}
                    />

                  </div>

                  {/* Discount */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="number"
                      className={`form-control w-100 ${errors.discount ? 'is-invalid' : ''}`}
                      placeholder='Enter Discount (%)'
                      {...register('discount')}
                    />

                  </div>

                  {/* Out of Stock */}
                  <div className='col-sm-4 mb-3'>
                    <select
                      className={`form-control w-100 ${errors.outofstock ? 'is-invalid' : ''}`}
                      {...register('outofstock')}
                    >
                      <option value="">Is it Out of Stock?</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>

                  </div>

                  {/* Pills */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="number"
                      className={`form-control w-100 ${errors.pills ? 'is-invalid' : ''}`}
                      placeholder='Enter Number of Pills'
                      {...register('pills')}
                    />

                  </div>

                  {/* Image Upload */}
                  <div className='col-sm-4 mb-3'>
                    <input
                      type="file"
                      className={`form-control w-100 ${errors.img ? 'is-invalid' : ''}`}
                      accept="image/*"
                      {...register('img')}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className='col-sm-4'>
                    <button type='submit' className='form-control w-100' style={{ background: '#00796b', color: 'white' }} disabled={loading}>
                      {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className='col-sm-1'></div>
          </div>

          {/* ********************************************list *************************************************** */}

          <div className='row'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10 py-5'>
            <h2><u style={{ color: '#00796b' }}>Product</u> List</h2>
      <div className='row'>
        {
          data.map((item, index) => (
            <div className='col-sm-3 mb-4' key={index}>
              <div className="card shadow-sm" style={{ width: '100%', border: 'none', borderRadius: '10px', position: 'relative' }}>
                <img 
                  src={`http://localhost:8000/api/img/${item.img}`} 
                  alt='Image not found' 
                  className="card-img-top" 
                  style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} 
                />
                <div className="card-body"> 
                <div>
                  <span className="card-text" style={{color: '#00796b',fontWeight: 'bold'}}>Action</span>
                  <span style={{float:'right',color: '#00796b'}}><FaEdit/></span>
                  <span style={{float:'right',color: '#00796b',marginRight:'5px'}} onClick={()=>del(item._id)}><MdDelete/></span>
                  </div>
                  <b className="card-title fs-6" style={{ fontWeight: 'bold' ,color: '#00796b',}}>Product Name:- <span style={{float:"right"}}>{item.name}</span></b><br/>
                  <b className="card-text" style={{color: '#00796b'}}> Product Price:- <span style={{ color: 'green', fontWeight: 'bold' ,float:"right"}}>${item.price}</span></b><br/>
                  <b className="card-text" style={{color: '#00796b'}}>Product Discount:- <span style={{ color: 'green', fontWeight: 'bold' ,float:"right"}}>{item.discount}%</span></b><br/>
                  <b className="card-text" style={{color: '#00796b'}}>Product Dose:- <span style={{ color: 'green', fontWeight: 'bold' ,float:"right"}}>{item.dose}</span></b><br/>
                  <b className="card-text" style={{color: '#00796b'}}> Product Out Of Stock:- <span style={{ color: 'green', fontWeight: 'bold' ,float:"right"}}>{item.outofstock}</span></b><br/>
                  <b className="card-text" style={{color: '#00796b'}}>Product Pills:- <span style={{ color: 'green', fontWeight: 'bold' ,float:"right"}}>{item.pills}</span></b><br/>  
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
          </div>
          <div className='col-sm-1'></div>
        </div>
        <ToastContainer />
      </Sidebar>
    </>
  );
}


