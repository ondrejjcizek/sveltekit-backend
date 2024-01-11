import { db } from '$lib/server/db.js';
import { usersTable } from '$lib/server/schema.js';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { createAuthJWT } from '$lib/server/jwt.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('authToken');

	if (token && token !== '') {
		throw redirect(301, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			throw error(400, 'must provide an email and password');
		}

		// check if the user exists
		const user = await db
			.select({
				email: usersTable.email,
				password: usersTable.password,
				first_name: usersTable.first_name,
				last_name: usersTable.last_name,
				id: usersTable.id
			})
			.from(usersTable)
			.where(eq(usersTable.email, email.toString()))
			.limit(1);

		if (user.length === 0) {
			throw error(404, 'user account not found');
		}

		// check if the password is correct
		const passwordIsRight = await bcrypt.compare(password.toString(), user[0].password);

		if (!passwordIsRight) {
			throw error(400, 'incorrect password...');
		}

		// create the JWT
		const token = await createAuthJWT({
			firstName: user[0].first_name,
			lastName: user[0].last_name,
			email: user[0].email,
			id: user[0].id
		});

		event.cookies.set('authToken', token, {
			path: '/'
		});

		throw redirect(301, '/');
	}
};
