// +page.server.js
export async function load({ locals }) {
	const session = await locals.getSession();

	return {
		data: session
	};
}
