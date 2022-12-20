import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { createClient } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import { invalid, success } from '~/lib/actions'
import stripeClient from '~/lib/stripe'
import type { Actions } from './$types'

export const actions: Actions = {
	async update(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)

		const data = await request.formData()
		const email = data.get('email') as string

		const { error } = await supabaseClient.auth.updateUser({ email })
		// TODO: more precise error handling here
		if (error)
			return invalid(422, data, {
				email: `Couldn't update email. Please try again later.`
			})

		return success(data)
	},
	async delete(event) {
		const { session, supabaseClient } = await getSupabase(event)
		const supabaseServiceRoleClient = createClient(
			PUBLIC_SUPABASE_URL,
			SUPABASE_SERVICE_ROLE_KEY
		)

		const { data: profile, error: profileError } = await supabaseClient
			.from('profiles')
			.select('stripe_id')
			.single()
		if (profileError) throw profileError

		await stripeClient.customers.del(profile.stripe_id)

		await supabaseClient.auth.signOut() // don't handle errors I guess

		const { error } = await supabaseServiceRoleClient.auth.admin.deleteUser(
			session?.user.id!
		)
		if (error) throw error

		throw redirect(303, '/')
	}
}
