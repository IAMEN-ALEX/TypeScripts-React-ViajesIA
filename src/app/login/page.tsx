'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Form, Button } from 'react-bootstrap';

// Dynamically import FloatingLines
const FloatingLines = dynamic(() => import('@/components/ui/FloatingLines'), { ssr: false });

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                const userName = data.user?.name || data.user?.email || 'Usuario';
                localStorage.setItem('userName', userName);
                router.push('/dashboard');
                // In a real app, you might want to redirect to dashboard or user page
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden">
            {/* Background */}
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
                <FloatingLines
                    linesGradient={['#C084FC', '#E879F9', '#818CF8']}
                    lineCount={[6, 8, 10]}
                    animationSpeed={0.3}
                />
            </div>

            {/* Login Card */}
            <div className="glass-card p-5 position-relative" style={{ width: '100%', maxWidth: '420px', zIndex: 10 }}>
                <h1 className="text-white text-center fw-bold mb-5" style={{ fontSize: '2.5rem' }}>
                    Bienvenido a Viajando con la IA
                </h1>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-4 position-relative" controlId="formBasicEmail">
                        <Form.Label className="text-white fw-semibold ms-1">Username</Form.Label>
                        <div className="position-relative">
                            <span className="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>
                            </span>
                            <Form.Control
                                type="text" // Using text as per "Username" label in image, though email is common
                                placeholder="Username or Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input py-3"
                                required
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4 position-relative" controlId="formBasicPassword">
                        <Form.Label className="text-white fw-semibold ms-1">Password</Form.Label>
                        <div className="position-relative">
                            <span className="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                </svg>
                            </span>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input py-3"
                                required
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-custom-gradient mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <span className="text-white">¿No tienes cuenta? </span>
                    <Button
                        variant="link"
                        className="text-info p-0"
                        onClick={() => router.push('/register')}
                    >
                        Regístrate aquí
                    </Button>
                </div>

                <div className="text-center mt-4">
                    <Link href="/forgot-password" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
