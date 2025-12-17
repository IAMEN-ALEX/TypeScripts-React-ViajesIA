'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';

const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register, isLoading: loading, error, setError } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        await register(formData.name, formData.email, formData.password);
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            <FloatingLines />

            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="glass-card p-4">
                        <h2 className="text-center mb-4 text-white title-glow">Crear Cuenta</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit} autoComplete="off">
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="premium-input"
                                    autoComplete="off"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="premium-input"
                                    autoComplete="off"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="premium-input"
                                    autoComplete="new-password"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="premium-input"
                                    autoComplete="new-password"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 btn-premium-neon mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Crear Cuenta'}
                            </Button>

                            <div className="text-center">
                                <span className="text-white">¿Ya tienes cuenta? </span>
                                <Button
                                    variant="link"
                                    className="text-info p-0"
                                    onClick={() => router.push('/login')}
                                >
                                    Inicia Sesión
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
