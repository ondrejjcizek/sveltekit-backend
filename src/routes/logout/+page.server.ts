import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.cookies.set('authToken', '', {
		path: '/',
		expires: new Date(0)
	});

	throw redirect(302, '/login');
};
