import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, json } from '@sveltejs/kit'
import { parseJSON } from '~/lib/fetch'
import { deleteDefaultSource } from '~/lib/stripe'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async (event) => {
	const { request } = event
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) throw error(403, 'No user logged in')
	const body = await request.json()

	// Attach to Change
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
		console.warn(
			`Change account ${updatedAccount.id} not marked as active after attaching new account`
		)

	// Then update the profile
	const { data: profile, error: updateError } = await supabaseClient
		.from('profiles')
		.update({
			plaid_access_token: null,
			plaid_institution_id: body.plaid_institution_id,
			plaid_account_mask: body.plaid_account_mask,
			plaid_account_type: body.plaid_account_type,
			plaid_account_subtype: body.plaid_account_subtype
		})
		.eq('user_id', session.user.id)
		.select()
		.single()
	if (updateError) throw updateError

	// Then remove old one from Stripe
	if (profile.stripe_id) await deleteDefaultSource(profile.stripe_id)

	return json({})
}
