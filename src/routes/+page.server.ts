import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import stripe from 'stripe'
import { SECRET_STRIPE_KEY, SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { ChangeAccountCreationError } from '~/lib/change';
const changeCreds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')

const getValues = (formData: FormData) => ({
	percentage: +(formData.get('percentage') as string)/100,
	email: formData.get('email') as string,
	firstName: formData.get('first-name') as string,
	lastName: formData.get('last-name') as string,
	designated: JSON.parse(formData.get('designated') as string || '[]') as string[],
	token: formData.get('token') as string
})

export const actions: Actions = {
    async register(event) {
        const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const stripeClient = new stripe(SECRET_STRIPE_KEY, {
			apiVersion: '2022-08-01'
		})
		const values = getValues(await request.formData())
		
        const { error: verifyError } = await supabaseClient.auth.verifyOtp({
			email: values.email,
			token: values.token,
			type: 'magiclink'
		})
        if (verifyError) {
			return invalid(500, {
				error: 'Could not verify one-time code. Try again.',
				values
			})
        }
		
		let stripeCustomer: stripe.Customer | undefined, changeAccount
		try {
			stripeCustomer = await stripeClient.customers.create()

			changeAccount = await fetch('https://api.getchange.io/api/v1/accounts', {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${changeCreds}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: values.email,
					name: `${values.firstName} ${values.lastName}`
				})
			}).then(async r => {
				if (r.ok) return r.json()
				throw new ChangeAccountCreationError(await r.text())
			})

			console.log('change account', changeAccount)
			const { error: registerError } = await supabaseClient.rpc('register', {
				stripe_id: stripeCustomer.id,
				change_id: changeAccount.id,
				first_name: values.firstName,
				last_name: values.lastName,
				percentage: values.percentage,
				designated: values.designated
			})
			if (registerError) throw registerError
		} catch (e) {
			if (stripeCustomer) await stripeClient.customers.del(stripeCustomer.id).catch(e => null)

			if (e instanceof ChangeAccountCreationError) {
				console.error('Could not create Change account for email %s', values.email, e)
			} else {
				console.error('Registration failed for email %s', values.email, e)
			}
			return invalid(500, {
				error: 'Could not register. Please try again later.',
				values
			})
		}
		
		throw redirect(303, '/dashboard')
    }
};