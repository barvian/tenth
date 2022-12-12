import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, invalid } from '@sveltejs/kit';
import stripeClient from '~/lib/stripe';
import type Stripe from 'stripe'
import type { Actions, PageServerLoad } from './$types';
import { withLoadAuth } from '~/lib/auth';

export const load = withLoadAuth<PageServerLoad>(async (event) => {
	const { supabaseClient, session } = await getSupabase(event)
	if (!session) return
	const parent = await event.parent()

	let institution: any
	if (parent.profile?.plaid_institution_id) {
		institution = await event.fetch(`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`)
			.then(r => r.ok ? r.json() : Promise.reject(r))
	}
        
	return {
		institution
	}
})

export const actions: Actions = {
	async unlink(event) {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		
		try {
			// First, unlink from Stripe
			const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('stripe_id').single()
			if (profileError) throw profileError

			if (profile.stripe_id) {
				const stripeCustomer = await stripeClient.customers.retrieve(profile.stripe_id) as Stripe.Customer
				if (stripeCustomer.default_source) {
					await stripeClient.customers.deleteSource(stripeCustomer.id, stripeCustomer.default_source as string)
				}
			}

			// Unfortunately Change doesn't support a detach method, so just
			// update the profile
			const { error: updateError } = await supabaseClient.from('profiles').update({
				plaid_institution_id: null,
				plaid_account_mask: null,
				plaid_account_type: null,
				plaid_account_subtype: null
			}).eq('user_id', session.user.id)
			if (updateError) throw updateError
		} catch (e) {
			return invalid(500) // Don't trigger an error boundary
		}
	}
}