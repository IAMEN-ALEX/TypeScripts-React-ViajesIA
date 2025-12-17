import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool;

if (!process.env.POSTGRES_URL) {
  console.warn('POSTGRES_URL environment variable is not defined');
}

// Singleton pattern for the pool to avoid too many connections in development
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false // Required for some Supabase connections
    }
  });
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  pool = (global as any).postgresPool;
}

// Helper to convert ? to $1, $2, etc. for Postgres compatibility
const formatQuery = (text: string): string => {
  let i = 0;
  return text.replace(/\?/g, () => `$${++i}`);
};

// Universal query function
export const query = async <T extends QueryResultRow = any>(queryString: string, params: any[] = []): Promise<T[]> => {
  const formattedQuery = formatQuery(queryString);
  const client = await pool.connect();
  try {
    const result: QueryResult<T> = await client.query(formattedQuery, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// Universal get function (single row)
export const get = async <T extends QueryResultRow = any>(queryString: string, params: any[] = []): Promise<T | undefined> => {
  const formattedQuery = formatQuery(queryString);
  const client = await pool.connect();
  try {
    const result: QueryResult<T> = await client.query(formattedQuery, params);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Universal run function (INSERT, UPDATE, DELETE)
export const run = async (queryString: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  let formattedQuery = formatQuery(queryString);

  // If it's an INSERT, we need to return the ID to match expected behavior
  if (/^INSERT\s/i.test(formattedQuery.trim()) && !/RETURNING/i.test(formattedQuery)) {
    formattedQuery += ' RETURNING id';
  }

  const client = await pool.connect();
  try {
    const result = await client.query(formattedQuery, params);
    return {
      lastID: result.rows[0]?.id || 0,
      changes: result.rowCount || 0
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  } finally {
    client.release();
  }
};
