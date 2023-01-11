import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createClient } from '@supabase/supabase-js'

const serviceRoleClient = createClient<App.Supabase['Database']>(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
)

export default serviceRoleClient

export async function getUserForStripeCustomerId<Query extends string>(
	stripe_cus_id: string,
	fields: Query
) {
	const { data, error } = await serviceRoleClient
		.from('users')
		.select<Query>(fields)
		.eq('stripe_cus_id', stripe_cus_id)
		.single()
	if (error) throw error
	else if (!data)
		throw new Error(`Could not find user for Stripe customer ${stripe_cus_id}`)
	return data
}
