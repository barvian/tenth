import serviceRoleClient from '$lib/db.server'
import { sendMail } from '$lib/mail.server'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { AuthApiError } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import type stripe from 'stripe'
import { invalid, success } from '~/lib/actions'
import stripeClient from '~/lib/stripe.server'
import type { Action, Actions, PageServerLoad } from './$types'
import VerifyOtp from '/emails/VerifyOTP.svelte'

export const load: PageServerLoad = async () => {
	throw redirect(301, '/')
}

const sendOtp: Action = (event) => {
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

	if (newUser) {
		const { error: createUserError } =
			await serviceRoleClient.auth.admin.createUser({ email })
		if (
			createUserError &&
			!createUserError.message.match(/already registered/i)
		)
			throw createUserError
	}
	const {
		data: { properties },
		error: generateLinkError
	} = await serviceRoleClient.auth.admin.generateLink({
		email,
		type: 'magiclink'
	})
	if (generateLinkError || !properties?.email_otp) throw generateLinkError

	await sendMail(VerifyOtp, { otp: properties.email_otp }, { to: email })

	return success(data)
}

const register: Action = async (event) => {
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

		const { error: registerError } = await supabaseClient.rpc('register', {
			stripe_cus_id: stripeCustomer.id,
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
}

const login: Action = async (event) => {
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
}

const logout: Action = (event) => {
	const { supabaseClient } = await getSupabase(event)
	await supabaseClient.auth.signOut() // don't handle errors, I guess
	throw redirect(303, '/')
}

export const actions: Actions = { 'send-otp': sendOtp, register, login, logout }
