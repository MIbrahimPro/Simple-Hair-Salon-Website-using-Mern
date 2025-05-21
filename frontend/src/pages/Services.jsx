import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Services.css';

function ImageCompare({ beforeSrc, afterSrc }) {
  const containerRef = useRef();
  const overlayRef   = useRef();
  const sliderRef    = useRef();
  const clicked      = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const overlay   = overlayRef.current;
    const slider    = sliderRef.current;

    // Measure after the browser has laid out everything
    const reset = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      // start overlay at 50%
      overlay.style.width = (w / 2) + 'px';
      // center the slider
      slider.style.top  = (h / 2 - slider.offsetHeight / 2) + 'px';
      slider.style.left = (w / 2 - slider.offsetWidth  / 2) + 'px';
    };

    // Call once after images load
    reset();
    window.addEventListener('resize', reset);

    const getCursorPos = e => {
      const rect = container.getBoundingClientRect();
      e = e.changedTouches ? e.changedTouches[0] : e;
      let x = e.pageX - rect.left - window.pageXOffset;
      return Math.max(0, Math.min(x, container.offsetWidth));
    };

    const slideReady = e => {
      e.preventDefault();
      clicked.current = true;
      window.addEventListener('mousemove', slideMove);
      window.addEventListener('touchmove',  slideMove);
    };
    const slideFinish = () => {
      clicked.current = false;
      window.removeEventListener('mousemove', slideMove);
      window.removeEventListener('touchmove',  slideMove);
    };
    const slideMove = e => {
      if (!clicked.current) return;
      const pos = getCursorPos(e);
      overlay.style.width = pos + 'px';
      slider.style.left   = (overlay.offsetWidth - slider.offsetWidth / 2) + 'px';
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

export default function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const goToBooking = id => navigate(`/booking?service=${id}`);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Our Services</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {services.map(svc => (
          <Col key={svc._id}>
            <Card className="service-card h-100">
              <ImageCompare
                beforeSrc={svc.beforeImage.startsWith('/') ? svc.beforeImage : `/${svc.beforeImage}`}
                afterSrc={svc.afterImage.startsWith('/')  ? svc.afterImage  : `/${svc.afterImage}`}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{svc.name}</Card.Title>
                <Card.Text className="service-desc">{svc.description}</Card.Text>
                <Card.Text className="fw-bold mb-3">
                  ${svc.price.toFixed(2)} &bull; {svc.durationInMinutes} min
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => goToBooking(svc._id)}
                  className="mt-auto"
                >
                  Make Appointment
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
