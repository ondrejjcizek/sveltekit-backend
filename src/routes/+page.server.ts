import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const token = cookies.get('authToken');

	if (!token) {
		throw redirect(301, '/login');
	}
};
