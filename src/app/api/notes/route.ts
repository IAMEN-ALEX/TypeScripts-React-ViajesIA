import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

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

        const result = await run(
            'INSERT INTO notes (trip_id, content) VALUES (?, ?)',
            [trip_id, content]
        );

        return NextResponse.json({ success: true, id: result.lastID });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            error: 'Failed to create note',
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

        await run('DELETE FROM notes WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to delete note',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, content } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await run('UPDATE notes SET content = ? WHERE id = ?', [content, id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to update note',
            details: error.message
        }, { status: 500 });
    }
}

