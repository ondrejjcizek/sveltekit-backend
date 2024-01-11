import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { usersTable } from '$lib/server/schema.js';
import { createAuthJWT } from '$lib/server/jwt.js';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('authToken');

	// ensure the user is logged in
	if (token) {
		throw redirect(301, '/');
	}
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		// prepare request body
		const formData = await request.formData();
		const email = formData.get('email') || '';
		const password = formData.get('password') || '';
		const first_name = formData.get('first_name') || '';
		const last_name = formData.get('last_name') || '';

		// hashing password
		const hash = bcrypt.hashSync(password?.toString(), 10);

		// inserting new user to database
		const newUser = await db.insert(usersTable).values({
			first_name: first_name.toString(),
			last_name: last_name.toString(),
			email: email.toString(),
			password: hash
		});

		// creating JWT auth
		const token = await createAuthJWT({
			firstName: first_name.toString(),
			lastName: last_name.toString(),
			email: email.toString(),
			id: parseInt(newUser.insertId)
		});

		// setting expiring time for one month
		cookies.set('authToken', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(301, '/');
	}
};
