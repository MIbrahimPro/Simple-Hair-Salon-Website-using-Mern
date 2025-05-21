import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          height: '80vh',
          background: 'url(/hero-bg.jpg) center/cover no-repeat'
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">Welcome to HairSalon</h1>
          <p className="lead mb-4">Experience luxury hair care tailored just for you.</p>
          <Button as={Link} to="/booking" size="lg" variant="primary">
            Book an Appointment
          </Button>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="py-5 text-center">
        <h2>Ready for a New Look?</h2>
        <p className="mb-4">Our expert stylists are here to give you the transformation you deserve.</p>
        <Button as={Link} to="/services" variant="outline-secondary">View Services</Button>
      </Container>

      {/* About Us */}
      <Container className="py-5">
        <h2>About Us</h2>
        <p>
          At HairSalon, we blend creativity with precision. From classic cuts to modern styles,
          our certified professionals use only high‑quality products to ensure you leave feeling confident.
        </p>
      </Container>
    </>
  );
}
