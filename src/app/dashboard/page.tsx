'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Spinner, Badge, Dropdown } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';

// Dynamically import FloatingLines
const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

interface Note {
    id: number;
    trip_id: number;
    content: string;
}

interface Trip {
    id: number;
    destination: string;
    start_date: string;
    end_date: string;
    notes?: Note[];
}

export default function Dashboard() {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [userName, setUserName] = useState('');

    const destinations = ["Francia", "España", "Estados Unidos", "Italia", "Turquía", "México", "Reino Unido", "Alemania", "Tailandia", "Japón", "Grecia", "Austria", "Emiratos Árabes Unidos", "Países Bajos", "Arabia Saudita", "Suiza", "Portugal", "Canadá", "India", "Australia", "Singapur", "Malasia", "Vietnam", "Indonesia", "Egipto", "Marruecos", "Argentina", "Brasil", "Perú", "Chile", "Taiwán", "Barbados"];

    useEffect(() => {
        fetchTrips();
        setUserName(localStorage.getItem('userName') || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userName');
        router.push('/login');
    };

    const fetchTrips = async () => {
        try {
            const res = await fetch('/api/trips');
            const data = await res.json();

            const tripsWithNotes = await Promise.all(data.map(async (trip: Trip) => {
                const notesRes = await fetch(`/api/notes?trip_id=${trip.id}`);
                const notes = await notesRes.json();
                return { ...trip, notes };
            }));

            setTrips(tripsWithNotes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trips:', error);
            setLoading(false);
        }
    };

    const handleAddTrip = async () => {
        if (!destination || !startDate || !endDate) return;

        try {
            await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, start_date: startDate, end_date: endDate }),
            });
            setDestination('');
            setStartDate('');
            setEndDate('');
            fetchTrips();
        } catch (error) {
            console.error('Error adding trip:', error);
        }
    };

    const handleDeleteTrip = async (id: number) => {
        try {
            await fetch(`/api/trips?id=${id}`, { method: 'DELETE' });
            fetchTrips();
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    const handleAddNote = async (tripId: number, content: string) => {
        if (!content) return;
        try {
            await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trip_id: tripId, content }),
            });
            fetchTrips();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
            fetchTrips();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleStartEdit = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingContent(note.content);
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditingContent('');
    };

    const handleSaveEdit = async (id: number) => {
        try {
            await fetch('/api/notes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, content: editingContent }),
            });
            setEditingNoteId(null);
            setEditingContent('');
            fetchTrips();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleAskQuestion = async () => {
        if (!question) return;
        setAiLoading(true);
        setAiResponse('');
        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            setAiResponse(data.answer);
        } catch (error) {
            console.error('Error asking AI:', error);
            setAiResponse('Error connecting to AI service.');
        } finally {
            setAiLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="premium-bg d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    return (
        <div className="premium-bg pb-5 position-relative min-vh-100 overflow-hidden">
            {/* Background Animation */}
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
                <FloatingLines
                    linesGradient={['#C084FC', '#E879F9', '#818CF8']}
                    lineCount={[6, 8, 10]}
                    animationSpeed={0.3}
                />
            </div>

            <Container className="py-5 position-relative" style={{ maxWidth: '900px', zIndex: 10 }}>
                <div className="d-flex justify-content-end mb-4">
                    <div className="d-flex flex-column align-items-end gap-2">
                        {userName && (
                            <div className="text-white d-flex align-items-center gap-2">
                                <span style={{ opacity: 0.7 }}>Usuario:</span>
                                <span className="fw-bold title-glow" style={{ fontSize: '1.1rem' }}>{userName}</span>
                            </div>
                        )}
                        <Button
                            variant="outline-light"
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-pill"
                            style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.1)' }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Ask a Question Section */}
                <div className="mb-5 text-center">
                    <h2 className="text-white mb-4 title-glow">Hace una Pregunta acerca de los viajes!</h2>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            className="premium-input mb-3"
                            style={{ height: '50px' }}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button
                            className="btn-premium-neon py-2"
                            onClick={handleAskQuestion}
                            disabled={aiLoading}
                        >
                            {aiLoading ? <Spinner size="sm" animation="border" /> : 'Pregunta'}
                        </Button>
                    </div>
                    {aiResponse && (
                        <div className="mt-4 p-3 rounded-3 text-start" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="text-white mb-0">Respuesta IA:</h5>
                                <Button variant="link" className="text-white p-0" style={{ textDecoration: 'none' }} onClick={() => setAiResponse('')}>✕</Button>
                            </div>
                            <p className="text-white-50 mb-0" style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
                        </div>
                    )}
                </div>

                {/* Add Trip Section */}
                <div className="mb-5">
                    <h3 className="text-white text-center mb-4 title-glow">Agrega un viaje</h3>
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
                                        {destinations.map(d => (
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
                                <Button className="btn-premium-neon w-100 h-100 d-flex align-items-center justify-content-center" onClick={handleAddTrip}>
                                    Agregar Viaje
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Trips List */}
                <div className="d-flex flex-column gap-4">
                    {trips.map(trip => (
                        <div key={trip.id} className="premium-card">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold text-white fs-4">
                                    {trip.start_date} - {trip.end_date}
                                </h5>
                                <div className="d-flex align-items-center gap-3">
                                    <Badge className="fs-6 px-3 py-2" style={{ background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', color: '#555', border: '1px solid #fff' }}>
                                        {trip.destination}
                                    </Badge>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteTrip(trip.id)}>
                                        Eliminar Viaje
                                    </Button>
                                </div>
                            </div>

                            {/* Notes List */}
                            <div className="d-flex flex-column gap-2 mb-3">
                                {trip.notes?.map(note => (
                                    <div key={note.id} className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {editingNoteId === note.id ? (
                                            <>
                                                <Form.Control
                                                    type="text"
                                                    className="premium-input me-2"
                                                    value={editingContent}
                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                />
                                                <div className="d-flex gap-2">
                                                    <Button variant="success" size="sm" onClick={() => handleSaveEdit(note.id)}>Guardar</Button>
                                                    <Button variant="secondary" size="sm" onClick={handleCancelEdit}>Cancelar</Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-white">{note.content}</span>
                                                <div className="d-flex gap-2">
                                                    <Button variant="info" size="sm" onClick={() => handleStartEdit(note)}>Editar</Button>
                                                    <Button variant="danger" size="sm" style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} onClick={() => handleDeleteNote(note.id)}>
                                                        x
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Note */}
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Add a note"
                                    className="premium-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddNote(trip.id, (e.target as HTMLInputElement).value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                />
                                <Button className="btn-premium-neon px-4" onClick={(e) => {
                                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                    handleAddNote(trip.id, input.value);
                                    input.value = '';
                                }}>
                                    Agregar Nota
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
