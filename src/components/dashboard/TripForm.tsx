'use client';

import React, { useState } from 'react';
import { Row, Col, Form, Button, Dropdown } from 'react-bootstrap';

interface TripFormProps {
    onAddTrip: (destination: string, startDate: string, endDate: string) => Promise<void>;
}

const DESTINATIONS = ["Francia", "España", "Estados Unidos", "Italia", "Turquía", "México", "Reino Unido", "Alemania", "Tailandia", "Japón", "Grecia", "Austria", "Emiratos Árabes Unidos", "Países Bajos", "Arabia Saudita", "Suiza", "Portugal", "Canadá", "India", "Australia", "Singapur", "Malasia", "Vietnam", "Indonesia", "Egipto", "Marruecos", "Argentina", "Brasil", "Perú", "Chile", "Taiwán", "Barbados"];

export default function TripForm({ onAddTrip }: TripFormProps) {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async () => {
        if (!destination || !startDate || !endDate) return;
        await onAddTrip(destination, startDate, endDate);
        // Reset form
        setDestination('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="mb-5">
            <h3 className="text-white text-center mb-4 title-glow d-flex align-items-center justify-content-center gap-3">
                Agrega un viaje
                {destination && (
                    <span
                        className="fs-6 px-3 py-2 badge"
                        style={{
                            background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                            color: '#555',
                            border: '1px solid #fff'
                        }}
                    >
                        {destination}
                    </span>
                )}
            </h3>
            <div className="bg-transparent">
                <Row className="g-3 align-items-end">
                    <Col md={4}>
                        <Dropdown onSelect={(eventKey) => setDestination(eventKey || '')}>
                            <Dropdown.Toggle
                                className="premium-select w-100 d-flex justify-content-between align-items-center text-start"
                                id="dropdown-destination"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    padding: '12px 15px',
                                }}
                                variant="transparent"
                            >
                                {destination || 'Seleccionar Destino'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100 premium-dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {DESTINATIONS.map(d => (
                                    <Dropdown.Item key={d} eventKey={d} className="text-white premium-dropdown-item">
                                        {d}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col md={3}>
                        <Form.Control
                            type="date"
                            className="premium-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Control
                            type="date"
                            className="premium-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button className="btn-premium-neon w-100 h-100 d-flex align-items-center justify-content-center" onClick={handleSubmit}>
                            Agregar Viaje
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
