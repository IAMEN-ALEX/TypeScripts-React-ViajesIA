import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse } from '@/types';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data: AuthResponse = await res.json();

            if (res.ok) {
                const userName = data.user?.name || data.user?.email || 'Usuario';
                const userId = data.user?.id?.toString() || '';
                localStorage.setItem('userName', userName);
                localStorage.setItem('userId', userId);
                router.push('/dashboard');
                return true;
            } else {
                setError(data.details || data.error || 'Error al iniciar sesión');
                return false;
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data: AuthResponse = await res.json();

            if (res.ok) {
                router.push('/login?registered=true');
                return true;
            } else {
                setError(data.error || 'Error al registrar usuario');
                return false;
            }
        } catch (err) {
            setError('Error de conexión');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, register, isLoading, error, setError };
};
