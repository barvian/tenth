import { SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, error } from '@sveltejs/kit'
import { invalid, success } from '~/lib/actions'
import type stripe from 'stripe'
import stripeClient from '~/lib/stripe'
import type { Actions, PageServerLoad } from './$types'
const changeCreds = Buffer.from(
	PUBLIC_CHANGE_KEY + ':' + SECRET_CHANGE_KEY
).toString('base64')

export const load: PageServerLoad = async (event) => {
	const meta = {
		title: 'Donate a part of your bank account to charity every month',
		description: `Tenth is a platform enabling you to automatically donate a percentage of your bank account to charity every year`
	}

	const { session, supabaseClient } = await getSupabase(event)
	if (!session) return { meta }
	const parent = await event.parent()

	// Redirect if linking process is incomplete
	if (!parent.profile?.plaid_institution_id || !parent.profile?.stripe_linked)
		throw redirect(303, '/link')

	const institution = await event
		.fetch(
			`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`
		)
		.then((r) => (r.ok ? r.json() : Promise.reject(r.text())))

	const { data: change_ids } = await supabaseClient
		.from('designated')
		.select('change_id')
		.order('created_at', { ascending: true })
	let designated
	if (change_ids?.length) {
		designated = await Promise.all(
			change_ids.map((row) =>
				event
					.fetch(`/api/change/charities/${row.change_id}.json`)
					.then((r) => (r.ok ? r.json() : Promise.reject(r)))
			)
		)
	}

	return {
		meta,
		institution,
		designated
	}
}

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
		else if (emailExists)
			return invalid(406, data, {
				email: 'That email is already in use. Try another.'
			})

		const { error: signInError } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true
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
		// @ts-ignore
		if (verifyError && verifyError.status === 401)
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
				await stripeClient.customers.del(stripeCustomer.id).catch((e) => null)

			throw e
		}

		throw redirect(303, '/link')
	},
	async 'update-percentage'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const data = await request.formData()

		const { error: updateError } = await supabaseClient
			.from('profiles')
			.update({
				percentage: +(data.get('percentage') as string)
			})
			.eq('user_id', session.user.id)
		if (updateError) throw updateError

		return success(data)
	},
	async 'remove-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const data = await request.formData()
		const id = data.get('id') as string

		const { error: deleteError } = await supabaseClient
			.from('designated')
			.delete()
			.eq('change_id', id)
		if (deleteError) throw deleteError

		return success(data)
	}
}
