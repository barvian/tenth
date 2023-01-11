import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import { invalid, success } from '~/lib/actions'
import serviceRoleClient from '~/lib/db.server'
import stripeClient from '~/lib/stripe.server'
import type { Actions } from './$types'

export const actions: Actions = {
	async update(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		const data = await request.formData()
		const email = data.get('email') as string

		const { error: updateError } = await supabaseClient
			.from('users')
			.update({
				first_name: data.get('first') as string,
				last_name: data.get('last') as string
			})
			.eq('id', session.user.id)
		if (updateError) throw updateError

		if (session.user.email && session.user.email !== email) {
			const { error: updateError } = await supabaseClient.auth.updateUser({
				email
			})
			// TODO: more precise error handling here
			if (updateError)
				return invalid(422, data, {
					email: `Couldn't update email. Please try again later.`
				})
			else return success(data, { email_changed: true })
		}

		return success(data)
	},
	async delete(event) {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		const { data: profile, error: profileError } = await supabaseClient
			.from('users')
			.select('stripe_cus_id')
			.single()
		if (profileError) throw profileError

		await stripeClient.customers.del(profile.stripe_cus_id)

		await supabaseClient.auth.signOut() // don't handle errors I guess

		const { error: deleteError } =
			await serviceRoleClient.auth.admin.deleteUser(session.user.id)
		if (deleteError) throw deleteError

		throw redirect(303, '/')
	}
}
