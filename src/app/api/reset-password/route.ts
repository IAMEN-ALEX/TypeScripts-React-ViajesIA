import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, run } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();

        // Validation
        if (!email || !newPassword) {
            return NextResponse.json(
                { error: 'Email y nueva contraseña son obligatorios' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Check if user exists
        const users = await query<{ id: number }>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: 'No existe una cuenta con ese email' },
                { status: 404 }
            );
        }

        const user = users[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await run(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
        );

        return NextResponse.json(
            { message: 'Contraseña actualizada exitosamente' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            {
                error: 'Error al restablecer contraseña',
                details: error.message
            },
            { status: 500 }
        );
    }
}
