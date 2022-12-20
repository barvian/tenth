import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import stripeClient from '~/lib/stripe'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) return

	const { data: profile, error: profileError } = await supabaseClient
		.from('profiles')
		.select(
			'stripe_id, first_name, last_name, plaid_institution_id, plaid_account_mask, percentage'
		)
		.single()
	if (profileError) throw profileError

	// Check if the Stripe customer is fully configured (aka the linking process is complete)
	let stripe_linked = false
	if (profile.stripe_id) {
		const stripeCustomer = await stripeClient.customers.retrieve(
			profile.stripe_id
		)
		stripe_linked = Boolean(stripeCustomer?.default_source)
	}

	return {
		session,
		profile: {
			plaid_institution_id: profile.plaid_institution_id,
			plaid_account_mask: profile.plaid_account_mask,
			percentage: profile.percentage,
			first_name: profile.first_name,
			last_name: profile.last_name,
			stripe_linked
		}
	}
}
