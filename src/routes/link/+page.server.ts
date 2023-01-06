import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error } from '@sveltejs/kit'
import { deleteDefaultSource } from '~/lib/stripe'
import type { Actions } from './$types'

export const actions: Actions = {
	async unlink(event) {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		// Change doesn't support a detach method, so just
		// update the profile
		const { data: profile, error: updateError } = await supabaseClient
			.from('profiles')
			.update({
				plaid_access_token: null,
				plaid_institution_id: null,
				plaid_account_mask: null,
				plaid_account_type: null,
				plaid_account_subtype: null
			})
			.eq('user_id', session.user.id)
			.select()
			.single()
		if (updateError) throw updateError

		// Remove old source from Stripe
		if (profile.stripe_id) await deleteDefaultSource(profile.stripe_id)
	}
}
