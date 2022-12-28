import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { createClient } from '@supabase/supabase-js'
import { error } from '@sveltejs/kit'
import { invalid, success } from '~/lib/actions'
import stripeClient from '~/lib/stripe'
import type { Actions } from './$types'

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		const { data: profile, error: profileError } = await supabaseClient
			.from('profiles')
			.select('stripe_id, recurring_tip')
			.single()
		if (profileError) throw profileError
		if (!profile.stripe_id && !profile.recurring_tip)
			throw error(403, 'Cannot give tips')

		const formData = await event.request.formData()
		// TODO: maybe handle no frequency passed
		const frequency = formData.get('frequency') as string
		const amount = parseFloat(formData.get(frequency) as string)
		if (amount == null || isNaN(amount))
			return invalid(406, formData, {
				[frequency]: 'Please enter a valid number.'
			})
		const cents = +(amount * 100).toFixed(2)
		if (cents < 50 && !(profile.recurring_tip && cents === 0)) {
			return invalid(406, formData, {
				[frequency]: 'Amount must be greater than $0.50'
			})
		}

		if (formData.get('frequency') === 'recurring') {
			const { error: updateError } = await supabaseClient
				.from('profiles')
				.update({
					recurring_tip: cents || null
				})
				.eq('user_id', session.user.id)
			if (updateError) throw updateError
		} else {
			await stripeClient.charges.create({
				amount: cents,
				customer: profile.stripe_id,
				description: 'Tenth tip',
				currency: 'usd',
				receipt_email: session.user.email
			})

			const supabaseServiceRoleClient = createClient(
				PUBLIC_SUPABASE_URL,
				SUPABASE_SERVICE_ROLE_KEY
			)
			await supabaseServiceRoleClient // don't throw
				.from('tips')
				.update({ ytd: cents })
				.eq('only_one', true)
		}

		return success(formData)
	}
}
