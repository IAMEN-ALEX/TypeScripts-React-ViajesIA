import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const trip_id = searchParams.get('trip_id');
        const headersList = await headers();
        const userId = headersList.get('x-user-id');

        // Only allow fetching notes if authenticated
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (trip_id) {
            // Validate trip ownership
            const trips = await query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [trip_id, userId]);
            if (trips.length === 0) {
                return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
            }

            const notes = await query('SELECT * FROM notes WHERE trip_id = ? ORDER BY id DESC', [trip_id]);
            return NextResponse.json(notes);
        } else {
            // Fetch all notes for all user's trips?
            // Not strictly used by frontend currently, but consistent:
            const notes = await query(`
                SELECT n.* FROM notes n
                JOIN trips t ON n.trip_id = t.id
                WHERE t.user_id = ?
                ORDER BY n.id DESC
             `, [userId]);
            return NextResponse.json(notes);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { trip_id, content } = await req.json();
        const headersList = await headers();
        const userId = headersList.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!trip_id || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify trip ownership
        const trips = await query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [trip_id, userId]);
        if (trips.length === 0) {
            return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
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
        const headersList = await headers();
        const userId = headersList.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        // Verify note ownership via trip
        const notes = await query(`
            SELECT n.* FROM notes n
            JOIN trips t ON n.trip_id = t.id
            WHERE n.id = ? AND t.user_id = ?
        `, [id, userId]);

        if (notes.length === 0) {
            return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
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
        const headersList = await headers();
        const userId = headersList.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify note ownership
        const notes = await query(`
            SELECT n.* FROM notes n
            JOIN trips t ON n.trip_id = t.id
            WHERE n.id = ? AND t.user_id = ?
        `, [id, userId]);

        if (notes.length === 0) {
            return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
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

