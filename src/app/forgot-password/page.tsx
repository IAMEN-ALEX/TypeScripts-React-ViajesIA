'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import dynamic from 'next/dynamic';

const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!email || !newPassword || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Contraseña actualizada exitosamente. Redirigiendo al login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Error al restablecer contraseña');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            <FloatingLines />

            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="glass-card p-4">
                        <h2 className="text-center mb-4 text-white title-glow">Restablecer Contraseña</h2>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="premium-input"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="premium-input"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="premium-input"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 btn-premium-neon mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                            </Button>

                            <div className="text-center">
                                <Button
                                    variant="link"
                                    className="text-info p-0"
                                    onClick={() => router.push('/login')}
                                >
                                    Volver al Login
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
