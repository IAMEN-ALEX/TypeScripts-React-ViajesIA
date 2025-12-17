'use client';

import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

interface AIAssistantProps {
    // Optionally we can pass a callback if we want the parent to know
}

export default function AIAssistant() {
    const [question, setQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

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

    return (
        <div className="mb-5 text-center">
            <h2 className="text-white mb-4 title-glow">Haz una Pregunta acerca de tus viajes!</h2>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    className="premium-input mb-3"
                    style={{ height: '50px' }}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskQuestion();
                    }}
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
    );
}
