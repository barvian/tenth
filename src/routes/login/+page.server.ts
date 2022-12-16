import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { invalid, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	async default(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)

		const formData = await request.formData()
		const email = formData.get('email') as string
		const token = formData.get('token') as string

		const { error } = await supabaseClient.auth.verifyOtp({
			email,
			token,
			type: 'magiclink'
		})

		if (error?.name === 'AuthApiError') {
			return invalid(401, {
				error: `Couldn't log in. Please re-check your code.`,
				values: {
					email,
					token
				}
			})
		} else if (error) {
			return invalid(500, {
				error: `Couldn't log in. Please try again later.`,
				values: {
					email,
					token
				}
			})
		}

		throw redirect(303, event.url.searchParams.get('next') ?? '/')
	}
}
