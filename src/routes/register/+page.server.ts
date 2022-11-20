import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import stripe from 'stripe'
import { SECRET_STRIPE_KEY, SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
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
	async send(event) {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const values = getValues(await request.formData())
		const email = values.email

		const { data: emailExists, error: checkEmailError } = await supabaseClient.rpc('email_exists', { email }).single()
		if (checkEmailError) {
            return invalid(500, {
				error: 'Something went wrong. Please try again later.',
				values
			})
        } else if (emailExists) {
			return invalid(500, {
				error: 'That email is already in use. Try another.',
				values
			})
		}
		
		const { error: signInError } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
            	shouldCreateUser: true
			}
		})
        if (signInError) {
			console.log(signInError)
            return invalid(500, {
				error: 'Server error. Try again later.',
				values
			});
        }
		
		return {
			type: 'success',
			values
		}
	},
    async create(event) {
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
		
		const stripeCustomer = await stripeClient.customers.create()
		const changeAccount = await fetch('https://api.getchange.io/api/v1/accounts', {
			method: 'POST',
			headers: { 'Authorization': `Basic ${changeCreds}`},
			body: JSON.stringify({
				email: values.email
			})
		}).then(r => r.ok ? r.json() : Promise.reject(r))
		const { error: registerError } = await supabaseClient.rpc('register', {
			stripe_id: stripeCustomer.id,
			change_id: changeAccount.id,
			first_name: values.firstName,
			last_name: values.lastName,
			percentage: values.percentage,
			designated: values.designated
		})
		if (registerError) {
			await stripeClient.customers.del(stripeCustomer.id)
			return invalid(500, {
				error: 'Could not register. Please try again later.',
				values
			})
		}
		
		throw redirect(303, '/dashboard')
    }
};