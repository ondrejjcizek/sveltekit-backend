import { db } from '$lib/server/db.js';
import { usersTable } from '$lib/server/schema.js';
import { createAuthJWT } from '$lib/server/jwt.js';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load = async (event) => {
	const token = event.cookies.get('auth_token');

	if (token) {
		throw redirect(301, '/');
	}
};

export const actions = {
	default: async (event) => {
		// NOTE: THIS SHOULD BE VALIDATED I'M JUST LAZY FOR THIS EXAMPLE
		const formData = await event.request.formData();
		const email = formData.get('email') || '';
		const password = formData.get('password') || '';
		const first_name = formData.get('first_name') || '';
		const last_name = formData.get('last_name') || '';

		const hash = bcrypt.hashSync(password?.toString(), 10);

		const newUser = await db.insert(usersTable).values({
			first_name: first_name.toString(),
			last_name: last_name.toString(),
			email: email.toString(),
			password: hash
		});

		const token = await createAuthJWT({
			firstName: first_name.toString(),
			lastName: last_name.toString(),
			email: email.toString(),
			id: parseInt(newUser.insertId)
		});

		event.cookies.set('auth_token', token, {
			path: '/'
		});

		throw redirect(301, '/account');
	}
};
