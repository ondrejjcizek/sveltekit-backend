import { SvelteKitAuth } from '@airbadge/sveltekit';

// use GitHub OAuth provider
import GitHub from '@auth/core/providers/github';

// use Prisma database adapter
import { PrismaAdapter } from '@auth/prisma-adapter';

// import Prisma client for database adapter
import { PrismaClient } from '@prisma/client';

// import env vars for OAuth client
import { env } from '$env/dynamic/private';

// init database client
const db = new PrismaClient();

// add Auth.js + Stripe handler
// API is similar to Auth.js
export const handle = SvelteKitAuth({
	adapter: PrismaAdapter(db),
	providers: [
		GitHub({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET
		})
	],
	secret: 'BRzKEp0Dyl0FGOO990ABSYnbIXvJmludYAwLyg2sGLY=',

	// configure list of plans.
	plans: [
		{ id: 'basic', name: 'Basic', priceId: 'price_basic', price: 500, default: true },
		{ id: 'pro', name: 'Pro', priceId: 'price_pro', price: 1000 },
		{ id: 'enterprise', name: 'Enterprise', priceId: 'price_enterprise', price: 2000 }
	],
	pages: {
		checkout: {
			success: '/dashboard',
			cancel: '/pricing'
		},
		portalReturn: '/dashboard'
	}
});
