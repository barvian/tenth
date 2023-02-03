import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, json } from '@sveltejs/kit'
import type Stripe from 'stripe'
import serviceRoleClient from '~/lib/db.server'
import stripeClient from '~/lib/stripe.server'
import type { Json } from '~/lib/supabase'
import type { RequestHandler } from './session/$types'

export const POST = (async (event) => {
	const { session } = await getSupabase(event)
	if (!session) throw error(403, 'No user logged in')

	const acceptance = {
		accepted_at: new Date().getTime(),
		type: 'online',
		online: {
			ip_address: event.getClientAddress(),
			user_agent: event.request.headers.get('User-Agent') || 'N/A'
		}
	} satisfies Stripe.PaymentIntentCreateParams.MandateData.CustomerAcceptance

	const { data, error: updateError } = await serviceRoleClient
		.from('users')
		.update({
			last_acceptance: acceptance as unknown as Json
		})
		.eq('id', session.user.id)
		.select()
		.single()
	if (updateError) throw updateError
	if (!data.stripe_cus_id) throw error(403, 'User has no stripe customer ID') // this should never happen

	const res = await stripeClient.financialConnections.sessions.create({
		account_holder: { type: 'customer', customer: data.stripe_cus_id },
		permissions: ['balances', 'payment_method']
	})

	return json(res.client_secret)
}) satisfies RequestHandler
