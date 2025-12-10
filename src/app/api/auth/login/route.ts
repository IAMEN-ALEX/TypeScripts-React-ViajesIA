import { NextResponse } from 'next/server';
import { get } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Simple auth check
        const user = await get('SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?', [email, email, password]);

        if (user) {
            return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
