// src/components/Footer.jsx
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch('/api/general')
      .then(res => res.json())
      .then(data => setInfo(data))
      .catch(console.error);
  }, []);

  if (!info) return null; // or a spinner

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Contact Us</h5>
            <p className="mb-1">Phone: {info.phoneNumber}</p>
            <p className="mb-1">Email: {info.email}</p>
            <p>Address: {info.address}</p>
          </Col>
          <Col md={6} className="text-md-end">
            <small>© {new Date().getFullYear()} All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
