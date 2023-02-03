import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Load, type LoadEvent } from '@sveltejs/kit'

// Redirect if not logged in
export function withLoadAuth<RT>(fn: (event: LoadEvent) => RT) {
	return (async (event) => {
		const { session } = await getSupabase(event)
		if (!session) {
			throw redirect(
				303,
				`/login?next=${encodeURIComponent(event.url.pathname)}`
			)
		}

		return fn(event)
	}) satisfies Load
}

// Redirect if already logged in
export function withLoadNoAuth<RT>(fn: (event: LoadEvent) => RT) {
	return (async (event) => {
		const { session } = await getSupabase(event)
		if (session) {
			throw redirect(303, event.url.searchParams.get('next') || '/dashboard')
		}

		return fn(event)
	}) satisfies Load
}
