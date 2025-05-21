// src/pages/AdminServices.jsx
import { useEffect, useState, useRef } from 'react';
import {
  Container, Row, Col, Card,
  Button, Modal, Form
} from 'react-bootstrap';
import axios from 'axios';
import { useNotifications } from '../components/Notification';
import './AdminServices.css';

// === ImageCompare defined in-place ===
function ImageCompare({ beforeSrc, afterSrc }) {
  const containerRef = useRef();
  const overlayRef   = useRef();
  const sliderRef    = useRef();
  const clicked      = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const slider    = sliderRef.current;

    const reset = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      overlay.style.width = (w / 2) + 'px';
      slider.style.top  = (h / 2 - slider.offsetHeight / 2) + 'px';
      slider.style.left = (w / 2 - slider.offsetWidth  / 2) + 'px';
    };

    reset();
    window.addEventListener('resize', reset);

    const getCursorPos = e => {
      const rect = container.getBoundingClientRect();
      e = e.changedTouches ? e.changedTouches[0] : e;
      let x = e.pageX - rect.left - window.pageXOffset;
      return Math.max(0, Math.min(x, container.offsetWidth));
    };
    const slideMove = e => {
      if (!clicked.current) return;
      const pos = getCursorPos(e);
      overlay.style.width = pos + 'px';
      slider.style.left   = (overlay.offsetWidth - slider.offsetWidth / 2) + 'px';
    };
    const slideReady = e => {
      e.preventDefault();
      clicked.current = true;
      window.addEventListener('mousemove', slideMove);
      window.addEventListener('touchmove', slideMove);
    };
    const slideFinish = () => {
      clicked.current = false;
      window.removeEventListener('mousemove', slideMove);
      window.removeEventListener('touchmove', slideMove);
    };

    slider.addEventListener('mousedown', slideReady);
    slider.addEventListener('touchstart', slideReady);
    window.addEventListener('mouseup',   slideFinish);
    window.addEventListener('touchend',  slideFinish);

    return () => {
      window.removeEventListener('resize', reset);
      slider.removeEventListener('mousedown', slideReady);
      slider.removeEventListener('touchstart', slideReady);
      window.removeEventListener('mouseup',   slideFinish);
      window.removeEventListener('touchend',  slideFinish);
      window.removeEventListener('mousemove', slideMove);
      window.removeEventListener('touchmove',  slideMove);
    };
  }, []);

  return (
    <div className="img-comp-container" ref={containerRef}>
      <div className="img-comp-img">
        <img src={afterSrc} alt="After" />
      </div>
      <div className="img-comp-img img-comp-overlay" ref={overlayRef}>
        <img src={beforeSrc} alt="Before" />
      </div>
      <div className="img-comp-slider" ref={sliderRef}></div>
    </div>
  );
}

export default function AdminServices() {
  const [list, setList] = useState([]);
  const [showModal, setShow] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});
  const [previews, setPreviews] = useState({});
  const { notify, RenderNotifications } = useNotifications();

  useEffect(() => {
    axios.get('/api/services').then(res => setList(res.data));
  }, []);

  const openModal = svc => {
    setCurrent(svc || null);
    setForm(svc ? { ...svc } : {});
    setPreviews({});
    setShow(true);
  };

  const handleFile = e => {
    const { name, files } = e.target;
    if (!files[0]) return;
    setForm(f => ({ ...f, [name]: files[0] }));
    setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const save = async () => {
    try {
      let data = { ...form };
      if (form.beforeImage instanceof File || form.afterImage instanceof File) {
        const fd = new FormData();
        if (form.beforeImage instanceof File) fd.append('beforeImage', form.beforeImage);
        if (form.afterImage  instanceof File) fd.append('afterImage',  form.afterImage);
        const resUp = await axios.post('/api/upload', fd);
        data = { ...data, ...resUp.data };
      }
      let res;
      if (current) {
        res = await axios.put(`/api/services/${current._id}`, data);
        setList(l => l.map(s => s._id === current._id ? res.data : s));
        notify('Service updated','success');
      } else {
        res = await axios.post('/api/services', data);
        setList(l => [...l, res.data]);
        notify('Service added','success');
      }
      setShow(false);
    } catch {
      notify('Save failed','danger');
    }
  };

  return (
    <Container className="py-4">
      <RenderNotifications/>
      <h3 className="mb-3">Services</h3>
      <Button onClick={() => openModal(null)} className="mb-4">Add Service</Button>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {list.map(s => (
          <Col key={s._id}>
            <Card className="admin-service-card h-100">
              <ImageCompare
                beforeSrc={s.beforeImage.startsWith('/') ? s.beforeImage : `/${s.beforeImage}`}
                afterSrc={s.afterImage.startsWith('/')  ? s.afterImage  : `/${s.afterImage}`}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{s.name}</Card.Title>
                <Card.Text className="admin-service-desc">
                  {s.description}
                </Card.Text>
                <Card.Text className="fw-bold mb-2">
                  ${s.price.toFixed(2)} &bull; {s.durationInMinutes} min
                </Card.Text>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal(s)}
                  className="mt-auto align-self-start"
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== Modal ===== */}
      <Modal show={showModal} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{current ? 'Edit' : 'Add'} Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['name','description','price','durationInMinutes'].map(field => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  name={field}
                  value={form[field]||''}
                  onChange={handleChange}
                  type={field==='price' ? 'number' :
                        field==='durationInMinutes' ? 'number' : 'text'}
                />
              </Form.Group>
            ))}
            {['beforeImage','afterImage'].map(name => (
              <Form.Group key={name} className="mb-2">
                <Form.Label>{name}</Form.Label>
                <Form.Control type="file" name={name} onChange={handleFile} />
                {previews[name] && (
                  <img
                    src={previews[name]}
                    alt=""
                    style={{ width: '100%', marginTop: '8px' }}
                  />
                )}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
