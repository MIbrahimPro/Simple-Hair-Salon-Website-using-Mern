import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

export default function Booking() {
    const [searchParams] = useSearchParams();
    const initialService = searchParams.get('service') || '';
    const [form, setForm] = useState({
        service: initialService,
        name: '',
        email: '',
        phoneNumber: '',
        date: '',
        time: '',
    });
    const [services, setServices] = useState([]);
    const [status, setStatus] = useState(null);

    // fetch services for dropdown
    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(setServices)
            .catch(console.error);
    }, []);

    // if the query param changes (unlikely), update form.service
    useEffect(() => {
        if (initialService) {
            setForm(f => ({ ...f, service: initialService }));
        }
    }, [initialService]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus(null);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Booking failed');
            setStatus({ type: 'success', msg: 'Appointment requested!' });
            setForm({ service: initialService, name: '', email: '', phoneNumber: '', date: '', time: '' });
        } catch (err) {
            setStatus({ type: 'danger', msg: err.message });
        }
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Book an Appointment</h2>
            {status && <Alert variant={status.type}>{status.msg}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Service</Form.Label>
                            <Form.Select
                                name="service"
                                value={form.service}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Service</option>
                                {services.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email (optional)</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" variant="primary">Submit</Button>
            </Form>
        </Container>
    );
}
