import { verifyAuthJWT } from '$lib/server/jwt.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const token = event.cookies.get('authToken');

	if (token) {
		return verifyAuthJWT(token);
	}
};
