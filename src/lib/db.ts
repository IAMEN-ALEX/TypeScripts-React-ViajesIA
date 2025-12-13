import { sql } from '@vercel/postgres';

// Helper to convert ? to $1, $2, etc. for Postgres
const formatQuery = (text: string): string => {
  let i = 0;
  return text.replace(/\?/g, () => `$${++i}`);
};

// Universal query function
export const query = async (queryString: string, params: any[] = []): Promise<any[]> => {
  const formattedQuery = formatQuery(queryString);
  const result = await sql.query(formattedQuery, params);
  return result.rows;
};

// Universal get function (single row)
export const get = async (queryString: string, params: any[] = []): Promise<any> => {
  const formattedQuery = formatQuery(queryString);
  const result = await sql.query(formattedQuery, params);
  return result.rows[0];
};

// Universal run function (INSERT, UPDATE, DELETE)
export const run = async (queryString: string, params: any[] = []): Promise<any> => {
  let formattedQuery = formatQuery(queryString);

  // If it's an INSERT, we need to return the ID to match expected behavior
  if (/^INSERT\s/i.test(formattedQuery.trim()) && !/RETURNING/i.test(formattedQuery)) {
    formattedQuery += ' RETURNING id';
  }

  try {
    const result = await sql.query(formattedQuery, params);
    return {
      lastID: result.rows[0]?.id || 0,
      changes: result.rowCount
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};
