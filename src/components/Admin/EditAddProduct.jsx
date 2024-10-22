import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminEditProduct } from '../services/index';

// Validation schema using Yup
const schema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    price: Yup.number()
        .typeError('Price must be a valid number')
        .required('Price is required')
        .positive('Price must be a positive number'),
    dose: Yup.string().required('Dose is required'),
    discount: Yup.number()
        .typeError('Discount must be a valid number')
        .required('Discount is required')
        .min(0, 'Discount cannot be negative'),
    pills: Yup.number()
        .typeError('Number of pills must be a valid number')
        .required('Number of pills is required')
        .integer('Must be a whole number')
        .min(1, 'Must have at least 1 pill'),
        outofstock: Yup.boolean().required('Please select if the product is out of stock'),
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

const EditProductModal = ({ show, handleeditClose, getList, existingProduct }) => {

    console.log(existingProduct,"####$$$$$$$$$$$$$$$$$");
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (existingProduct) {
            setValue('name', existingProduct.name);
            setValue('price', existingProduct.price);
            setValue('dose', existingProduct.dose);
            setValue('discount', existingProduct.discount);
            setValue('pills', existingProduct.pills);
            setValue('outofstock', existingProduct.outofstock || false); // Set default value for outOfStock
            // setValue('img', existingProduct.img);
        } else {
            reset();
        }
    }, [existingProduct, setValue, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('dose', data.dose);
        formData.append('discount', data.discount);
        formData.append('pills', data.pills);
        formData.append('outofstock', data.outofstock); // Directly use the boolean value
        formData.append('img', data.img[0]);

        try {
            const result = await adminEditProduct(existingProduct._id, formData);
            if (result?.code === 200) {
                toast.success(result.message);
                getList();
                reset(); // Reset the form after successful submission
                handleeditClose(); // Close the modal
            } else {
                toast.error(result?.message || 'Failed to add product. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again later.');
        }

        setIsSubmitting(false);
    };

    return (
        <Modal show={show} onHide={handleeditClose}>
            <Modal.Header closeButton style={{ backgroundColor: '#00796b', color: '#fff' }}>
                <Modal.Title style={{ backgroundColor: '#00796b', color: '#fff' }}>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("name")}
                            isInvalid={!!errors.name}
                            placeholder="Enter product name"
                        />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Price</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("price")}
                            isInvalid={!!errors.price}
                            placeholder="Enter price"
                        />
                        <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Dose (mg)</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("dose")}
                            isInvalid={!!errors.dose}
                            placeholder="Enter dose"
                        />
                        <Form.Control.Feedback type="invalid">{errors.dose?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Discount (%)</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("discount")}
                            isInvalid={!!errors.discount}
                            placeholder="Enter discount"
                        />
                        <Form.Control.Feedback type="invalid">{errors.discount?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Number of Pills</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("pills")}
                            isInvalid={!!errors.pills}
                            placeholder="Enter number of pills"
                        />
                        <Form.Control.Feedback type="invalid">{errors.pills?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Out of Stock</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Check
                                type="radio"
                                label="Yes"
                                value={true} // Ensure it is a boolean
                                {...register("outofstock")}
                                isInvalid={!!errors.outofstock}
                                defaultChecked={existingProduct?.outofstock === true}
                                inline
                            />
                            <Form.Check
                                type="radio"
                                label="No"
                                value={false} // Ensure it is a boolean
                                {...register("outofstock")}
                                defaultChecked={existingProduct?.outofstock === false}
                                inline
                            />
                        </div>
                        <Form.Control.Feedback type="invalid">{errors.outofstock?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: '#00796b' }}>Upload Image</Form.Label>
                        <Form.Control
                            type="file"
                            {...register("img")}
                            isInvalid={!!errors.img}
                        />
                        <Form.Control.Feedback type="invalid">{errors.img?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting} style={{ backgroundColor: '#00796b', borderColor: '#00796b', width: '100%' }}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditProductModal;
