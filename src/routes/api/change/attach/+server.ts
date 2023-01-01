import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, json } from '@sveltejs/kit'
import type Stripe from 'stripe'
import { parseJSON } from '~/lib/fetch'
import stripeClient from '~/lib/stripe'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async (event) => {
	const { request } = event
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) throw error(403, 'No user logged in')

	// First unlink from Stripe

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

	// Then attach to Change

	const body = await request.json()

	const updatedAccount = await fetch(
		'https://api.getchange.io/api/v1/accounts/attach_bank_account',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				link_token: body.link_token,
				plaid_public_token: body.plaid_public_token,
				bank_account_id: body.bank_account_id
			})
		}
	).then(parseJSON)
	if (!updatedAccount?.active)
		throw new Error(
			`Change account ${updatedAccount.id} not marked as active after attaching new account`
		)

	// And update the profile
	const { error: updateError } = await supabaseClient
		.from('profiles')
		.update({
			plaid_institution_id: body.plaid_institution_id,
			plaid_account_mask: body.plaid_account_mask,
			plaid_account_type: body.plaid_account_type,
			plaid_account_subtype: body.plaid_account_subtype
		})
		.eq('user_id', session.user.id)
	if (updateError) throw updateError

	return json({})
}
