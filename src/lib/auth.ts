import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Load } from '@sveltejs/kit'

// Redirect if not logged in
export function withLoadAuth<L>(fn?: L): Load {
	return async (event) => {
		const { session } = await getSupabase(event)
		if (!session) {
			throw redirect(
				303,
				`/login?next=${encodeURIComponent(event.url.pathname)}`
			)
		}

		if (fn instanceof Function) return fn(event)
	}
}

// Redirect if already logged in
export function withLoadNoAuth<L>(fn?: L): Load {
	return async (event) => {
		const { session } = await getSupabase(event)
		if (session) {
			throw redirect(303, event.url.searchParams.get('next') ?? '/dashboard')
		}

		if (fn instanceof Function) return fn(event)
	}
}
