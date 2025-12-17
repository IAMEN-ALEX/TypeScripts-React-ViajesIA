'use client';

import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { TripWithNotes } from '@/types';
import NoteList from './NoteList';

interface TripListProps {
    trips: TripWithNotes[];
    onDeleteTrip: (id: number) => Promise<void>;
    onAddNote: (tripId: number, content: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
    onUpdateNote: (id: number, content: string) => Promise<void>;
}

export default function TripList({ trips, onDeleteTrip, onAddNote, onDeleteNote, onUpdateNote }: TripListProps) {
    return (
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
                            <Button variant="danger" size="sm" onClick={() => onDeleteTrip(trip.id)}>
                                Eliminar Viaje
                            </Button>
                        </div>
                    </div>

                    <NoteList
                        tripId={trip.id}
                        notes={trip.notes || []}
                        onAddNote={onAddNote}
                        onDeleteNote={onDeleteNote}
                        onUpdateNote={onUpdateNote}
                    />
                </div>
            ))}
        </div>
    );
}
