import { handleAuth } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import '~/../mocks'

export const handle: Handle = sequence(
	...handleAuth({
		cookieOptions: { lifetime: 1 * 365 * 24 * 60 * 60 }
	})
);