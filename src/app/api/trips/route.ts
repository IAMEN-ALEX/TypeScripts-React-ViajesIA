import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET() {
    try {
        const trips = await query('SELECT * FROM trips ORDER BY id DESC');
        return NextResponse.json(trips);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { destination, start_date, end_date } = await req.json();

        if (!destination || !start_date || !end_date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await run(
            'INSERT INTO trips (destination, start_date, end_date) VALUES (?, ?, ?)',
            [destination, start_date, end_date]
        );

        return NextResponse.json({ success: true, id: result.lastID });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to create trip',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        await run('DELETE FROM trips WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to delete trip',
            details: error.message
        }, { status: 500 });
    }
}
