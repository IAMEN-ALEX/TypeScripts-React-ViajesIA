import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const trip_id = searchParams.get('trip_id');

        if (trip_id) {
            const notes = await query('SELECT * FROM notes WHERE trip_id = ? ORDER BY id DESC', [trip_id]);
            return NextResponse.json(notes);
        } else {
            const notes = await query('SELECT * FROM notes ORDER BY id DESC');
            return NextResponse.json(notes);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { trip_id, content } = await req.json();

        if (!trip_id || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result: any = await query(
            'INSERT INTO notes (trip_id, content) VALUES (?, ?) RETURNING id',
            [trip_id, content]
        );

        return NextResponse.json({ success: true, id: result[0]?.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        await query('DELETE FROM notes WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
