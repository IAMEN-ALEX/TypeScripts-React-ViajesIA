
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log('Running migration: Adding user_id to trips table...');

        // Add user_id column
        await pool.query('ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id INTEGER');

        // Add foreign key constraint (optional but good for integrity)
        await pool.query('ALTER TABLE trips ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');

        console.log('Migration successful!');
    } catch (error) {
        if (error.code === '42710') { // Duplicate object error (constraint already exists)
            console.log('Constraint already exists, skipping.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        await pool.end();
    }
}

migrate();
