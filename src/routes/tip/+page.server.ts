import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, invalid, redirect } from '@sveltejs/kit';
import { withLoadAuth } from '~/lib/auth';
import type { Actions, PageServerLoad } from './$types';
import stripeClient from '~/lib/stripe'

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await getSupabase(event)
        if (!session) throw error(403, 'No user logged in')

        const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('stripe_id').single()
        if (profileError) throw profileError
        if (!profile.stripe_id) throw error(403, 'User has no stripe ID')

        const formData = await event.request.formData()
        const amount = +(formData.get('amount') as string)

        try {
            await stripeClient.charges.create({
                amount,
                customer: profile.stripe_id,
                description: 'Tenth tip',
                currency: 'usd',
                receipt_email: session.user.email
            })

            return { values: { amount } }
        } catch (e) {
            console.log(`Could not receive tip from customer ${profile.stripe_id}`, e)
            // TODO: more precise handling
            return invalid(500)
        }
	}
}