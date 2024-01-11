import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db.js';
import { eq } from 'drizzle-orm';
import { todosTable } from '$lib/server/schema.js';
import { verifyAuthJWT } from '$lib/server/jwt.js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('authToken');

	// ensure the user is logged in
	if (!token) {
		throw redirect(301, '/login');
	}

	const userPayload = await verifyAuthJWT(token);

	// selecting todos using JWT payload
	const todos = await db
		.select({
			completed: todosTable.completed,
			description: todosTable.description,
			title: todosTable.title,
			id: todosTable.id
		})
		.from(todosTable)
		.where(eq(todosTable.user_id, userPayload.id));

	return { todos, userPayload };
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		// prepare request body
		const formData = await request.formData();
		const id = formData.get('id') || '';

		// ensure the user is logged in
		const token = cookies.get('authToken');
		if (!token) {
			throw redirect(301, '/login');
		}

		await verifyAuthJWT(token);

		await db.delete(todosTable).where(eq(todosTable.id, parseInt(id.toString())));

		return { success: true };
	},
	complete: async ({ request, cookies }) => {
		// prepare request body
		const formData = await request.formData();
		const id = formData.get('id') || '';

		// ensure the user is logged in
		const token = cookies.get('authToken');
		if (!token) {
			throw redirect(301, '/login');
		}

		await verifyAuthJWT(token);

		await db
			.update(todosTable)
			.set({ completed: true })
			.where(eq(todosTable.id, parseInt(id.toString())));

		return { success: true };
	},
	create: async ({ request, cookies }) => {
		// prepare request body
		const formData = await request.formData();
		const title = formData.get('title') || '';
		const description = formData.get('description') || '';

		if (description === '' || title === '') {
			return { success: false };
		}

		// ensure the user is logged in
		const token = cookies.get('authToken');
		if (!token) {
			throw redirect(301, '/login');
		}

		const userPayload = await verifyAuthJWT(token);

		await db.insert(todosTable).values({
			title: title.toString(),
			description: description.toString(),
			user_id: userPayload.id,
			completed: false
		});

		return { success: true };
	}
};
