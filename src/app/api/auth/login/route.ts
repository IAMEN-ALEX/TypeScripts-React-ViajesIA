import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { User } from '@/types';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son obligatorios' },
                { status: 400 }
            );
        }

        // Find user by email
        const users = await query<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const user = users[0];

        // Check if password is hashed (starts with $2a$ or $2b$)
        const isHashed = user.password.startsWith('$2');

        let isValidPassword = false;

        if (isHashed) {
            // Compare with bcrypt for hashed passwords
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            // Direct comparison for legacy plain text passwords
            isValidPassword = password === user.password;
        }

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Return user data (excluding password)
        return NextResponse.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Error al iniciar sesión' },
            { status: 500 }
        );
    }
}
