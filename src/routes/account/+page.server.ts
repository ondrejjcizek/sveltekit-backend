import { verifyAuthJWT } from '$lib/server/jwt.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const token = event.cookies.get('authToken');

	if (!token) {
		throw redirect(301, '/register');
	}

	return verifyAuthJWT(token);
};
