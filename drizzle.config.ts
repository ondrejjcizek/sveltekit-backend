import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DB_URL) {
	throw new Error('DATABASE_URL environment variable is required.');
}

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.DB_URL,
		authToken: process.env.DB_TOKEN
	}
} satisfies Config;
