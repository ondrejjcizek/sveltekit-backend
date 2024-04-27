import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db.js';
import { eq } from 'drizzle-orm';
import { usersTable } from '$lib/server/schema.js';
import { createAuthJWT } from '$lib/server/jwt.js';
import bcrypt from 'bcrypt';
import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('authToken');

	// ensure the user is logged in
	if (token && token !== '') {
		throw redirect(301, '/');
	}

	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const form = await superValidate(request, zod(formSchema));
		console.log(form.data.email);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const email = form.data.email;
		const password = form.data.password;

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
