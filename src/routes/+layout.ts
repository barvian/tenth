import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) return

	const { data: profile, error: profileError } = await supabaseClient
		.from('profiles')
		.select(
			'stripe_id, first_name, last_name, plaid_institution_id, plaid_account_mask, plaid_access_token, percentage'
		)
		.single()
	event.depends('supabase:profile')
	if (profileError) throw profileError

	return {
		session,
		profile: {
			plaid_institution_id: profile.plaid_institution_id,
			plaid_account_mask: profile.plaid_account_mask,
			plaid_access_token: profile.plaid_access_token,
			percentage: profile.percentage,
			first_name: profile.first_name,
			last_name: profile.last_name
		}
	}
}
