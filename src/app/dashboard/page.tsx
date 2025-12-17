'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Spinner } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TripWithNotes, Trip } from '@/types';
import { useTrips } from '@/hooks/useTrips';
import TripForm from '@/components/features/TripForm';
import TripList from '@/components/features/TripList';
import AIAssistant from '@/components/features/AIAssistant';
import NoteList from '@/components/features/NoteList';

// Dynamically import FloatingLines
const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

export default function Dashboard() {
    const router = useRouter();
    const { trips, loading, addTrip, deleteTrip, addNote, deleteNote, updateNote } = useTrips();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        setUserName(localStorage.getItem('userName') || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        router.push('/login');
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

                <AIAssistant />

                <TripForm onAddTrip={addTrip} />

                <TripList
                    trips={trips}
                    onDeleteTrip={deleteTrip}
                    onAddNote={addNote}
                    onDeleteNote={deleteNote}
                    onUpdateNote={updateNote}
                />

                <footer style={{ textAlign: 'center', padding: '1rem', opacity: 0.7, marginTop: '2rem' }}>
                    <span className="text-white">Desarrollado por <strong>IAMEN-ALEX</strong></span>
                </footer>
            </Container>
        </div>
    );
}
