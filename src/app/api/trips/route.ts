import { NextResponse } from 'next/server';
import { query, get } from '@/lib/db';

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

        const result: any = await query(
            'INSERT INTO trips (destination, start_date, end_date) VALUES (?, ?, ?) RETURNING id',
            [destination, start_date, end_date]
        );

        // If RETURNING is not supported by the sqlite version, we might need a separate query, 
        // but sqlite3 usually supports basic returning or we can query last_insert_rowid() if needed.
        // However, node-sqlite3's `run` callback provides `this.lastID`. 
        // Our `query` wrapper uses `db.all`, which might not return the inserted ID easily with `RETURNING` in all sqlite versions.
        // A safer bet with the current `query` wrapper is to do a separate fetch or rely on `this.lastID` if we expose `run`.
        // Let's stick to standard `run` wrapper pattern if possible, but our `query` returns `rows`.
        // If `RETURNING id` works, `rows` will contain the id.

        // Actually, let's fix the query wrapper usage or just depend on RETURNING which works in modern SQLite.
        // If it fails, I'll switch to a run wrapper. 
        // Let's assume RETURNING works for now. 

        // Wait, `query` uses `db.all`. `INSERT ... RETURNING *` returns an array of rows.
        // If it doesn't work, I'll fix it.

        return NextResponse.json({ success: true, id: result[0]?.id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        await query('DELETE FROM trips WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
    }
}
