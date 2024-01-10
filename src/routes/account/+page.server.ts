import { verifyAuthJWT } from '$lib/server/jwt.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const token = event.cookies.get('auth_token');

	if (!token) {
		throw redirect(301, '/sign-up');
	}

	return verifyAuthJWT(token);
};
