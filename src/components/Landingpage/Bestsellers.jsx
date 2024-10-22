import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin/Admincss/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminGetProduct } from '../services/index';
import { Button } from 'react-bootstrap';
import { addToCartUser } from '../../components/services/index'
export default function Bestsellers() {
  const nav = useNavigate()
  const [data, setData] = useState([]);
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

  const handleAddToCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("userType"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (user && token) {
      try {
        const result = await addToCartUser({ productId: itemId, userId: token?._id });

        if (result?.code === 201 || result?.code === 200) {
          toast.success(result.message);
        }
        else if (result?.code == 409) {
          toast.error(result.message);
        }
        else {
          toast.error(result?.message || 'Failed to add  to cart. Please try again.');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      // If the user is not logged in, navigate to the login page
      nav('/user/login');
    }
  };


  return (
    <>

      <div className='container-fluid a' style={{ background: '#e0f7fa', minHeight: "500px" }}>


        <div className='row'>
          <div className='col-sm-1'></div>
          <div className='col-sm-10 mt-5'>
            <h2><u style={{ color: '#00796b' }}>Best </u>Seller </h2>
            {data.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#00796b', padding: '20px' }}>
                No products have been added yet.
              </div>
            ) : (
              <div className='row'>
                {data?.slice(0, 4)?.map((item) => (
                  <div className='col-sm-3 mb-4' key={item._id}>
                    <div className="card shadow-sm" 
                    style={{ width: '100%', border: 'none', textAlign: "left", borderRadius: '10px', position: 'relative' }}
                    >
                      <img
                        src={`http://localhost:8000/api/img/${item.img}`}
                        alt=''
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                      />
                      <div className="card-body">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="fw-bold" style={{ color: '#00796b' }}>Name:</td>
                              <td style={{ color: '#00796b' }}>{item.name}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold" style={{ color: '#00796b' }}>Pills:</td>
                              <td style={{ color: 'green', fontWeight: 'bold' }}>{item.pills}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold" style={{ color: '#00796b' }}>Dose:</td>
                              <td style={{ color: 'green', fontWeight: 'bold' }}>{item.dose} mg</td>
                            </tr>
                            <tr>
                              <td className="fw-bold" style={{ color: '#00796b' }}>Price:</td>
                              <td style={{ color: 'green', fontWeight: 'bold' }}>${item.price}</td>
                            </tr>
                            <tr>
                              <td className="fw-bold" style={{ color: '#00796b' }}>Discount:</td>
                              <td style={{ color: 'green', fontWeight: 'bold' }}>{item.discount}%</td>
                            </tr>
                          </tbody>
                        </table>
                        <br />
                        {item?.outofstock !== undefined && (
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={() => {
                              if (!item?.outofstock) handleAddToCart(item?._id);
                            }}
                            style={{
                              backgroundColor: item?.outofstock ? 'red' : 'green',
                              borderColor: item?.outofstock ? 'red' : 'green',
                              width: '100%'
                            }}
                          >
                            {item?.outofstock ? "Out of Stock" : "Add To Cart"}
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



    </>
  );
}
