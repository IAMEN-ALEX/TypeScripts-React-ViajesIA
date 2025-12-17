import { useState, useEffect, useCallback } from 'react';
import { TripWithNotes, Trip } from '@/types';

export const useTrips = () => {
    const [trips, setTrips] = useState<TripWithNotes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getHeaders = () => {
        const userId = localStorage.getItem('userId') || '';
        return {
            'Content-Type': 'application/json',
            'x-user-id': userId
        };
    };

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            const res = await fetch('/api/trips', {
                headers: { 'x-user-id': userId }
            });
            const data = await res.json();

            if (!Array.isArray(data)) {
                setTrips([]);
                return;
            }

            const tripsWithNotes = await Promise.all(data.map(async (trip: Trip) => {
                const notesRes = await fetch(`/api/notes?trip_id=${trip.id}`, {
                    headers: { 'x-user-id': userId }
                });
                const notes = await notesRes.json();
                return { ...trip, notes };
            }));

            setTrips(tripsWithNotes);
        } catch (error) {
            console.error('Error fetching trips:', error);
            setError('Error fetching trips');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const addTrip = async (destination: string, startDate: string, endDate: string) => {
        try {
            await fetch('/api/trips', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ destination, start_date: startDate, end_date: endDate }),
            });
            await fetchTrips();
        } catch (error) {
            console.error('Error adding trip:', error);
        }
    };

    const deleteTrip = async (id: number) => {
        try {
            await fetch(`/api/trips?id=${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            await fetchTrips();
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    const addNote = async (tripId: number, content: string) => {
        try {
            await fetch('/api/notes', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ trip_id: tripId, content }),
            });
            await fetchTrips();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const deleteNote = async (id: number) => {
        try {
            await fetch(`/api/notes?id=${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            await fetchTrips();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const updateNote = async (id: number, content: string) => {
        try {
            await fetch('/api/notes', {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ id, content }),
            });
            await fetchTrips();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return {
        trips,
        loading,
        error,
        fetchTrips,
        addTrip,
        deleteTrip,
        addNote,
        deleteNote,
        updateNote
    };
};
