'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Spinner } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TripWithNotes, Trip } from '@/types';
import TripForm from '@/components/dashboard/TripForm';
import TripList from '@/components/dashboard/TripList';
import AIAssistant from '@/components/dashboard/AIAssistant';

// Dynamically import FloatingLines
const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

export default function Dashboard() {
    const router = useRouter();
    const [trips, setTrips] = useState<TripWithNotes[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

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

    const handleAddTrip = async (destination: string, startDate: string, endDate: string) => {
        try {
            await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, start_date: startDate, end_date: endDate }),
            });
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

    const handleUpdateNote = async (id: number, content: string) => {
        try {
            await fetch('/api/notes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, content }),
            });
            fetchTrips();
        } catch (error) {
            console.error('Error updating note:', error);
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

                <AIAssistant />

                <TripForm onAddTrip={handleAddTrip} />

                <TripList
                    trips={trips}
                    onDeleteTrip={handleDeleteTrip}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                    onUpdateNote={handleUpdateNote}
                />

                <footer style={{ textAlign: 'center', padding: '1rem', opacity: 0.7, marginTop: '2rem' }}>
                    <span className="text-white">Desarrollado por <strong>IAMEN-ALEX</strong></span>
                </footer>
            </Container>
        </div>
    );
}
