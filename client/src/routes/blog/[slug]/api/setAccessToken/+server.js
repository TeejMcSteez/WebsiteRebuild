import { redirect } from '@sveltejs/kit';

export async function GET({ url, cookies, params }) {
	// Expecting the access token in the "access_token" query parameter.
	const token = url.searchParams.get('access_token');
	if (token) {
		cookies.set('supabase-auth-token', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});
	}
	throw redirect(302, `../../${params.slug}`);
}

// Added POST handler to support POST requests with similar logic.
export async function POST({ request, cookies, params }) {
	const url = new URL(request.url);
	// Expecting the access token in the "access_token" query parameter.
	const token = url.searchParams.get('access_token');
	if (token) {
		cookies.set('supabase-auth-token', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});
	}
	throw redirect(302, `../../${params.slug}`);
}
