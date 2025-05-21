import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    nav('/admin/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/admin/bookings">Salon Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-nav" />
        <Navbar.Collapse id="admin-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/admin/bookings">Bookings</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/general">Main Data</Nav.Link>
          </Nav>
          <Button variant="outline-light" size="sm" onClick={logout}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
