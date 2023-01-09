import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, json } from '@sveltejs/kit'
import { CountryCode, Products } from 'plaid'
import plaidClient from '~/lib/plaid'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) throw error(403, 'No user logged in')

	const { data: profile, error: profileError } = await supabaseClient
		.from('profiles')
		.select('plaid_institution_id, plaid_account_type, plaid_account_subtype')
		.single()
	if (profileError || !profile || !profile?.plaid_account_type)
		throw error(500, 'Could not retrieve plaid_account_type for logged in user')

	const res = await plaidClient.linkTokenCreate({
		client_name: 'Tenth',
		products: [Products.Auth], // Balance is not valid, it'll be added automatically
		language: 'en',
		country_codes: [CountryCode.Us],
		user: {
			client_user_id: session.user.id
		},
		account_filters: {
			[profile.plaid_account_type]: {
				account_subtypes: profile.plaid_account_subtype
					? [profile.plaid_account_subtype]
					: undefined
			}
		}
	})

	return json(res.data.link_token)
}
