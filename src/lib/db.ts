import mysql, { Pool } from 'mysql2/promise';

// Cache the pool on globalThis. In Next.js production each route/page is its own
// bundle, so a plain module-level singleton gets instantiated once PER bundle —
// every DB-touching route would open its own pool and the connections quickly
// exhaust MySQL's max_connections. globalThis is shared across the whole Node
// process, so this guarantees exactly one pool.
const globalForDb = globalThis as unknown as { __mysqlPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.__mysqlPool) {
    globalForDb.__mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'nissan',
      password: process.env.DB_PASSWORD || 'nissanpass',
      database: process.env.DB_NAME || 'nissan',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Drop idle connections so a burst doesn't leave them pinned open.
      idleTimeout: 60000,
      enableKeepAlive: true,
    });
  }
  return globalForDb.__mysqlPool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T[];
}
