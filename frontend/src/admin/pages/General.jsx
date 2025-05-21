import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNotifications } from '../components/Notification';

export default function General() {
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({});
  const { notify, RenderNotifications } = useNotifications();

  useEffect(() => {
    axios.get('/api/general').then(res => {
      setInfo(res.data);
      setForm(res.data);
    });
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    try {
      await axios.put('/api/general', form);
      notify('General info updated','success');
    } catch {
      notify('Update failed','danger');
    }
  };

  return (
    <Container>
      <RenderNotifications/>
      <h3>Main Data</h3>
      <Form>
        {['username','email','phoneNumber','address','password'].map(field => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>
              {field.charAt(0).toUpperCase()+field.slice(1)}
            </Form.Label>
            <Form.Control
              name={field}
              type={field==='password'?'password':'text'}
              value={form[field]||''}
              onChange={handleChange}
            />
          </Form.Group>
        ))}
        <Button onClick={save}>Save Changes</Button>
      </Form>
    </Container>
  );
}
