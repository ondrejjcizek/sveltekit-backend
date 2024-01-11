import type { PageServerLoad } from './$types';
import { verifyAuthJWT } from '$lib/server/jwt.js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('authToken');

	// ensure the user is logged in
	if (!token) {
		throw redirect(301, '/register');
	}

	return verifyAuthJWT(token);
};
