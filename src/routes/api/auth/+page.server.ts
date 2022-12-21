import { SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { AuthApiError } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import type stripe from 'stripe'
import { invalid, success } from '~/lib/actions'
import stripeClient from '~/lib/stripe'
import type { Actions, PageServerLoad } from './$types'
const changeCreds = Buffer.from(
	PUBLIC_CHANGE_KEY + ':' + SECRET_CHANGE_KEY
).toString('base64')

export const load: PageServerLoad = async (event) => {
	throw redirect(301, '/')
}

export const actions: Actions = {
	async 'send-otp'(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const data = await request.formData()
		const email = data.get('email') as string
		const newUser = data.has('new-user')

		const { data: emailExists, error: checkEmailError } = await supabaseClient
			.rpc('email_exists', { email })
			.single()
		if (checkEmailError) throw checkEmailError
		else if (newUser && emailExists)
			return invalid(406, data, {
				email: 'That email is already in use. Try another.'
			})
		else if (!newUser && !emailExists) {
			return invalid(406, data, {
				email: `We couldn't find a Tenth account with that email.`
			})
		}

		const { error: signInError } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: newUser
			}
		})
		if (signInError) throw signInError

		return success(data)
	},
	async register(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const data = await request.formData()
		const email = data.get('email') as string,
			first = data.get('first-name') as string,
			last = data.get('last-name') as string

		const { error: verifyError } = await supabaseClient.auth.verifyOtp({
			email: email,
			token: data.get('token') as string,
			type: 'magiclink'
		})
		if (verifyError instanceof AuthApiError && verifyError.status === 401)
			return invalid(401, data, {
				token: verifyError.message
			})
		else if (verifyError) throw verifyError

		let stripeCustomer: stripe.Customer | undefined
		try {
			stripeCustomer = await stripeClient.customers.create()

			const changeAccount = await fetch(
				'https://api.getchange.io/api/v1/accounts',
				{
					method: 'POST',
					headers: {
						Authorization: `Basic ${changeCreds}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: email,
						name: `${first} ${last}`
					})
				}
			).then((r) => (r.ok ? r.json() : Promise.reject(r.text())))
			console.log(`Created change account for ${email}`, changeAccount)

			const { error: registerError } = await supabaseClient.rpc('register', {
				stripe_id: stripeCustomer.id,
				change_id: changeAccount.id,
				first_name: first,
				last_name: last,
				percentage: +(data.get('percentage') as string),
				designated: JSON.parse(
					(data.get('designated') as string) || '[]'
				) as string[]
			})
			if (registerError) throw registerError
		} catch (e) {
			// Clean up before throwing

			await supabaseClient.auth.signOut()

			if (stripeCustomer)
				await stripeClient.customers.del(stripeCustomer.id).catch(() => null)

			throw e
		}

		throw redirect(303, '/link')
	},
	async login(event) {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)

		const data = await request.formData()
		const email = data.get('email') as string
		const token = data.get('token') as string
		const next = data.get('next') as string

		const { error } = await supabaseClient.auth.verifyOtp({
			email,
			token,
			type: 'magiclink'
		})
		if (error instanceof AuthApiError && error.status === 401)
			return invalid(401, data, {
				token: error.message
			})
		else if (error) throw error

		throw redirect(303, next || '/dashboard')
	},
	async logout(event) {
		const { supabaseClient } = await getSupabase(event)
		await supabaseClient.auth.signOut() // don't handle errors, I guess
		throw redirect(303, '/')
	}
}
