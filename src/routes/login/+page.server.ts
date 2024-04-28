// import type { PageServerLoad, Actions } from './$types';
// import { fail, redirect } from '@sveltejs/kit';
// import { generateIdFromEntropySize } from 'lucia';

// import { superValidate } from 'sveltekit-superforms';
// import { formSchema } from './schema';
// import { zod } from 'sveltekit-superforms/adapters';
// import { db } from '$lib/server/db';

// export const load: PageServerLoad = async ({ cookies }) => {
// 	const token = cookies.get('authToken');

// 	// ensure the user is logged in
// 	// if (token && token !== '') {
// 	// 	throw redirect(301, '/');
// 	// }

// 	return {
// 		form: await superValidate(zod(formSchema))
// 	};
// };

// export const actions: Actions = {
// 	default: async ({ cookies, request }) => {
// 		const form = await superValidate(request, zod(formSchema));
// 	}
// };
