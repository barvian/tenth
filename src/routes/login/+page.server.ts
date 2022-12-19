import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import { invalid, success } from '~/lib/actions'
import type { Actions } from './$types'

export const actions: Actions = {
	async 'send-otp'(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const data = await request.formData()
		const email = data.get('email') as string

		const { data: emailExists, error: checkEmailError } = await supabaseClient
			.rpc('email_exists', { email })
			.single()
		if (checkEmailError) throw checkEmailError
		else if (!emailExists)
			return invalid(406, data, {
				email: `We couldn't find a Tenth account with that email.`
			})

		const { error: signInError } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: false
			}
		})
		if (signInError) throw signInError

		return success(data)
	},
	async login(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)

		const data = await request.formData()
		const email = data.get('email') as string
		const token = data.get('token') as string

		const { error } = await supabaseClient.auth.verifyOtp({
			email,
			token,
			type: 'magiclink'
		})
		// @ts-ignore
		if (error && error.status === 401)
			return invalid(401, data, {
				token: error.message
			})
		else if (error) throw error

		throw redirect(303, event.url.searchParams.get('next') ?? '/')
	}
}
