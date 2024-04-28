import { dev } from '$app/environment';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { redirect } from '@sveltejs/kit';
import { GitHub, Google } from 'arctic';
import { Lucia } from 'lucia';
import { db } from '../db';
import { sessionTable, userTable } from '../db/schema';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

// const baseUrl = process.env.VERCEL_URL
// 	? `https://${process.env.VERCEL_URL}`
// 	: 'https://localhost:5173';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attr) => {
		return {
			githubId: attr.githubId,
			userName: attr.userName,
			isAdmin: attr.isAdmin,
			createdAt: attr.createdAt,
			stripeId: attr.stripeId
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	githubId: number;
	userName: string;
	isAdmin: boolean;
	createdAt: Date;
	stripeId: string | null;
}
