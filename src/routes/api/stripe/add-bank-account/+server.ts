import { dev } from '$app/environment';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import plaidClient from '~/lib/plaid';
import stripeClient from '~/lib/stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { request } = event
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) throw error(403, 'No user logged in')
	const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('stripe_id').single()
	if (!profile?.stripe_id) throw profileError

	const body = await request.json()

	try {
		// Exchange the public_token from Plaid Link 
		const tokenResponse = await plaidClient.itemPublicTokenExchange({
			public_token: body.plaid_public_token,
		})
		const accessToken = tokenResponse.data.access_token;

		// Generate a Stripe bank token
		const stripeTokenResponse = await plaidClient.processorStripeBankAccountTokenCreate({
			access_token: accessToken,
			account_id: body.bank_account_id
		})
		const bankAccountToken = stripeTokenResponse.data.stripe_bank_account_token

		// Attach to Stripe customer
		const bankAccount = await stripeClient.customers.createSource(profile.stripe_id, {
			source: bankAccountToken
		})
		await stripeClient.customers.update(profile.stripe_id, {
			default_source: bankAccount.id
		})
	} catch (e) {
		console.error(`Couldn't add bank account to customer`, profile.stripe_id, e)
		throw e
	}
	

	return json({})
}
