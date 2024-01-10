import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DB_URL) {
	throw new Error('DB_URL environment variable is required.');
}

export default {
	schema: './src/lib/server/schema.ts',
	out: './src/lib/server/migrations',
	driver: 'mysql2',
	dbCredentials: {
		uri: process.env.DB_URL
	}
} satisfies Config;
