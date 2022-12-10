import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import stripeClient from '~/lib/stripe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { supabaseClient, session } = await getSupabase(event)

    if (session) {
		// Check if the Stripe customer is fully configured (aka the linking process is complete)
        const { data: profile, error: profileError } = await supabaseClient.from('profiles').select(
            'stripe_id'
        ).single()
		if (!profile?.stripe_id) throw profileError

		const stripeCustomer = await stripeClient.customers.retrieve(profile?.stripe_id)
		return {
			stripe_linked: Boolean(stripeCustomer?.default_source)
		}
	}
}