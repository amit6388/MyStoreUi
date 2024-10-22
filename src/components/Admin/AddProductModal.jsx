import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminAddProduct } from '../services/index';

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required'),
   
  price: Yup.number()
    .typeError('Price must be a valid number')
    .required('Price is required')
    .positive('Price must be a positive number'),
  
  dose: Yup.string()
    .required('Dose is required'), 
  discount: Yup.number()
    .typeError('Discount must be a valid number')
    .required('Discount is required')
    .min(0, 'Discount cannot be negative'),
   
  pills: Yup.number()
    .typeError('Number of pills must be a valid number')
    .required('Number of pills is required')
    .integer('Must be a whole number')
    .min(1, 'Must have at least 1 pill'),
  
    img: Yup.mixed()
    .test('fileRequired', 'Please upload an image', (value) => {
      return value && value[0]; 
    })
    .test('fileSize', 'File is too large (Max 2MB)', (value) => {
      if (!value || !value[0]) return true;  
      return value[0].size <= 2000000;  
    })
    .test('fileType', 'Unsupported File Format. Please upload a JPEG, PNG, or GIF image', (value) => {
      if (!value || !value[0]) return true;  
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
    }),
  

});


const ProductModal = ({ show, handleClose, getList }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('dose', data.dose);
    formData.append('discount', data.discount);
    formData.append('pills', data.pills);
    formData.append('img', data.img[0]);  // Append only the first image

    setIsSubmitting(true);

    try {
      const result = await adminAddProduct(formData);
      if (result?.code === 201) {
        toast.success(result.message); 
        getList();
        reset(); // Reset the form after successful submission
        handleClose(); // Close the modal
      } else {
        toast.error(result?.message || 'Failed to add product. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again later.');
    }

    setIsSubmitting(false);
  };
  const closeModal = () => {
    reset(); // Reset the form when modal closes
    handleClose(); // Call the parent's handleClose function
  };

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton style={{ backgroundColor: '#00796b', color: '#fff' }} >
        <Modal.Title style={{ backgroundColor: '#00796b', color: '#fff' }}>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Product Name</Form.Label>
            <Form.Control
              type="text"
              {...register('name')}
              placeholder="Enter product name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Price</Form.Label>
            <Form.Control
              type="text"
              {...register('price')}
              placeholder="Enter price"
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Number of Pills</Form.Label>
            <Form.Control
              type="text"
              {...register('pills')}
              placeholder="Enter number of pills"
              isInvalid={!!errors.pills}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pills?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Dose in (mg) </Form.Label>
            <Form.Control
              type="text"
              {...register('dose')}
              placeholder="Enter dose"
              isInvalid={!!errors.dose}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dose?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Discount in %</Form.Label>
            <Form.Control
              type="text"
              {...register('discount')}
              placeholder="Enter discount"
              isInvalid={!!errors.discount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.discount?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#00796b' }}>Product Image</Form.Label>
            <Form.Control
              type="file"
              {...register('img')}
              isInvalid={!!errors.img}
            />
            <Form.Control.Feedback type="invalid">
              {errors.img?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting} style={{ backgroundColor: '#00796b', borderColor: '#00796b', width: '100%' }}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
