import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, run } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser && existingUser.length > 0) {
            return NextResponse.json(
                { error: 'El email ya está registrado' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        return NextResponse.json(
            {
                message: 'Usuario registrado exitosamente',
                userId: result.lastID
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
}
