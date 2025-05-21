import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from '../components/Notification';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const nav = useNavigate();
  const { notify, RenderNotifications } = useNotifications();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/general/login', creds);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      notify('Logged in!', 'success');
      nav('/admin/bookings');
    } catch {
      notify('Login failed', 'danger');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
      <RenderNotifications/>
      <Card style={{ width: '380px' }}>
        <Card.Body>
          <h4 className="mb-3">Admin Login</h4>
          <Form onSubmit={submit}>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={creds.username}
                onChange={e => setCreds({...creds, username: e.target.value})}
                required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={creds.password}
                onChange={e => setCreds({...creds, password: e.target.value})}
                required />
            </Form.Group>
            <Button type="submit" className="w-100">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
