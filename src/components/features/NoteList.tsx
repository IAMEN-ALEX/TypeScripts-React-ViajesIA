'use client';

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Note } from '@/types';

interface NoteListProps {
    tripId: number;
    notes: Note[];
    onAddNote: (tripId: number, content: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
    onUpdateNote: (id: number, content: string) => Promise<void>;
}

export default function NoteList({ tripId, notes, onAddNote, onDeleteNote, onUpdateNote }: NoteListProps) {
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');

    const handleStartEdit = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingContent(note.content);
    };

    const handleSaveEdit = async (id: number) => {
        if (!editingContent.trim()) return;
        await onUpdateNote(id, editingContent);
        setEditingNoteId(null);
        setEditingContent('');
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditingContent('');
    };

    return (
        <div className="d-flex flex-column gap-2 mb-3">
            {/* List Notes */}
            <div className="d-flex flex-column gap-2 mb-3">
                {notes?.map(note => (
                    <div key={note.id} className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {editingNoteId === note.id ? (
                            <>
                                <Form.Control
                                    type="text"
                                    className="premium-input me-2"
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    // Add Enter to save support
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveEdit(note.id);
                                        }
                                    }}
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
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                                        onClick={() => onDeleteNote(note.id)}
                                    >
                                        x
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Note Input */}
            <div className="d-flex gap-2">
                <Form.Control
                    type="text"
                    placeholder="Add a note"
                    className="premium-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onAddNote(tripId, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                />
                <Button className="btn-premium-neon px-4" onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (input.value.trim()) {
                        onAddNote(tripId, input.value);
                        input.value = '';
                    }
                }}>
                    Agregar Nota
                </Button>
            </div>
        </div>
    );
}
