import { useEffect, useState } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNotifications } from '../components/Notification';

export default function Bookings() {
  const [list, setList] = useState([]);
  const [edited, setEdited] = useState({});
  const { notify, RenderNotifications } = useNotifications();

  useEffect(() => {
    axios.get('/api/bookings')
      .then(res => setList(res.data))
      .catch(err => {
        console.error(err);
        notify('Failed to load bookings', 'danger');
      });
  }, []);

  const handleStatusChange = (id, status) => {
    setEdited(e => ({ ...e, [id]: status }));
  };

  const save = async id => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status: edited[id] });
      setList(lst =>
        lst.map(b => b._id === id ? { ...b, status: edited[id] } : b)
      );
      setEdited(e => { const { [id]:_, ...rest } = e; return rest; });
      notify('Status updated', 'success');
    } catch {
      notify('Update failed', 'danger');
    }
  };

  return (
    <Container>
      <RenderNotifications/>
      <h3>All Bookings</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>            {/* <- New column */}
            <th>Phone</th>
            <th>Service</th>
            <th>Date &amp; Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map(b => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>
                {b.email
                  ? <a href={`mailto:${b.email}`}>{b.email}</a>
                  : <span className="text-muted">—</span>
                }
              </td>
              <td>{b.phoneNumber}</td>
              <td>{b.service.name}</td>
              <td>
                {new Date(b.date).toLocaleDateString()} {b.time}
              </td>
              <td>
                <Form.Select
                  value={edited[b._id] ?? b.status}
                  onChange={e => handleStatusChange(b._id, e.target.value)}
                >
                  {['pending','confirmed','completed','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Form.Select>
              </td>
              <td>
                {edited[b._id] && (
                  <Button size="sm" onClick={() => save(b._id)}>
                    Save
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
