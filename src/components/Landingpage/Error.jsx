import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();
useEffect(()=>{
    navigate('/');
},[navigate])
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#ececec' }}>
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="display-1 text-primary">404</h1>
            <h2 className="mb-4">Oops! Page Not Found</h2>
            <p className="mb-4">
              The page you're looking for doesn't exist or has been moved. Please check the URL or head back to the homepage.
            </p>
            <Button variant="primary" size="lg" onClick={goHome}>
              Go Home
            </Button>
          </Col>
        </Row>
        {/* Uncomment if you want to add an image */}
        {/* <Row>
          <Col>
            <img
              src="https://via.placeholder.com/400x300"
              alt="404 Not Found"
              className="img-fluid mt-4"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Col>
        </Row> */}
      </Container>
    </div>
  );
}

export default Error;
