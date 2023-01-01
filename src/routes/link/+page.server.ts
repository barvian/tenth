import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error } from '@sveltejs/kit'
import type Stripe from 'stripe'
import stripeClient from '~/lib/stripe'
import type { Actions } from './$types'

export const actions: Actions = {
	async unlink(event) {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		// First, unlink from Stripe
		const { data: profile, error: profileError } = await supabaseClient
			.from('profiles')
			.select('stripe_id')
			.single()
		if (profileError) throw profileError

		if (profile.stripe_id) {
			const stripeCustomer = (await stripeClient.customers.retrieve(
				profile.stripe_id
			)) as Stripe.Customer
			if (stripeCustomer.default_source) {
				await stripeClient.customers.deleteSource(
					stripeCustomer.id,
					stripeCustomer.default_source as string
				)
			}
		}

		// Unfortunately Change doesn't support a detach method, so just
		// update the profile
		const { error: updateError } = await supabaseClient
			.from('profiles')
			.update({
				plaid_institution_id: null,
				plaid_account_mask: null,
				plaid_account_type: null,
				plaid_account_subtype: null
			})
			.eq('user_id', session.user.id)
		if (updateError) throw updateError
	}
}
