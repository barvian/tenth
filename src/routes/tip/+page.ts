import type { PageServerLoad } from "./$types"
import { withLoadAuth } from "~/lib/auth"
import { redirect } from "@sveltejs/kit"
import { getSupabase } from "@supabase/auth-helpers-sveltekit"


export const load = withLoadAuth<PageServerLoad>(async (event) => {
	const { session } = await getSupabase(event)
	if (!session) return
	const parent = await event.parent()
    // Redirect if bank isn't ready in Stripe
	if (!parent.profile?.stripe_linked) throw redirect(303, '/link')
})